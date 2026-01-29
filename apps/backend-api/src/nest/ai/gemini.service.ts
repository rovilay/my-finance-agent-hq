import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { KmsService, CipherUtil } from '@hq/encryption';
import { GcsService } from '../document/gcs.service';
import { type EnvConfig, envConfig } from 'src/config/env';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor(
    @Inject(envConfig.KEY) private readonly config: EnvConfig,
    private readonly kmsService: KmsService,
    private readonly gcsService: GcsService,
  ) {
    this.genAI = new GoogleGenerativeAI(this.config.GEMINI_API_KEY);
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
      // 1. Get the raw data (Download & Decrypt)
      const encryptedFile = await this.gcsService.download(storagePath);
      const dek = await this.kmsService.unwrapKey(wrappedDek);
      const decryptedFileBuffer = CipherUtil.decrypt(
        encryptedFile.toString(CipherUtil.ENCODING),
        dek,
      );

      // 2. Initialize the Model with a strict JSON response schema
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: `You are an expert Canadian tax assistant. 
          Extract fields from the provided tax document (usually a T4). 
          Return ONLY a JSON object. If a field is missing, return null. 
          Focus on: employmentIncome, incomeTaxDeducted, cppContributions, eiPremiums.`,
      });

      // 3. Call Gemini with the file buffer
      const result = await model.generateContent([
        {
          inlineData: {
            data: decryptedFileBuffer.toString('base64'),
            mimeType,
          },
        },
        'Extract all tax-relevant fields from this document into JSON format.',
      ]);

      const responseText = result.response.text();

      // We parse it here just to validate it's real JSON before passing back to DocumentService
      return JSON.parse(responseText.replace(/```json|```/g, '').trim());
    } catch (error) {
      console.error(`[GeminiService] ❌ AI Extraction failed`, error);
      throw new InternalServerErrorException('AI failed to read the document.');
    }
  }
}
