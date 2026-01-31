import {
  DATABASE_CONNECTION,
  financialEntries,
  fiscalEntities,
  type DatabaseClient,
} from '@hq/database';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateFinancialEntryInput,
  FinancialEntry,
  PaginatedFinancialEntry,
} from './models/financial-entry.model';
import { and, eq } from 'drizzle-orm';
import { PaginationInput } from '../common/models';

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

  async findByEntityPaginated(
    entityId: string,
    taxYear?: string,
    { skip = 0, take = 10 }: PaginationInput = {},
  ): Promise<PaginatedFinancialEntry> {
    console.log(
      `[FinancialEntryService] Fetching paginated entries. Entity: ${entityId}, Skip: ${skip}, Take: ${take}${taxYear ? `, Year: ${taxYear}` : ''}`,
    );

    try {
      const filters = [eq(financialEntries.entityId, entityId)];
      if (taxYear) filters.push(eq(financialEntries.taxYear, taxYear));

      // Fetch one extra to check if there are more pages
      const entries = await this.db
        .select()
        .from(financialEntries)
        .where(and(...filters))
        .limit(take + 1)
        .offset(skip);

      const hasMore = entries.length > take;
      const items = hasMore ? entries.slice(0, take) : entries;
      const total = skip === 0 && !hasMore ? items.length : null;

      console.log(
        `[FinancialEntryService] Retrieved ${items.length} entries (hasMore: ${hasMore})`,
      );

      return {
        items: items.map((entry) => this.mapToModel(entry)),
        total: total ?? skip + items.length + (hasMore ? 1 : 0),
        skip,
        take,
        hasMore,
      };
    } catch (error) {
      console.error(
        `[FinancialEntryService] Error fetching paginated ledger for Entity: ${entityId}`,
        error,
      );
      throw error;
    }
  }

  async findById(entryId: string, userId: string): Promise<FinancialEntry> {
    console.log(
      `[FinancialEntryService] Fetching entry by ID: ${entryId}`,
    );

    try {
      const result = await this.db
        .select()
        .from(financialEntries)
        .innerJoin(
          fiscalEntities,
          eq(financialEntries.entityId, fiscalEntities.id),
        )
        .where(
          and(
            eq(financialEntries.id, entryId),
            eq(fiscalEntities.userId, userId),
          ),
        )
        .limit(1);

      if (!result || result.length === 0) {
        console.log(
          `[FinancialEntryService] Entry not found with ID: ${entryId}`,
        );
        throw new NotFoundException(
          `Financial entry with ID ${entryId} not found`,
        );
      }

      console.log(
        `[FinancialEntryService] Successfully retrieved entry ID: ${entryId}`,
      );

      return this.mapToModel(result[0].financial_entries);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(
        `[FinancialEntryService] Error fetching entry by ID: ${entryId}`,
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
