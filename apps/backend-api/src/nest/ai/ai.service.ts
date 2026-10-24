import { MASTRA_STORE, type MastraStore } from '@hq/database';
import {
  createFinanceAgent,
  createFinanceEntryExtractionAgent,
  createTaxEducationAgent,
} from '@hq/tools';
import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
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

type FinancialContextSource = 'db' | 'cache' | 'memory';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly CACHE_TTL_SECONDS = 5 * 60; // 5 minutes
  private readonly CACHE_KEY_PREFIX = 'financial-context:';

  constructor(
    @Inject(envConfig.KEY) private readonly config: EnvConfig,
    @Inject(MASTRA_STORE) private readonly mastraStore: MastraStore,
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

    this.logger.log(`Starting financial entry extraction for user ${userId}`);

    const prompt = `
Extract financial entry data from the following document:

${documentContent}

Provide the extracted data in the exact JSON format specified in your instructions.
`;

    const result = await extractionAgent.generate(prompt);

    this.logger.debug(
      `Received extraction model response (length=${result.text.length}) for user ${userId}`,
    );

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
        this.logger.warn(
          `Multiple extraction entries detected (${parsed.length}); using the first result`,
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
      this.logger.error(
        `Failed to parse financial entry extraction response for user ${userId}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new Error('Failed to extract financial entry data from document');
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
      this.logger.debug(
        `Using cached financial context for entity ${entityId}${taxYear ? ` (${taxYear})` : ''}`,
      );
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
    this.logger.debug(
      `Cached financial context for entity ${entityId}${taxYear ? ` (${taxYear})` : ''} with TTL ${this.CACHE_TTL_SECONDS}s`,
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
    this.logger.debug(`Invalidated financial cache key ${cacheKey}`);
  }

  private async fetchFinancialContext(
    entityId: string,
    taxYear?: string,
  ): Promise<string> {
    const entries = await this.financialEntryService.findByEntity(
      entityId,
      taxYear,
    );

    let taxProjection: TaxProjection | null = null;
    if (taxYear) {
      try {
        taxProjection = await this.taxService.calculateProjection(
          entityId,
          taxYear,
        );
      } catch {
        this.logger.warn(
          `Could not fetch tax projection for entity ${entityId} (${taxYear})`,
        );
      }
    }

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
===== USER FINANCIAL SUMMARY =====
Tax Year Scope: ${taxYear || 'All years'}

ENTRY TOTALS:
- Income: $${totalIncome.toFixed(2)} CAD (${incomeEntries.length} entries)
- Deductions: $${totalDeductions.toFixed(2)} CAD (${deductionEntries.length} entries)
- Credits: $${totalCredits.toFixed(2)} CAD (${creditEntries.length} entries)
- Tax Paid: $${totalTaxPaid.toFixed(2)} CAD (${taxPaidEntries.length} entries)

TOP CATEGORIES (by amount):
- Income: ${this.getTopCategorySummary(incomeEntries)}
- Deductions: ${this.getTopCategorySummary(deductionEntries)}
- Credits: ${this.getTopCategorySummary(creditEntries)}
- Tax Paid: ${this.getTopCategorySummary(taxPaidEntries)}
`;

    if (taxProjection) {
      financialContext += `
TAX PROJECTION SNAPSHOT:
- Taxable Income: $${taxProjection.taxableIncome.toFixed(2)}
- Total Tax Owed: $${taxProjection.totalTax.toFixed(2)}
- Credits Applied: $${taxProjection.creditsApplied.toFixed(2)}
- Estimated Tax Liability: $${taxProjection.totalTaxLiability.toFixed(2)}
`;
    }

    financialContext += `
===== END FINANCIAL SUMMARY =====
`;

    return financialContext;
  }

  private async resolveFinancialContext(
    entityId: string,
    taxYear?: string,
  ): Promise<{ context: string; source: FinancialContextSource }> {
    // Precedence:
    // 1) DB summary when available (via cache miss + successful fetch)
    // 2) Cached summary
    // 3) Existing memory only (no injected context)
    const cached = await this.getCachedFinancialData(entityId, taxYear);

    if (cached) {
      return { context: cached, source: 'cache' };
    }

    try {
      const dbContext = await this.fetchFinancialContext(entityId, taxYear);
      await this.setCachedFinancialData(entityId, taxYear, dbContext);
      return { context: dbContext, source: 'db' };
    } catch (error) {
      this.logger.error(
        `Error fetching financial context for entity ${entityId}${taxYear ? ` (${taxYear})` : ''}`,
        error instanceof Error ? error.stack : undefined,
      );
      return { context: '', source: 'memory' };
    }
  }

  private getTopCategorySummary(
    entries: Array<{ category: string; amount: number }>,
    limit = 3,
  ): string {
    if (!entries.length) return 'None';

    const totalsByCategory = new Map<string, number>();
    for (const entry of entries) {
      totalsByCategory.set(
        entry.category,
        (totalsByCategory.get(entry.category) ?? 0) + entry.amount,
      );
    }

    return [...totalsByCategory.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([category, amount]) => `${category} ($${amount.toFixed(2)})`)
      .join(', ');
  }

  /**
   * Get tax education response from AI agent
   *
   * OPTIMIZATION STRATEGY:
   * - Uses cache (5 min TTL) to avoid redundant DB queries during conversations
   * - Keeps deterministic precedence: DB summary > cached summary > memory notes
   * - Passes compact financial summaries to reduce prompt bloat
   * - Call invalidateFinancialCache() when user creates/updates/deletes entries
   */
  async getTaxEducationResponse(
    message: string,
    userId: string,
    entityId: string,
    taxYear?: string,
    user?: User,
  ): Promise<string> {
    const threadId = this.getTaxEducationThreadId(userId, entityId, taxYear);

    this.logger.log(
      `Starting tax education chat for entity ${entityId}${taxYear ? ` (${taxYear})` : ''}`,
    );

    const { context: financialContext, source: contextSource } =
      await this.resolveFinancialContext(entityId, taxYear);
    this.logger.debug(
      `Tax education context source for entity ${entityId}${taxYear ? ` (${taxYear})` : ''}: ${contextSource}`,
    );

    const userContext = this.buildUserContext(user);
    const precedenceInstructions = `
CONTEXT PRECEDENCE (highest to lowest):
1. CURRENT_FINANCIAL_SUMMARY (deterministic data below)
2. CACHED_FINANCIAL_SUMMARY (if current summary is unavailable)
3. WORKING MEMORY NOTES from prior chat turns

If there is a conflict, prefer higher-precedence data.
Do not ask the user to repeat details that exist in higher-precedence context.
`.trim();
    const contextBlock = financialContext
      ? `\n${financialContext}\n`
      : '\nNo deterministic financial summary available for this turn. Use memory notes carefully.\n';

    const taxEducationAgent = createTaxEducationAgent({
      mastraStore: this.mastraStore,
      apiKey: this.config.AI_API_KEY,
      id: threadId,
      name: 'Tax Education Assistant',
      additionalInstructions: `${userContext}${taxYear ? `The user is currently viewing tax year ${taxYear}.` : ''}\n${precedenceInstructions}${contextBlock}`,
    });

    const memoryContext = {
      thread: threadId,
      resource: userId,
    };

    const result = await taxEducationAgent.generate(message, {
      memory: memoryContext,
    });

    this.logger.debug(
      `Tax education response generated for entity ${entityId}${taxYear ? ` (${taxYear})` : ''}`,
    );

    return result.text;
  }

  async getConversationHistory(
    userId: string,
    entityId: string,
    taxYear?: string,
  ): Promise<
    Array<{ id: string; role: string; content: string; createdAt: Date }>
  > {
    const threadId = this.getTaxEducationThreadId(userId, entityId, taxYear);
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

  private getTaxEducationThreadId(
    userId: string,
    entityId: string,
    taxYear?: string,
  ): string {
    const scope = taxYear?.trim() ? taxYear.trim() : 'all-years';
    return `${userId}-tax-education-${entityId}-${scope}`;
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
