import { z } from 'zod';
export declare const createReviewZodSchema: z.ZodObject<{
    donationId: z.ZodString;
    rating: z.ZodNumber;
    comment: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateReviewZodSchema: z.ZodObject<{
    rating: z.ZodOptional<z.ZodNumber>;
    comment: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateReviewInput = z.infer<typeof createReviewZodSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewZodSchema>;
//# sourceMappingURL=review.validation.d.ts.map