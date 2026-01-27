import {
  DATABASE_CONNECTION,
  financialEntries,
  type DatabaseClient,
} from '@hq/database';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  CreateFinancialEntryInput,
  FinancialEntry,
} from './models/financial-entry.model';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class FinancialEntryService {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: DatabaseClient,
  ) {}

  async create(input: CreateFinancialEntryInput): Promise<FinancialEntry> {
    const { entityId, type, category, taxYear } = input;

    // START LOG: Detailed trace of the initiation
    console.log(
      `[FinancialEntryService] Received request to create entry. Entity: ${entityId}, Type: ${type}, Year: ${taxYear}`,
    );

    try {
      const [entry] = await this.db
        .insert(financialEntries)
        .values({
          ...input,
          amount: input.amount.toString(),
        })
        .returning();

      // SUCCESS LOG: Confirming DB persistence
      console.log(
        `[FinancialEntryService] Successfully persisted entry ID: ${entry.id} for Entity: ${entityId}`,
      );

      return this.mapToModel(entry);
    } catch (error) {
      // ERROR LOG: Capture the full context for debugging
      console.error(
        `[FinancialEntryService] Failed to create entry for Entity: ${entityId}. Category: ${category}`,
        {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          inputData: input,
        },
      );

      throw new InternalServerErrorException(
        'An unexpected error occurred while saving the financial entry.',
      );
    }
  }

  async findByEntity(
    entityId: string,
    taxYear?: string,
  ): Promise<FinancialEntry[]> {
    console.log(
      `[FinancialEntryService] Fetching ledger. Entity: ${entityId}${taxYear ? `, Year: ${taxYear}` : ''}`,
    );

    try {
      const filters = [eq(financialEntries.entityId, entityId)];
      if (taxYear) filters.push(eq(financialEntries.taxYear, taxYear));

      const entries = await this.db
        .select()
        .from(financialEntries)
        .where(and(...filters));

      console.log(
        `[FinancialEntryService] Retrieved ${entries.length} entries for Entity: ${entityId}`,
      );

      return entries.map((entry) => this.mapToModel(entry));
    } catch (error) {
      console.error(
        `[FinancialEntryService] Error fetching ledger for Entity: ${entityId}`,
        error,
      );
      throw error;
    }
  }

  private mapToModel(
    entry: typeof financialEntries.$inferSelect,
  ): FinancialEntry {
    return {
      ...entry,
      type: entry.type as FinancialEntry['type'],
      amount: parseFloat(entry.amount),
    };
  }
}
