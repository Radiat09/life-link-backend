import { z } from 'zod';
export declare const createBloodInventoryZodSchema: z.ZodObject<{
    body: z.ZodObject<{
        hospitalId: z.ZodOptional<z.ZodString>;
        bloodGroup: z.ZodString;
        unitsAvailable: z.ZodNumber;
        minThreshold: z.ZodNumber;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateBloodInventoryZodSchema: z.ZodObject<{
    body: z.ZodObject<{
        unitsAvailable: z.ZodOptional<z.ZodNumber>;
        minThreshold: z.ZodOptional<z.ZodNumber>;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const adjustBloodUnitsZodSchema: z.ZodObject<{
    body: z.ZodObject<{
        quantity: z.ZodNumber;
        type: z.ZodEnum<{
            add: "add";
            deduct: "deduct";
        }>;
        reason: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=bloodInventory.validation.d.ts.map