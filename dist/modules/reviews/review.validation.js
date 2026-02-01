"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReviewZodSchema = exports.createReviewZodSchema = void 0;
const zod_1 = require("zod");
exports.createReviewZodSchema = zod_1.z.object({
    donationId: zod_1.z.string().cuid('Invalid donation ID'),
    rating: zod_1.z.number()
        .int('Rating must be an integer')
        .min(1, 'Rating must be at least 1')
        .max(5, 'Rating cannot exceed 5'),
    comment: zod_1.z.string()
        .min(10, 'Comment must be at least 10 characters')
        .max(500, 'Comment cannot exceed 500 characters')
        .optional(),
});
exports.updateReviewZodSchema = zod_1.z.object({
    rating: zod_1.z.number()
        .int('Rating must be an integer')
        .min(1, 'Rating must be at least 1')
        .max(5, 'Rating cannot exceed 5')
        .optional(),
    comment: zod_1.z.string()
        .min(10, 'Comment must be at least 10 characters')
        .max(500, 'Comment cannot exceed 500 characters')
        .optional(),
});
//# sourceMappingURL=review.validation.js.map