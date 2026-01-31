import { z } from 'zod';

/**
 * File metadata schema for document uploads
 * Contains MIME type and file size information
 */
export const fileMetadataSchema = z.object({
  mimeType: z.string().min(1, 'MIME type is required'),
  sizeInKb: z.number().int().positive('File size must be positive'),
});

export type FileMetadata = z.infer<typeof fileMetadataSchema>;
