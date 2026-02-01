import z from 'zod';
export declare const createUserZodSchema: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<{
        USER: "USER";
        HOSPITAL: "HOSPITAL";
        ADMIN: "ADMIN";
    }>>;
    firstName: z.ZodString;
    lastName: z.ZodString;
    phone: z.ZodString;
    bloodGroup: z.ZodEnum<{
        A_POSITIVE: "A_POSITIVE";
        A_NEGATIVE: "A_NEGATIVE";
        B_POSITIVE: "B_POSITIVE";
        B_NEGATIVE: "B_NEGATIVE";
        AB_POSITIVE: "AB_POSITIVE";
        AB_NEGATIVE: "AB_NEGATIVE";
        O_POSITIVE: "O_POSITIVE";
        O_NEGATIVE: "O_NEGATIVE";
    }>;
    dateOfBirth: z.ZodString;
    city: z.ZodString;
    division: z.ZodString;
    address: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateProfileZodSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    gender: z.ZodOptional<z.ZodEnum<{
        MALE: "MALE";
        FEMALE: "FEMALE";
    }>>;
    weight: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    isAvailable: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
    city: z.ZodOptional<z.ZodString>;
    division: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const userValidation: {
    createUserZodSchema: z.ZodObject<{
        email: z.ZodEmail;
        password: z.ZodString;
        role: z.ZodDefault<z.ZodEnum<{
            USER: "USER";
            HOSPITAL: "HOSPITAL";
            ADMIN: "ADMIN";
        }>>;
        firstName: z.ZodString;
        lastName: z.ZodString;
        phone: z.ZodString;
        bloodGroup: z.ZodEnum<{
            A_POSITIVE: "A_POSITIVE";
            A_NEGATIVE: "A_NEGATIVE";
            B_POSITIVE: "B_POSITIVE";
            B_NEGATIVE: "B_NEGATIVE";
            AB_POSITIVE: "AB_POSITIVE";
            AB_NEGATIVE: "AB_NEGATIVE";
            O_POSITIVE: "O_POSITIVE";
            O_NEGATIVE: "O_NEGATIVE";
        }>;
        dateOfBirth: z.ZodString;
        city: z.ZodString;
        division: z.ZodString;
        address: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    updateProfileZodSchema: z.ZodObject<{
        firstName: z.ZodOptional<z.ZodString>;
        lastName: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        bio: z.ZodOptional<z.ZodString>;
        gender: z.ZodOptional<z.ZodEnum<{
            MALE: "MALE";
            FEMALE: "FEMALE";
        }>>;
        weight: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        isAvailable: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
        city: z.ZodOptional<z.ZodString>;
        division: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
        avatar: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
};
//# sourceMappingURL=user.validation.d.ts.map