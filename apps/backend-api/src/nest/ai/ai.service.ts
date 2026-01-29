import { type MastraStore } from '@hq/database';
import { createFinanceAgent } from '@hq/tools';
import { Injectable } from '@nestjs/common';
import {
  ExtractionWorkflow,
  ExtractionWorkflowSteps,
} from './workflows/extraction.workflow';

@Injectable()
export class AiService {
  constructor(
    private readonly apiKey: string,
    private readonly mastraStore: MastraStore,
    private readonly extractionWorkflow: ExtractionWorkflow,
  ) {}

  async getAdvisorInsights(
    prompt: string,
    userId: string,
    context?: any,
  ): Promise<string> {
    const resourceId = userId;
    const threadId = `${resourceId}-tax-advisor-thread`;

    // We pass the deterministic tool results as "ground truth" to the agent
    const systemContext = context
      ? `
      CONTEXT DATA: ${JSON.stringify(context)}
      INSTRUCTION: Use the above context as the absolute source of truth for numbers.
    `
      : '';

    const financeAgent = createFinanceAgent({
      mastraStore: this.mastraStore,
      apiKey: this.apiKey,
      id: threadId,
      name: 'Finance-Tax Advisor Agent',
      additionalInstructions: systemContext,
    });

    const memoryContext = {
      thread: threadId,
      resource: resourceId,
    };

    const result = await financeAgent.generate(prompt, {
      memory: memoryContext,
    });

    return result.text;
  }

  async verifyDocument(
    documentId: string,
    approved: boolean,
    shouldKeepFile: boolean,
  ): Promise<boolean> {
    // This method is intentionally left blank as the logic has been moved to AiResolver
    console.log(`[AiResolver] 🔘 Resuming workflow for Doc: ${documentId}`);

    try {
      // 1. Get the workflow instance
      const workflow = this.extractionWorkflow.createWorkflow();

      // 2. Locate the specific run using the resourceId (the documentId)
      // Mastra's createRun with an existing resourceId links to the persistent state
      const run = await workflow.createRun({
        resourceId: documentId,
      });

      // 3. Send the resume data to the 'verify' step
      await run.resume({
        step: ExtractionWorkflowSteps.VERIFY,
        resumeData: {
          approved,
          shouldKeepFile,
        },
      });

      return true;
    } catch (error) {
      console.error(`[AiResolver] ❌ Failed to resume workflow:`, error);
      return false;
    }
  }
}
