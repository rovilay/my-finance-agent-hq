import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { KmsService, CipherUtil } from '@hq/encryption';
import { GcsService } from '../document/gcs.service';
import { type EnvConfig, envConfig } from 'src/config/env';
import { agent_models } from '@hq/tools';
import {
  DOCUMENT_TYPE_DETECTION,
  getExtractionConfig,
  type SlipType,
} from './extraction-prompts';

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

      const extractionResult = await extractionModel.generateContent([
        { inlineData },
        config.userPrompt,
      ]);

      const responseText = extractionResult.response
        .text()
        .replace(/```json|```/g, '')
        .trim();

      const extracted = JSON.parse(responseText);

      // Ensure the documentType is always present even if the model omitted it
      if (!extracted.documentType && slipType !== 'UNKNOWN') {
        extracted.documentType = slipType;
      }

      console.log(
        `[GeminiService] ✅ Extraction complete for ${slipType} (Doc: ${documentId})`,
      );
      return extracted;
    } catch (error) {
      console.error(`[GeminiService] ❌ AI Extraction failed`, error);
      throw new InternalServerErrorException('AI failed to read the document.');
    }
  }
}
