import { Workflow, createStep } from '@mastra/core/workflows';
import { Injectable, Logger } from '@nestjs/common';
import { z } from 'zod';
import { DocumentService } from '../../document/document.service';
import { GeminiService } from '../gemini.service';

export enum ExtractionWorkflowSteps {
  PREPARE = 'prepare',
  EXTRACTION = 'extraction',
  VERIFY = 'verify',
  PERSISTENCE = 'persistence',
}

@Injectable()
export class ExtractionWorkflow {
  constructor(
    private readonly documentService: DocumentService,
    private readonly geminiService: GeminiService,
  ) {}

  private readonly logger = new Logger(ExtractionWorkflow.name);

  // Define the orchestrated flow
  createWorkflow() {
    // STEP 1: Preparation - fetch document metadata
    const prepareStep = createStep({
      id: ExtractionWorkflowSteps.PREPARE,
      inputSchema: z.object({
        documentId: z.string(),
      }),
      outputSchema: z.object({
        documentId: z.string(),
        wrappedDek: z.string().nullable(),
        storagePath: z.string().optional(),
        mimeType: z.string(),
      }),
      execute: async ({ inputData }) => {
        this.logger.log(
          `[Mastra] Step 1: Fetching metadata for Doc: ${inputData.documentId}`,
        );

        const doc = await this.documentService.findDocOrThrow(
          inputData.documentId,
        );

        return {
          documentId: inputData.documentId,
          wrappedDek: doc.wrappedDek ?? null,
          storagePath: doc.storagePath,
          mimeType: doc.fileMetadata.mimeType,
        };
      },
    });

    // STEP 2: Extraction - run AI processing
    const extractionStep = createStep({
      id: ExtractionWorkflowSteps.EXTRACTION,
      inputSchema: z.object({
        documentId: z.string(),
        wrappedDek: z.string().nullable(),
        storagePath: z.string().optional(),
        mimeType: z.string(),
      }),
      outputSchema: z.object({
        documentId: z.string(),
        extractedJson: z.any(),
      }),
      execute: async ({ inputData }) => {
        this.logger.log(
          `[Mastra] Step: Extraction | Doc: ${inputData.documentId}`,
        );

        const result = await this.geminiService.extractTaxData(
          inputData.documentId,
          inputData.wrappedDek ?? '',
          inputData.storagePath ?? '',
          inputData.mimeType,
        );

        // Save extracted data to database (encrypted)
        this.logger.log(
          `[Mastra] Saving extracted data for Doc: ${inputData.documentId}`,
        );
        await this.documentService.saveExtractedData(
          inputData.documentId,
          result,
        );

        return {
          documentId: inputData.documentId,
          extractedJson: result,
        };
      },
    });

    // Verification step - workflow ends here, user reviews in UI
    // Note: We skip workflow suspension for MVP - verification handled via API call

    // Build the workflow using the builder pattern
    // Note: Workflow ends after extraction - verification handled via API
    const workflow = new Workflow({
      id: 'document-extraction',
      inputSchema: z.object({
        documentId: z.string(),
      }),
      outputSchema: z.object({
        documentId: z.string(),
        extractedJson: z.any(),
      }),
    })
      .then(prepareStep)
      .then(extractionStep)
      .commit();

    return workflow;
  }

  async initiateExtraction(documentId: string) {
    this.logger.log(
      `⚡ Initiating AI extraction workflow for document: ${documentId}`,
    );

    try {
      const workflow = this.createWorkflow();

      // Create a run instance
      const run = await workflow.createRun({ resourceId: documentId });

      // Execute workflow (PREPARE → EXTRACTION steps only)
      // Workflow will complete after extraction, no suspension
      await run.start({ inputData: { documentId } });

      this.logger.log(
        `✅ Workflow completed EXTRACTION step for ${documentId}, ready for verification`,
      );
    } catch (error) {
      this.logger.error(
        `❌ Failed to execute workflow for ${documentId}`,
        error,
      );
    }
  }

  // Note: Verification and persistence now handled directly in DocumentService
  // No workflow resumption needed for MVP
}
