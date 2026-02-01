import { z } from 'zod';
export declare const createDonationZodSchema: z.ZodObject<{
    requestId: z.ZodOptional<z.ZodString>;
    donationDate: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<{
        CANCELLED: "CANCELLED";
        COMPLETED: "COMPLETED";
        SCHEDULED: "SCHEDULED";
    }>>;
    unitsDonated: z.ZodDefault<z.ZodNumber>;
    hemoglobinLevel: z.ZodOptional<z.ZodNumber>;
    bloodPressure: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateDonationZodSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        CANCELLED: "CANCELLED";
        COMPLETED: "COMPLETED";
        SCHEDULED: "SCHEDULED";
    }>>;
    unitsDonated: z.ZodOptional<z.ZodNumber>;
    hemoglobinLevel: z.ZodOptional<z.ZodNumber>;
    bloodPressure: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const getDonationStatsZodSchema: z.ZodObject<{
    query: z.ZodObject<{
        period: z.ZodDefault<z.ZodEnum<{
            year: "year";
            week: "week";
            day: "day";
            month: "month";
        }>>;
        bloodGroup: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateDonationInput = z.infer<typeof createDonationZodSchema>;
export type UpdateDonationInput = z.infer<typeof updateDonationZodSchema>;
//# sourceMappingURL=donation.validation.d.ts.map