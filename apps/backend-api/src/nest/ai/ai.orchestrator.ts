import { Injectable, Logger } from '@nestjs/common';
import { ExtractionWorkflow } from './workflows/extraction.workflow';

@Injectable()
export class AiOrchestrator {
  private readonly logger = new Logger(AiOrchestrator.name);

  constructor(private readonly extractionWorkflow: ExtractionWorkflow) {}

  async initiateExtraction(documentId: string) {
    this.logger.log(
      `⚡ Initiating AI extraction workflow for document: ${documentId}`,
    );

    try {
      const workflow = this.extractionWorkflow.createWorkflow();

      // resourceId links the workflow to the document for future 'resume' calls
      const run = await workflow.createRun({ resourceId: documentId });

      // Fire and forget - don't await the full execution
      run.start({ inputData: { documentId } }).catch((err) => {
        this.logger.error(
          `❌ Background workflow failed for ${documentId}:`,
          err,
        );
      });
    } catch (error) {
      this.logger.error(
        `❌ Failed to create workflow run for ${documentId}`,
        error,
      );
    }
  }
}
