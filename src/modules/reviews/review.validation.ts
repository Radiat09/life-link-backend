import { z } from 'zod';

export const createReviewZodSchema = z.object({
  donationId: z.string().cuid('Invalid donation ID'),
  rating: z.number()
    .int('Rating must be an integer')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),
  comment: z.string()
    .min(10, 'Comment must be at least 10 characters')
    .max(500, 'Comment cannot exceed 500 characters')
    .optional(),
});

export const updateReviewZodSchema = z.object({
  rating: z.number()
    .int('Rating must be an integer')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5')
    .optional(),
  comment: z.string()
    .min(10, 'Comment must be at least 10 characters')
    .max(500, 'Comment cannot exceed 500 characters')
    .optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewZodSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewZodSchema>;
