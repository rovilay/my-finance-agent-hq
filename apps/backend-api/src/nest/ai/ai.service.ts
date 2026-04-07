import { MASTRA_STORE, type MastraStore } from '@hq/database';
import {
  createFinanceAgent,
  createFinanceEntryExtractionAgent,
  createTaxEducationAgent,
} from '@hq/tools';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import {
  ExtractionWorkflow,
  ExtractionWorkflowSteps,
} from './workflows/extraction.workflow';
import { type EnvConfig, envConfig } from 'src/config/env';
import { TaxService } from '../tax/tax.service';
import { FinancialEntryService } from '../financial-entry/financial-entry.service';
import { FinancialType } from '../financial-entry/models/financial-entry.model';
import { TaxProjection } from '../tax/models/tax.model';
import { CacheService } from '@hq/cache';
import { User } from '../auth/models/user.model';

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
  private readonly CACHE_TTL_SECONDS = 5 * 60; // 5 minutes
  private readonly CACHE_KEY_PREFIX = 'financial-context:';

  constructor(
    @Inject(envConfig.KEY) private readonly config: EnvConfig,
    @Inject(MASTRA_STORE) private readonly mastraStore: MastraStore,
    private readonly extractionWorkflow: ExtractionWorkflow,
    @Inject(forwardRef(() => TaxService))
    private readonly taxService: TaxService,
    @Inject(forwardRef(() => FinancialEntryService))
    private readonly financialEntryService: FinancialEntryService,
    private readonly cacheService: CacheService,
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

  private getCacheKey(entityId: string, taxYear?: string): string {
    return `${this.CACHE_KEY_PREFIX}${entityId}-${taxYear || 'current'}`;
  }

  private async getCachedFinancialData(
    entityId: string,
    taxYear?: string,
  ): Promise<string | null> {
    const cacheKey = this.getCacheKey(entityId, taxYear);
    const cached = await this.cacheService.get(cacheKey);

    if (cached) {
      console.log('[AiService] Using cached financial data from cache');
    }

    return cached;
  }

  private async setCachedFinancialData(
    entityId: string,
    taxYear: string | undefined,
    data: string,
  ): Promise<void> {
    const cacheKey = this.getCacheKey(entityId, taxYear);
    await this.cacheService.set(cacheKey, data, this.CACHE_TTL_SECONDS);
    console.log(
      '[AiService] Cached financial data with TTL:',
      this.CACHE_TTL_SECONDS,
      's',
    );
  }

  /**
   * Invalidate cached financial data for an entity
   * Call this when financial entries are created/updated/deleted
   */
  async invalidateFinancialCache(
    entityId: string,
    taxYear?: string,
  ): Promise<void> {
    const cacheKey = this.getCacheKey(entityId, taxYear);
    await this.cacheService.del(cacheKey);
    console.log('[AiService] Invalidated financial cache:', cacheKey);
  }

  private async fetchFinancialContext(
    entityId: string,
    taxYear?: string,
  ): Promise<string> {
    try {
      // Fetch financial entries
      const entries = await this.financialEntryService.findByEntity(
        entityId,
        taxYear,
      );

      // Fetch tax projection if tax year is provided
      let taxProjection: TaxProjection | null = null;
      if (taxYear) {
        try {
          taxProjection = await this.taxService.calculateProjection(
            entityId,
            taxYear,
          );
        } catch (error) {
          console.log('[AiService] Could not fetch tax projection:', error);
        }
      }

      // Build financial context summary
      const incomeEntries = entries.filter(
        (e) => e.type === FinancialType.income,
      );
      const deductionEntries = entries.filter(
        (e) => e.type === FinancialType.deduction,
      );
      const creditEntries = entries.filter(
        (e) => e.type === FinancialType.credit,
      );
      const taxPaidEntries = entries.filter(
        (e) => e.type === FinancialType.taxPaid,
      );

      const totalIncome = incomeEntries.reduce((sum, e) => sum + e.amount, 0);
      const totalDeductions = deductionEntries.reduce(
        (sum, e) => sum + e.amount,
        0,
      );
      const totalCredits = creditEntries.reduce((sum, e) => sum + e.amount, 0);
      const totalTaxPaid = taxPaidEntries.reduce((sum, e) => sum + e.amount, 0);

      let financialContext = `

===== USER'S FINANCIAL DATA =====
You have access to the user's financial information. Use this data to answer their questions.

Tax Year: ${taxYear || 'Not specified'}

FINANCIAL ENTRIES:
- Total Income: $${totalIncome.toFixed(2)} CAD (${incomeEntries.length} entries)
- Total Deductions: $${totalDeductions.toFixed(2)} CAD (${deductionEntries.length} entries)
- Total Credits: $${totalCredits.toFixed(2)} CAD (${creditEntries.length} entries)
- Total Tax Paid: $${totalTaxPaid.toFixed(2)} CAD (${taxPaidEntries.length} entries)

INCOME BREAKDOWN:
${incomeEntries.map((e) => `  - ${e.category}: $${e.amount.toFixed(2)} (${e.date.toISOString().split('T')[0]})`).join('\n') || '  No income entries yet'}

DEDUCTION BREAKDOWN:
${deductionEntries.map((e) => `  - ${e.category}: $${e.amount.toFixed(2)} (${e.date.toISOString().split('T')[0]})`).join('\n') || '  No deduction entries yet'}

CREDIT BREAKDOWN:
${creditEntries.map((e) => `  - ${e.category}: $${e.amount.toFixed(2)} (${e.date.toISOString().split('T')[0]})`).join('\n') || '  No credit entries yet'}

TAX PAID BREAKDOWN:
${taxPaidEntries.map((e) => `  - ${e.category}: $${e.amount.toFixed(2)} (${e.date.toISOString().split('T')[0]})`).join('\n') || '  No tax paid entries yet'}
`;

      if (taxProjection) {
        financialContext += `
TAX PROJECTION:
- Total Income for Tax: $${taxProjection.incomeTotal.toFixed(2)}
- Total Deductions: $${taxProjection.deductionsTotal.toFixed(2)}
- Taxable Income: $${taxProjection.taxableIncome.toFixed(2)}
- Federal Tax: $${taxProjection.federalTax.toFixed(2)}
- Provincial Tax (Ontario): $${taxProjection.provincialTax.toFixed(2)}
- Total Tax Owed: $${taxProjection.totalTax.toFixed(2)}
- Credits Applied: $${taxProjection.creditsApplied.toFixed(2)}
- Tax Liability (Final Amount): $${taxProjection.totalTaxLiability.toFixed(2)}
- Effective Tax Rate: ${taxProjection.effectiveTaxRate.toFixed(2)}%
`;
      }

      financialContext += `
===== END FINANCIAL DATA =====

IMPORTANT INSTRUCTIONS:
1. STORE this financial data in your working memory under "User Financial Profile"
2. When the user asks about their income, taxes, deductions, or credits, refer to this data
3. DO NOT ask them to provide information that you already have
4. Update your working memory if they mention any new financial information
`;

      return financialContext;
    } catch (error) {
      console.error('[AiService] Error fetching financial data:', error);
      return '\n\nNote: Unable to fetch user financial data at this time.\n';
    }
  }

  /**
   * Get tax education response from AI agent
   *
   * OPTIMIZATION STRATEGY:
   * - Uses cache (5 min TTL) to avoid redundant DB queries during conversations
   * - Shared across server instances for horizontal scaling
   * - First message: Fetches financial data, caches it, and passes to agent
   * - Subsequent messages: Uses cache as indicator, lets agent use working memory
   * - Agent stores financial data in its working memory for context awareness
   * - Call invalidateFinancialCache() when user creates/updates/deletes entries
   */
  async getTaxEducationResponse(
    message: string,
    userId: string,
    entityId: string,
    taxYear?: string,
    user?: User,
  ): Promise<string> {
    const threadId = `${userId}-tax-education-${entityId}`;

    console.log(
      `[AiService] Starting tax education chat for user: ${userId}, entity: ${entityId}`,
    );

    // Check cache to determine if we should pass financial context
    let financialContext = '';
    const cached = await this.getCachedFinancialData(entityId, taxYear);

    if (cached) {
      // Cache hit - this is likely a continuing conversation
      // Don't pass financial context, agent should use working memory
      console.log(
        '[AiService] Using cached data (continuing conversation) - agent will use working memory',
      );
      financialContext = '';
    } else {
      // Cache miss - first message or cache expired
      // Fetch fresh data, cache it, and pass to agent
      console.log(
        '[AiService] No cached data - fetching financial info and passing to agent',
      );
      financialContext = await this.fetchFinancialContext(entityId, taxYear);
      await this.setCachedFinancialData(entityId, taxYear, financialContext);
    }

    const userContext = this.buildUserContext(user);

    const taxEducationAgent = createTaxEducationAgent({
      mastraStore: this.mastraStore,
      apiKey: this.config.AI_API_KEY,
      id: threadId,
      name: 'Tax Education Assistant',
      additionalInstructions: `${userContext}${taxYear ? `The user is currently viewing tax year ${taxYear}.` : ''}${financialContext}`,
    });

    const memoryContext = {
      thread: threadId,
      resource: userId,
    };

    const result = await taxEducationAgent.generate(message, {
      memory: memoryContext,
    });

    console.log('[AiService] Tax education response generated');

    return result.text;
  }

  async getConversationHistory(
    userId: string,
    entityId: string,
  ): Promise<
    Array<{ id: string; role: string; content: string; createdAt: Date }>
  > {
    const threadId = `${userId}-tax-education-${entityId}`;
    const memoryStore = await this.mastraStore.getStore('memory');
    if (!memoryStore) return [];
    const result = await memoryStore.listMessages({ threadId, perPage: 50 });
    return result.messages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => {
        const parts = m.content?.parts ?? [];
        const text =
          parts
            .filter((p) => p.type === 'text')
            .map((p) => p.text ?? '')
            .join('') ||
          m.content?.content ||
          '';
        return {
          id: m.id,
          role: m.role as string,
          content: text,
          createdAt:
            m.createdAt instanceof Date ? m.createdAt : new Date(m.createdAt),
        };
      });
  }

  private buildUserContext(user?: User): string {
    if (!user) {
      return '';
    }

    const fullName = [user.firstName, user.lastName]
      .filter(Boolean)
      .join(' ')
      .trim();

    return `
===== USER PROFILE =====
- User ID: ${user.id}
- Name: ${fullName || 'Not provided'}
- Email: ${user.email || 'Not provided'}
===== END USER PROFILE =====

IMPORTANT INSTRUCTIONS:
1. Address the user by their first name when appropriate.
2. Keep identity details private and only use them to personalize responses.
3. Never invent missing profile details.
`;
  }
}
