import { MASTRA_STORE, type MastraStore } from '@hq/database';
import {
  createFinanceAgent,
  createFinanceEntryExtractionAgent,
} from '@hq/tools';
import { Inject, Injectable } from '@nestjs/common';
import {
  ExtractionWorkflow,
  ExtractionWorkflowSteps,
} from './workflows/extraction.workflow';
import { type EnvConfig, envConfig } from 'src/config/env';

interface ExtractedEntry {
  date?: string;
  amount?: number;
  currency?: string;
  category?: string;
  description?: string;
  taxYear?: string;
  type?: string;
}

@Injectable()
export class AiService {
  constructor(
    @Inject(envConfig.KEY) private readonly config: EnvConfig,
    @Inject(MASTRA_STORE) private readonly mastraStore: MastraStore,
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
      apiKey: this.config.AI_API_KEY,
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

  async extractFinancialEntry(
    documentContent: string,
    userId: string,
  ): Promise<ExtractedEntry> {
    const extractionAgent = createFinanceEntryExtractionAgent({
      apiKey: this.config.AI_API_KEY,
      id: `extraction-${userId}-${Date.now()}`,
      name: 'Financial Entry Extraction Agent',
    });

    console.log('[AiService] Starting extraction for user:', userId);

    const prompt = `
Extract financial entry data from the following document:

${documentContent}

Provide the extracted data in the exact JSON format specified in your instructions.
`;

    const result = await extractionAgent.generate(prompt);

    console.log('[AiService] Extraction result:', result.text);

    try {
      // Extract JSON from markdown code blocks if present
      let jsonText = result.text.trim();

      // Remove markdown code fences (```json and ```)
      const codeBlockMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (codeBlockMatch) {
        jsonText = codeBlockMatch[1].trim();
      }

      // Parse the JSON response from the agent
      const parsed = JSON.parse(jsonText);

      // Handle case where AI returns an array of entries (e.g., from a paystub with multiple line items)
      // For now, we take the first entry. Future enhancement: return all entries and let user choose
      const extracted: ExtractedEntry = Array.isArray(parsed)
        ? parsed[0]
        : parsed;

      if (Array.isArray(parsed) && parsed.length > 1) {
        console.warn(
          `[AiService] ⚠️ Multiple entries detected (${parsed.length}). Using first entry. Consider implementing multi-entry selection in the UI.`,
        );
      }

      // Return the extracted data with all optional fields
      return {
        date: extracted?.date ?? undefined,
        amount: extracted?.amount ?? undefined,
        currency: extracted?.currency ?? undefined,
        category: extracted?.category ?? undefined,
        description: extracted?.description ?? undefined,
        taxYear: extracted?.taxYear ?? undefined,
        type: extracted?.type ?? undefined,
      };
    } catch (error) {
      console.error('[AiService] Failed to parse extraction result:', error);
      throw new Error('Failed to extract financial entry data from document');
    }
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
