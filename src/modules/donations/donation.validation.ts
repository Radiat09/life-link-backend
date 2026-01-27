import { z } from 'zod';

export const createDonationZodSchema = z.object({
  requestId: z.string().optional(),
  donationDate: z.string().refine((date) => {
    const donationDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return donationDate <= today;
  }, 'Donation date cannot be in the future'),
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED']).default('SCHEDULED'),
  unitsDonated: z.number()
    .positive('Units donated must be greater than 0')
    .max(10, 'Maximum 10 units per donation')
    .default(1.0),
  hemoglobinLevel: z.number().positive().optional(),
  bloodPressure: z.string().optional(),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

export const updateDonationZodSchema = z.object({
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED']).optional(),
  unitsDonated: z.number()
    .positive('Units donated must be greater than 0')
    .max(10, 'Maximum 10 units per donation')
    .optional(),
  hemoglobinLevel: z.number().positive().optional(),
  bloodPressure: z.string().optional(),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

export const getDonationStatsZodSchema = z.object({
  query: z.object({
    period: z.enum(['day', 'week', 'month', 'year']).default('month'),
    bloodGroup: z.string().optional(),
  })
});

export type CreateDonationInput = z.infer<typeof createDonationZodSchema>;
export type UpdateDonationInput = z.infer<typeof updateDonationZodSchema>;
