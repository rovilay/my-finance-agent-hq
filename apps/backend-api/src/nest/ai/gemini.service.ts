import { Injectable, Inject, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { KmsService, CipherUtil } from '@hq/encryption';
import { GcsService } from '../document/gcs.service';
import { type EnvConfig, envConfig } from 'src/config/env';
import { agent_models } from '@hq/tools';
import {
  taxSlipExtractionSchemas,
  type SupportedSlipSchemaType,
} from '@hq/validation-schema';
import {
  DOCUMENT_TYPE_DETECTION,
  getExtractionConfig,
  getRepairPrompt,
  type SlipType,
} from './extraction-prompts';

/** Thrown when Gemini extraction fails with a classifiable reason. */
export class ExtractionError extends Error {
  constructor(
    public readonly reason:
      | 'unsupported_type'
      | 'quality_too_poor'
      | 'incomplete_document'
      | 'values_unreadable'
      | 'processing_error',
    message: string,
  ) {
    super(message);
    this.name = 'ExtractionError';
  }
}

/** Maps a raw error to a typed ExtractionError reason. */
function classifyError(error: unknown): ExtractionError {
  const msg =
    error instanceof Error
      ? error.message.toUpperCase()
      : String(error).toUpperCase();

  if (
    msg.includes('SAFETY') ||
    msg.includes('RECITATION') ||
    msg.includes('PROHIBITED') ||
    msg.includes('UNSUPPORTED_USER_LOCATION')
  ) {
    return new ExtractionError(
      'unsupported_type',
      'Document blocked by safety filters.',
    );
  }
  if (msg.includes('SYNTAXERROR') || error instanceof SyntaxError) {
    return new ExtractionError(
      'values_unreadable',
      'Extraction succeeded but the response could not be parsed.',
    );
  }
  return new ExtractionError(
    'processing_error',
    'Gemini failed to process the document.',
  );
}

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private genAI: GoogleGenerativeAI;

  constructor(
    @Inject(envConfig.KEY) private readonly config: EnvConfig,
    private readonly kmsService: KmsService,
    private readonly gcsService: GcsService,
  ) {
    this.genAI = new GoogleGenerativeAI(this.config.AI_API_KEY);
  }

  async extractTaxData(
    documentId: string,
    wrappedDek: string,
    storagePath: string,
    mimeType: string,
  ) {
    const startedAt = Date.now();
    this.logger.log(`Starting extraction for document ${documentId}`);

    try {
      // 1. Download & decrypt
      const encryptedFile = await this.gcsService.download(storagePath);
      const dek = await this.kmsService.unwrapKey(wrappedDek);
      const decryptedFileBuffer = CipherUtil.decrypt(
        encryptedFile.toString(CipherUtil.ENCODING),
        dek,
      );
      const fileBase64 = decryptedFileBuffer.toString('base64');
      const inlineData = { data: fileBase64, mimeType };

      // 2. Pass 1 — detect document type
      const detectionModel = this.genAI.getGenerativeModel({
        model: agent_models.GEMINI_2_MODEL,
        systemInstruction: DOCUMENT_TYPE_DETECTION.systemInstruction,
      });

      const detectionResult = await detectionModel.generateContent([
        { inlineData },
        DOCUMENT_TYPE_DETECTION.userPrompt,
      ]);

      let slipType: SlipType = 'UNKNOWN';
      try {
        const detectionText = detectionResult.response
          .text()
          .replace(/```json|```/g, '')
          .trim();
        const detected = JSON.parse(detectionText);
        slipType = (detected?.documentType ?? 'UNKNOWN') as SlipType;
        this.logger.debug(`Detected slip type ${slipType} for ${documentId}`);
      } catch {
        this.logger.warn(
          `Could not parse type detection response for ${documentId}; using UNKNOWN`,
        );
      }

      // 3. Pass 2 — full extraction using the slip-specific prompt
      const config = getExtractionConfig(slipType);

      const extractionModel = this.genAI.getGenerativeModel({
        model: agent_models.GEMINI_2_MODEL,
        systemInstruction: config.systemInstruction,
      });

      const { extracted, retryCount } = await this.runExtractionWithValidation({
        extractionModel,
        inlineData,
        slipType,
        expectedSchemaType: config.schemaType,
        userPrompt: config.userPrompt,
      });

      this.logger.log(
        JSON.stringify({
          event: 'ai_extraction_completed',
          documentId,
          step: 'extraction',
          model: agent_models.GEMINI_2_MODEL,
          slipType,
          promptVersion: config.promptVersion,
          schemaVersion: config.schemaVersion,
          retryCount,
          latencyMs: Date.now() - startedAt,
        }),
      );
      return extracted;
    } catch (error) {
      const classifiedError =
        error instanceof ExtractionError ? error : classifyError(error);
      this.logger.error(
        JSON.stringify({
          event: 'ai_extraction_failed',
          documentId,
          step: 'extraction',
          model: agent_models.GEMINI_2_MODEL,
          failureReason: classifiedError.reason,
          message: classifiedError.message,
          latencyMs: Date.now() - startedAt,
        }),
      );
      throw classifiedError;
    }
  }

  private async runExtractionWithValidation({
    extractionModel,
    inlineData,
    slipType,
    expectedSchemaType,
    userPrompt,
  }: {
    extractionModel: ReturnType<GoogleGenerativeAI['getGenerativeModel']>;
    inlineData: { data: string; mimeType: string };
    slipType: SlipType;
    expectedSchemaType: SupportedSlipSchemaType;
    userPrompt: string;
  }): Promise<{ extracted: Record<string, unknown>; retryCount: number }> {
    const initialResponse = await extractionModel.generateContent([
      { inlineData },
      userPrompt,
    ]);

    const initialResponseText = this.normalizeModelResponse(
      initialResponse.response.text(),
    );

    try {
      return {
        extracted: this.parseAndValidateExtraction(
          initialResponseText,
          slipType,
          expectedSchemaType,
        ),
        retryCount: 0,
      };
    } catch (error) {
      if (!(error instanceof ExtractionError)) throw error;
      if (error.reason !== 'values_unreadable') throw error;

      const repairPrompt = getRepairPrompt({
        userPrompt,
        validationError: error.message,
        previousInvalidResponse: initialResponseText,
      });

      const retryResponse = await extractionModel.generateContent([
        { inlineData },
        repairPrompt,
      ]);

      const retryResponseText = this.normalizeModelResponse(
        retryResponse.response.text(),
      );

      return {
        extracted: this.parseAndValidateExtraction(
          retryResponseText,
          slipType,
          expectedSchemaType,
        ),
        retryCount: 1,
      };
    }
  }

  private normalizeModelResponse(responseText: string): string {
    return responseText.replace(/```json|```/g, '').trim();
  }

  private parseAndValidateExtraction(
    responseText: string,
    slipType: SlipType,
    expectedSchemaType: SupportedSlipSchemaType,
  ): Record<string, unknown> {
    let extracted: Record<string, unknown>;
    try {
      extracted = JSON.parse(responseText) as Record<string, unknown>;
    } catch {
      throw new ExtractionError(
        'values_unreadable',
        'Extraction succeeded but the JSON response could not be parsed.',
      );
    }

    if (!extracted.documentType && slipType !== 'UNKNOWN') {
      extracted.documentType = slipType;
    }

    const schemaSlipType = this.resolveSchemaSlipType(
      slipType,
      extracted.documentType,
      expectedSchemaType,
    );
    const schema = taxSlipExtractionSchemas[schemaSlipType];
    const validationResult = schema.safeParse(extracted);

    if (!validationResult.success) {
      const issues = validationResult.error.issues
        .map((issue) => `${issue.path.join('.') || 'root'}: ${issue.message}`)
        .join('; ');
      throw new ExtractionError(
        'values_unreadable',
        `Extraction JSON failed schema validation for ${schemaSlipType}. ${issues}`,
      );
    }

    return validationResult.data as Record<string, unknown>;
  }

  private resolveSchemaSlipType(
    detectedSlipType: SlipType,
    extractedDocumentType: unknown,
    expectedSchemaType: SupportedSlipSchemaType,
  ): SupportedSlipSchemaType {
    if (expectedSchemaType !== 'UNKNOWN') {
      return expectedSchemaType;
    }

    if (
      typeof extractedDocumentType === 'string' &&
      this.isSupportedSchemaSlipType(extractedDocumentType)
    ) {
      return extractedDocumentType;
    }

    if (this.isSupportedSchemaSlipType(detectedSlipType)) {
      return detectedSlipType;
    }

    return 'UNKNOWN';
  }

  private isSupportedSchemaSlipType(
    slipType: string,
  ): slipType is SupportedSlipSchemaType {
    return slipType in taxSlipExtractionSchemas;
  }
}
