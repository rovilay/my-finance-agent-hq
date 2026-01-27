import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be at most 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be at most 50 characters'),
  avatarUrl: z.string().url('Invalid avatar URL').optional(),
  bio: z.string().max(500, 'Bio must be at most 500 characters').optional(),
});

export const updateUserSchema = createUserSchema.partial().extend({
  id: z.string().uuid('Invalid user ID'),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
