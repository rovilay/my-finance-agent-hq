import { type MastraStore } from '@hq/database';
import { createFinanceAgent } from '@hq/tools';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  constructor(
    private readonly apiKey: string,
    private readonly mastraStore: MastraStore,
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
}
