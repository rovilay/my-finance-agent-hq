import { Workflow, createStep } from '@mastra/core/workflows';
import { Injectable } from '@nestjs/common';
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
        console.log(
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
        console.log(`[Mastra] Step: Extraction | Doc: ${inputData.documentId}`);

        const result = await this.geminiService.extractTaxData(
          inputData.documentId,
          inputData.wrappedDek ?? '',
          inputData.storagePath ?? '',
          inputData.mimeType,
        );

        return {
          documentId: inputData.documentId,
          extractedJson: result,
        };
      },
    });

    // NEW STEP: The "Human-in-the-Loop" Verification
    const verifyStep = createStep({
      id: ExtractionWorkflowSteps.VERIFY,
      inputSchema: z.object({
        documentId: z.string(),
        extractedJson: z.any(),
      }),
      outputSchema: z.object({
        documentId: z.string(),
        extractedJson: z.any(),
        approved: z.boolean(),
        shouldKeepFile: z.boolean(),
      }),
      resumeSchema: z.object({
        approved: z.boolean(),
        shouldKeepFile: z.boolean(),
      }),
      execute: async ({ inputData, resumeData, suspend }) => {
        // 1. If we don't have resumeData, it means the workflow JUST reached this step.
        if (!resumeData) {
          console.log(
            `[Mastra] ⏸️ Suspending for user verification: ${inputData.documentId}`,
          );

          // We call suspend and pass a "suspendPayload" (metadata for the UI)
          return await suspend({
            message: 'Please verify the extracted tax data.',
            documentId: inputData.documentId,
          });
        }

        // 2. If we ARE here and resumeData exists, Mastra has "woken up" the workflow.
        console.log(`[Mastra] ▶️ Resumed with decision:`, resumeData);

        return {
          documentId: inputData.documentId,
          extractedJson: inputData.extractedJson,
          approved: resumeData.approved,
          shouldKeepFile: resumeData.shouldKeepFile,
        };
      },
    });

    // STEP 3: Persistence - save results
    const persistenceStep = createStep({
      id: ExtractionWorkflowSteps.PERSISTENCE,
      inputSchema: z.object({
        documentId: z.string(),
        extractedJson: z.any(),
      }),
      outputSchema: z.object({
        status: z.literal('complete'),
      }),
      execute: async ({ inputData }) => {
        console.log(`[Mastra] Step: Persistence | Securing results in DB`);

        await this.documentService.saveExtractedData(
          inputData.documentId,
          inputData.extractedJson,
        );

        return { status: 'complete' as const };
      },
    });

    // Build the workflow using the builder pattern
    const workflow = new Workflow({
      id: 'document-extraction',
      inputSchema: z.object({
        documentId: z.string(),
      }),
      outputSchema: z.object({
        status: z.literal('complete'),
      }),
    })
      .then(prepareStep)
      .then(extractionStep)
      .then(verifyStep)
      .then(persistenceStep)
      .commit();

    return workflow;
  }
}
