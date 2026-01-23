import { pgTable, uuid, text, numeric, timestamp } from 'drizzle-orm/pg-core';

export const incomeEntries = pgTable('income_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  amount: numeric('amount').notNull(),
  currency: text('currency').default('CAD'),
  source: text('source'), // e.g., "Freelance client"
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
