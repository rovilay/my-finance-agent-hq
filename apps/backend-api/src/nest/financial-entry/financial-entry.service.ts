import {
  DATABASE_CONNECTION,
  financialEntries,
  fiscalEntities,
  type DatabaseClient,
  documents,
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
  ExtractedFinancialEntry,
} from './models/financial-entry.model';
import { and, eq } from 'drizzle-orm';
import { PaginationInput } from '../common/models';
import { AiService } from '../ai/ai.service';
import { GcsService } from '../document/gcs.service';
import { DocumentService } from '../document/document.service';
import { z } from 'zod';
import { financialTypeSchema, taxYearSchema } from '@hq/validation-schema';
import { PDFParse } from 'pdf-parse';
import { KmsService } from '@hq/encryption';
import { CipherUtil } from '@hq/encryption';

@Injectable()
export class FinancialEntryService {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: DatabaseClient,
    private readonly aiService: AiService,
    private readonly gcsService: GcsService,
    private readonly documentService: DocumentService,
    private readonly kmsService: KmsService,
  ) {}

  async create(
    input: CreateFinancialEntryInput,
    userId: string,
  ): Promise<FinancialEntry> {
    const { entityId, type, category, taxYear } = input;

    // START LOG: Detailed trace of the initiation
    console.log(
      `[FinancialEntryService] Received request to create entry. Entity: ${entityId}, Type: ${type}, Year: ${taxYear}`,
    );

    try {
      // ensure the fiscal entity exists and belongs to the user
      const [entity] = await this.db
        .select()
        .from(fiscalEntities)
        .where(
          and(
            eq(fiscalEntities.id, entityId),
            eq(fiscalEntities.userId, userId),
          ),
        )
        .limit(1);

      if (!entity) {
        throw new NotFoundException(
          `Fiscal entity: ${entityId} not found for user ID: ${userId}`,
        );
      }

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
    console.log(`[FinancialEntryService] Fetching entry by ID: ${entryId}`);

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

  async extractFromDocument(
    documentId: string,
    userId: string,
  ): Promise<ExtractedFinancialEntry> {
    console.log(
      `[FinancialEntryService] Extracting financial entry from document ${documentId} for user: ${userId}`,
    );

    try {
      // Fetch document from database
      const [document] = await this.db
        .select()
        .from(documents)
        .where(and(eq(documents.id, documentId), eq(documents.userId, userId)))
        .limit(1);

      if (!document || !document.storagePath) {
        throw new NotFoundException(
          `Document with ID ${documentId} not found or has no storage path`,
        );
      }

      // Download encrypted file from GCS
      console.log(
        `[FinancialEntryService] Downloading file from GCS: ${document.storagePath}`,
      );
      const encryptedBuffer = await this.gcsService.downloadFile(
        document.storagePath,
      );

      // Decrypt the file using the wrapped DEK
      console.log('[FinancialEntryService] Decrypting file...');
      if (!document.wrappedDek) {
        throw new InternalServerErrorException(
          'Document is missing encryption key',
        );
      }
      const dek = await this.kmsService.unwrapKey(document.wrappedDek);
      const decryptedBuffer = CipherUtil.decrypt(
        encryptedBuffer.toString('base64'),
        dek,
      );

      let documentContent: string;

      // Check if file is PDF by mime type or file extension
      if (
        document.fileName.toLowerCase().endsWith('.pdf') ||
        document.fileName.toLowerCase().includes('.pdf')
      ) {
        console.log('[FinancialEntryService] Parsing PDF file...');
        try {
          const parser = new PDFParse({ data: decryptedBuffer });
          const pdfData = await parser.getText();
          documentContent = pdfData.text;
          console.log(
            '[FinancialEntryService] Extracted text from PDF:',
            documentContent.substring(0, 200),
          );
        } catch (error) {
          console.error('[FinancialEntryService] Failed to parse PDF:', error);
          throw new InternalServerErrorException(
            'Failed to parse PDF document. Please ensure the file is a valid PDF.',
          );
        }
      } else {
        // For text files
        documentContent = decryptedBuffer.toString('utf8');
      }

      const extracted = await this.aiService.extractFinancialEntry(
        documentContent,
        userId,
      );

      console.log(
        `[FinancialEntryService] Successfully extracted data:`,
        extracted,
      );

      // Delete the temporary document immediately after extraction
      try {
        await this.documentService.finalize(documentId, false);
        console.log(
          `[FinancialEntryService] Cleaned up temporary document: ${documentId}`,
        );
      } catch (cleanupError) {
        // Log but don't fail the extraction if cleanup fails
        console.warn(
          `[FinancialEntryService] Failed to cleanup document ${documentId}:`,
          cleanupError,
        );
      }

      // Individual field validators
      const dateValidator = z
        .string()
        .datetime()
        .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/));
      const amountValidator = z.number().positive();
      const currencyValidator = z.string().length(3);

      // Validate each field individually, return null if validation fails
      return {
        date: extracted.date
          ? dateValidator.safeParse(extracted.date).success
            ? extracted.date
            : undefined
          : undefined,
        amount: extracted.amount
          ? amountValidator.safeParse(extracted.amount).success
            ? extracted.amount
            : undefined
          : undefined,
        currency: extracted.currency
          ? currencyValidator.safeParse(extracted.currency).success
            ? extracted.currency
            : undefined
          : undefined,
        category: extracted.category ?? undefined,
        description: extracted.description ?? undefined,
        taxYear: extracted.taxYear
          ? taxYearSchema.safeParse(extracted.taxYear).success
            ? extracted.taxYear
            : undefined
          : undefined,
        type: extracted.type
          ? financialTypeSchema.safeParse(extracted.type).success
            ? (extracted.type as any)
            : undefined
          : undefined,
      };
    } catch (error) {
      console.error(
        `[FinancialEntryService] Error extracting from document:`,
        error,
      );
      throw new InternalServerErrorException(
        'Failed to extract financial entry from document',
      );
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
