import { z } from 'zod';
import { financialTypeSchema } from './enums';
import { taxYearSchema } from './tax-year.schema';

export const createFinancialEntrySchema = z.object({
  entityId: z.string().uuid('Invalid entity ID'),
  type: financialTypeSchema,
  category: z
    .string()
    .min(3, 'Category must be at least 3 characters')
    .max(50, 'Category must be at most 50 characters'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be a 3-letter code').default('CAD'),
  date: z.coerce.date(),
  taxYear: taxYearSchema,
  metadata: z.record(z.unknown()).optional().default({}),
});

export type CreateFinancialEntryInput = z.infer<typeof createFinancialEntrySchema>;
