import { Injectable, Inject } from '@nestjs/common';
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
    console.log(
      `[GeminiService] 🤖 Starting AI extraction for Doc: ${documentId}`,
    );

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
        console.log(`[GeminiService] Detected slip type: ${slipType}`);
      } catch {
        console.warn(
          '[GeminiService] Could not parse type detection result; falling back to UNKNOWN',
        );
      }

      // 3. Pass 2 — full extraction using the slip-specific prompt
      const config = getExtractionConfig(slipType);

      const extractionModel = this.genAI.getGenerativeModel({
        model: agent_models.GEMINI_2_MODEL,
        systemInstruction: config.systemInstruction,
      });

      const extracted = await this.runExtractionWithValidation({
        extractionModel,
        inlineData,
        slipType,
        expectedSchemaType: config.schemaType,
        userPrompt: config.userPrompt,
      });

      console.log(
        `[GeminiService] ✅ Extraction complete for ${slipType} (Doc: ${documentId}, promptVersion: ${config.promptVersion}, schemaVersion: ${config.schemaVersion})`,
      );
      return extracted;
    } catch (error) {
      console.error(`[GeminiService] ❌ AI Extraction failed`, error);
      // Re-throw already-classified errors from inner try/catch blocks
      if (error instanceof ExtractionError) throw error;
      throw classifyError(error);
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
  }): Promise<Record<string, unknown>> {
    const initialResponse = await extractionModel.generateContent([
      { inlineData },
      userPrompt,
    ]);

    const initialResponseText = this.normalizeModelResponse(
      initialResponse.response.text(),
    );

    try {
      return this.parseAndValidateExtraction(
        initialResponseText,
        slipType,
        expectedSchemaType,
      );
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

      return this.parseAndValidateExtraction(
        retryResponseText,
        slipType,
        expectedSchemaType,
      );
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
