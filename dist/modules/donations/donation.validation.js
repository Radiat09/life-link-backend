"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDonationStatsZodSchema = exports.updateDonationZodSchema = exports.createDonationZodSchema = void 0;
const zod_1 = require("zod");
exports.createDonationZodSchema = zod_1.z.object({
    requestId: zod_1.z.string().optional(),
    donationDate: zod_1.z.string().refine((date) => {
        const donationDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return donationDate <= today;
    }, 'Donation date cannot be in the future'),
    status: zod_1.z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED']).default('SCHEDULED'),
    unitsDonated: zod_1.z.number()
        .positive('Units donated must be greater than 0')
        .max(10, 'Maximum 10 units per donation')
        .default(1.0),
    hemoglobinLevel: zod_1.z.number().positive().optional(),
    bloodPressure: zod_1.z.string().optional(),
    notes: zod_1.z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});
exports.updateDonationZodSchema = zod_1.z.object({
    status: zod_1.z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED']).optional(),
    unitsDonated: zod_1.z.number()
        .positive('Units donated must be greater than 0')
        .max(10, 'Maximum 10 units per donation')
        .optional(),
    hemoglobinLevel: zod_1.z.number().positive().optional(),
    bloodPressure: zod_1.z.string().optional(),
    notes: zod_1.z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});
exports.getDonationStatsZodSchema = zod_1.z.object({
    query: zod_1.z.object({
        period: zod_1.z.enum(['day', 'week', 'month', 'year']).default('month'),
        bloodGroup: zod_1.z.string().optional(),
    })
});
//# sourceMappingURL=donation.validation.js.map