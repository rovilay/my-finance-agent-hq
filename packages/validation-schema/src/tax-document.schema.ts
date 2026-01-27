import { z } from 'zod';
import { taxDocumentStatusSchema } from './enums';

export const createTaxDocumentSchema = z.object({
  entityId: z.string().uuid('Invalid entity ID'),
  fileName: z.string().min(1, 'File name is required'),
  s3Key: z.string().min(1, 'S3 key is required'),
});

export const updateTaxDocumentSchema = z.object({
  id: z.string().uuid('Invalid document ID'),
  status: taxDocumentStatusSchema.optional(),
  encryptedAiExtractedData: z.string().optional(),
});

export type CreateTaxDocumentInput = z.infer<typeof createTaxDocumentSchema>;
export type UpdateTaxDocumentInput = z.infer<typeof updateTaxDocumentSchema>;
