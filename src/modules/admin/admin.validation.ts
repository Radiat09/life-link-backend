import { z } from 'zod';

export const changeUserStatusZodSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED']),
  reason: z.string().optional(),
});

export const createAdminZodSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().regex(/^[0-9]{10,15}$/, 'Invalid phone number'),
  role: z.enum(['ADMIN', 'SUPER_ADMIN']).default('ADMIN'),
});

export type ChangeUserStatusInput = z.infer<typeof changeUserStatusZodSchema>;
export type CreateAdminInput = z.infer<typeof createAdminZodSchema>;
