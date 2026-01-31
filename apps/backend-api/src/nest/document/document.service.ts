import {
  Injectable,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  documents,
  DATABASE_CONNECTION,
  type DatabaseClient,
} from '@hq/database';
import { KmsService, CipherUtil } from '@hq/encryption';
import { eq, count, sql, and } from 'drizzle-orm';
import {
  Document,
  DocumentInput,
  DocumentStatus,
  PaginatedDocument,
  RetentionPolicy,
} from './models/document.model';
import { GcsService } from './gcs.service';
import { type EnvConfig, envConfig } from 'src/config/env';
import { PaginationInput } from '../common/models';

@Injectable()
export class DocumentService {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: DatabaseClient,
    @Inject(envConfig.KEY) private readonly config: EnvConfig,
    private readonly gcsService: GcsService,
    private readonly kmsService: KmsService,
  ) {}

  async handleUpload({
    userId,
    entityId,
    retentionPolicy,
    fileBuffer,
    fileName,
    fileMetadata,
  }: DocumentInput): Promise<Document> {
    console.log(
      `[DocumentService] 🛡️ Starting secure upload for user: ${userId}`,
    );

    try {
      // 1. Generate a unique DEK (Suitcase Key) for this specific document
      const dek: Buffer = CipherUtil.generateDek();

      // 2. Wrap the DEK with your $1.40/mo GCP KMS Master Key (Tiny Safe)
      const wrappedDek: string = await this.kmsService.wrapKey(dek);

      // 3. Encrypt the file buffer using the raw DEK
      const encryptedFile: string = CipherUtil.encrypt(fileBuffer, dek);

      // 4. Upload to GCS
      const storagePath = this.getFileStoragePath(userId, entityId, fileName);
      await this.gcsService.upload(
        storagePath,
        Buffer.from(encryptedFile, CipherUtil.ENCODING),
        'application/octet-stream',
      );

      // 5. Save the metadata and the WRAPPED key to the DB
      const [record] = await this.db
        .insert(documents)
        .values({
          userId,
          entityId,
          fileName,
          fileMetadata,
          status: DocumentStatus.uploaded,
          retentionPolicy,
          storagePath,
          wrappedDek: wrappedDek, // This is the encrypted key
          kmsKeyId: this.config.GCP_KMS_KEY_ID, // We store the Key ID to ensure we can decrypt even if we rotate master keys later
        })
        .returning();

      console.log(
        `[DocumentService] ✅ Document ${record.id} secured with Envelope Encryption.`,
      );

      return this.mapDBDocToModel(record);
    } catch (error) {
      console.error(`[DocumentService] ❌ Failed to secure document`, error);
      throw new InternalServerErrorException(
        'Security layer failed to process document.',
      );
    }
  }

  /**
   * Encrypts and saves the AI-extracted data (Salary, SIN, etc.) using the document's DEK.
   */
  async saveExtractedData(
    documentId: string,
    extractedJson: any,
  ): Promise<Document> {
    console.log(
      `[DocumentService] 🧠 Encrypting AI results for Doc: ${documentId}`,
    );

    try {
      const doc = await this.findDocOrThrow(documentId);

      if (!doc.wrappedDek) {
        throw new InternalServerErrorException(
          `Document ${documentId} has no encryption key`,
        );
      }

      // Unwrap the DEK to perform application-level encryption on the JSON
      const dek: Buffer = await this.kmsService.unwrapKey(doc.wrappedDek);

      // Encrypt the JSON payload
      const encryptedJson: string = CipherUtil.encrypt(
        JSON.stringify(extractedJson),
        dek,
      );

      const [updated] = await this.db
        .update(documents)
        .set({
          extractedData: encryptedJson,
          status: DocumentStatus.processed,
          updatedAt: new Date(),
        })
        .where(eq(documents.id, documentId))
        .returning();

      console.log(
        `[DocumentService] ✅ Extracted data encrypted and saved to database.`,
      );
      return this.mapDBDocToModel(updated);
    } catch (error) {
      console.error(
        `[DocumentService] ❌ Failed to save extracted data for Doc: ${documentId}`,
        error,
      );
      throw new InternalServerErrorException(
        'Error securing extracted tax data.',
      );
    }
  }

  /**
   * Finalizes the document based on user verification and the chosen Retention Policy.
   */
  async finalize(
    documentId: string,
    userConfirmedKeep: boolean,
  ): Promise<Document> {
    const doc = await this.findDocOrThrow(documentId);

    // Logic: If user specifically says "Keep" OR the policy is "Permanent", we preserve the file.
    const shouldKeepFile =
      userConfirmedKeep || doc.retentionPolicy === RetentionPolicy.permanent;

    if (shouldKeepFile) {
      console.log(
        `[DocumentService] 🔒 User verified data. Vaulting document permanently.`,
      );

      const [updated] = await this.db
        .update(documents)
        .set({
          status: DocumentStatus.verified,
          updatedAt: new Date(),
        })
        .where(eq(documents.id, documentId))
        .returning();

      return this.mapDBDocToModel(updated);
    } else {
      console.log(
        `[DocumentService] 🗑️ User verified data. Initiating Purge (Retention: ${doc.retentionPolicy})`,
      );

      // 1. Delete from Cloud Storage
      if (doc.storagePath) {
        await this.gcsService.delete(doc.storagePath);
      }

      // 2. Update DB: Nullify storage path and mark as purged
      const [updated] = await this.db
        .update(documents)
        .set({
          status: DocumentStatus.purged,
          storagePath: null,
          purgedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(documents.id, documentId))
        .returning();

      console.log(
        `[DocumentService] ✅ Purge complete. Storage cleared for Doc: ${documentId}`,
      );

      return this.mapDBDocToModel(updated);
    }
  }

  async findDocOrThrow(id: string, userId?: string): Promise<Document> {
    const conditions = userId 
      ? and(eq(documents.id, id), eq(documents.userId, userId))
      : eq(documents.id, id);

    const doc = await this.db.query.documents.findFirst({
      where: conditions,
    });

    if (!doc) throw new NotFoundException(`Document ${id} not found`);
    return this.mapDBDocToModel(doc);
  }

  async decryptDocumentData(document: Document): Promise<string | null> {
    // Only decrypt if the status is 'processed' or 'verified'
    if (
      document.status === DocumentStatus.uploaded ||
      !document.wrappedDek ||
      !document.extractedData
    ) {
      console.log(
        `[DocumentService] ⚠️ Document ${document.id} not ready for decryption.`,
      );
      return null;
    }

    // Use the same 'Safe' logic: Unwrap DEK -> Decrypt JSON
    const dek = await this.kmsService.unwrapKey(document.wrappedDek);
    const decrypted = CipherUtil.decrypt(document.extractedData, dek);

    return decrypted.toString('utf8'); // Returns the JSON string to the caller
  }

  async documentsByEntityId(entityId: string, userId: string, { skip = 0, take = 10 }: PaginationInput): Promise<PaginatedDocument> {
    // Fetch one extra item to check if there are more pages
    const docs = await this.db.query.documents.findMany({
      where: and(eq(documents.entityId, entityId), eq(documents.userId, userId)),
      limit: take + 1,
      offset: skip,
    });

    const hasMore = docs.length > take;
    const items = hasMore ? docs.slice(0, take) : docs;

    // For total, we could either:
    // 1. Set it to null/undefined (most performant - no COUNT query)
    // 2. Only run COUNT on first page (skip === 0)
    // 3. Return an estimate based on hasMore
    const total = skip === 0 && !hasMore ? items.length : null;

    return {
      items: items.map((doc) => this.mapDBDocToModel(doc)),
      total: total ?? skip + items.length + (hasMore ? 1 : 0), // Estimate
      skip,
      take,
      hasMore,
    };
  }

  async fetchDocumentById(id: string, userId: string): Promise<Document | null> {
    const doc = await this.db.query.documents.findFirst({
      where: and(eq(documents.id, id), eq(documents.userId, userId)),
    });
    if (!doc) return null;
    return this.mapDBDocToModel(doc);
  }

  private mapDBDocToModel(doc: typeof documents.$inferSelect): Document {
    return {
      id: doc.id,
      fileName: doc.fileName,
      status: doc.status as DocumentStatus,
      retentionPolicy: doc.retentionPolicy as RetentionPolicy,
      storagePath: doc.storagePath || undefined,
      purgedAt: doc.purgedAt || undefined,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      fileMetadata: doc.fileMetadata as any,
      wrappedDek: doc.wrappedDek ?? undefined,
      extractedData: (doc.extractedData as string | null) ?? undefined,
    };
  }

  private getFileStoragePath(
    userId: string,
    entityId: string,
    fileName: string,
  ) {
    return `users/${userId}/entities/${entityId}/${Date.now()}_${fileName}.enc`;
  }
}
