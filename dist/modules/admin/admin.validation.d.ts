import { z } from 'zod';
export declare const changeUserStatusZodSchema: z.ZodObject<{
    status: z.ZodEnum<{
        ACTIVE: "ACTIVE";
        INACTIVE: "INACTIVE";
        SUSPENDED: "SUSPENDED";
        DELETED: "DELETED";
    }>;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const createAdminZodSchema: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    phone: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<{
        ADMIN: "ADMIN";
        SUPER_ADMIN: "SUPER_ADMIN";
    }>>;
}, z.core.$strip>;
export type ChangeUserStatusInput = z.infer<typeof changeUserStatusZodSchema>;
export type CreateAdminInput = z.infer<typeof createAdminZodSchema>;
//# sourceMappingURL=admin.validation.d.ts.map