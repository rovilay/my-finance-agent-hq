import { pgTable, uuid, text, numeric, timestamp, pgEnum, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),

  // Profile data moved here for simplicity
  avatarUrl: text('avatar_url'),
  bio: text('bio'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const fiscalEntityTypeEnum = pgEnum('fiscal_entity_type', [
  'individual',
  'business',
  'household',
]);

export const fiscalEntities = pgTable('fiscal_entities', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  name: text('name').notNull(), // e.g., "Ogooluwa - Personal"
  type: fiscalEntityTypeEnum('type').default('individual').notNull(),

  // High-level localization for the Engine
  country: text('country').default('Canada').notNull(),
  province: text('province').default('Ontario').notNull(), // Can be null for countries without sub-states

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const financialTypeEnum = pgEnum('financial_type', [
  'income', // Money earned
  'deduction', // Reduces taxable income
  'credit', // Reduces tax owed directly
  'tax_paid', // Withholdings (already paid to govt)
]);

export const financialEntries = pgTable('financial_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  entityId: uuid('entity_id')
    .references(() => fiscalEntities.id)
    .notNull(),

  // Classification
  type: financialTypeEnum('type').notNull(), // INCOME, DEDUCTION, CREDIT, EXPENSE
  category: text('category').notNull(), // EMPLOYMENT, DIVIDENDS, RENTAL

  // The Numbers
  amount: numeric('amount', { precision: 20, scale: 2 }).notNull(),
  currency: text('currency').default('CAD').notNull(),
  date: timestamp('date').notNull(),

  // Localized data: e.g., { "t4_box14": 85000, "source": "Shopify Inc" }
  metadata: jsonb('metadata').notNull().default({}),

  taxYear: text('tax_year').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const taxDocumentStatusEnum = pgEnum('tax_document_status', [
  'uploaded', // File received in S3, waiting for AI
  'processing', // AI (Gemini) is currently parsing the document
  'extracted', // AI finished; results are in aiExtractedData (needs review)
  'verified', // User confirmed the numbers; data moved to financialEntries
  'rejected', // User flagged the extraction as incorrect
  'failed', // System error (e.g., file unreadable, API down)
]);

export const taxDocuments = pgTable('tax_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  entityId: uuid('entity_id')
    .references(() => fiscalEntities.id)
    .notNull(),

  s3Key: text('s3_key').notNull(), // The path to the PDF
  fileName: text('file_name').notNull(),
  status: taxDocumentStatusEnum('status').default('uploaded').notNull(), // uploaded, extracted, verified, failed

  // The "Candidate" data from Gemini before the user clicks 'Confirm'
  encryptedAiExtractedData: text('encrypted_ai_extracted_data'), // The hex ciphertext

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 1. Enums for the State Machine & Privacy
export const documentStatusEnum = pgEnum('document_status', [
  'uploaded', // Initial state
  'processed', // AI has extracted data
  'verified', // User confirmed extraction
  'purged', // File deleted from storage, data kept
  'failed', // Error in processing
]);

export const retentionPolicyEnum = pgEnum('retention_policy', [
  'permanent', // Standard vaulting
  'verify_and_purge', // The "Privacy-First" default
  'ephemeral', // Purge immediately after extraction
]);

// 2. The Table
export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  entityId: uuid('entity_id')
    .references(() => fiscalEntities.id, { onDelete: 'cascade' })
    .notNull(),

  // Storage & Identification
  fileName: text('file_name').notNull(),
  fileMetadata: jsonb('file_metadata').notNull(), // { mimeType: string, size: number }
  storagePath: text('storage_path'), // Will be NULL if purged

  // Security (The $5/mo Robust Layer)
  kmsKeyId: text('kms_key_id'), // Reference to the GCP KMS Master Key
  wrappedDek: text('wrapped_dek'), // Encrypted Data Encryption Key (DEK)

  // State & Logic
  status: documentStatusEnum('status').default('uploaded').notNull(),
  retentionPolicy: retentionPolicyEnum('retention_policy').default('verify_and_purge').notNull(),

  // Data Payload
  extractedData: jsonb('extracted_data'), // JSON results from Gemini Flash

  // Audit Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  purgedAt: timestamp('purged_at'), // Tracking when the storage was cleared
});
