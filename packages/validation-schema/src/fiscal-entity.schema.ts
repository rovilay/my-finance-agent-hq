import { z } from 'zod';
import { fiscalEntityTypeSchema, FiscalEntityType } from './enums';

export const createFiscalEntitySchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be at most 100 characters'),
  type: fiscalEntityTypeSchema.default(FiscalEntityType.individual),
  country: z.string().default('Canada'),
  province: z.string().default('Ontario'),
});

export const updateFiscalEntitySchema = createFiscalEntitySchema.partial().extend({
  id: z.string().uuid('Invalid entity ID'),
});

export type CreateFiscalEntityInput = z.infer<typeof createFiscalEntitySchema>;
export type UpdateFiscalEntityInput = z.infer<typeof updateFiscalEntitySchema>;
