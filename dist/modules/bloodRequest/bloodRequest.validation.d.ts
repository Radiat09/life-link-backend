import { z } from 'zod';
export declare const createRequestBloodSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
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
    unitsRequired: z.ZodNumber;
    urgencyLevel: z.ZodDefault<z.ZodEnum<{
        [x: string]: string;
    }>>;
    hospitalName: z.ZodString;
    hospitalAddress: z.ZodString;
    city: z.ZodString;
    contactPerson: z.ZodString;
    contactPhone: z.ZodString;
    requiredDate: z.ZodString;
    isEmergency: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const updateRequestBloodSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    unitsRequired: z.ZodOptional<z.ZodNumber>;
    urgencyLevel: z.ZodOptional<z.ZodEnum<{
        [x: string]: string;
    }>>;
    hospitalName: z.ZodOptional<z.ZodString>;
    hospitalAddress: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    contactPerson: z.ZodOptional<z.ZodString>;
    contactPhone: z.ZodOptional<z.ZodString>;
    requiredDate: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        ACTIVE: "ACTIVE";
        PENDING: "PENDING";
        CANCELLED: "CANCELLED";
    }>>;
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const searchRequestBloodSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
        limit: z.ZodDefault<z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>>;
        bloodGroup: z.ZodOptional<z.ZodEnum<{
            "": "";
            A_POSITIVE: "A_POSITIVE";
            A_NEGATIVE: "A_NEGATIVE";
            B_POSITIVE: "B_POSITIVE";
            B_NEGATIVE: "B_NEGATIVE";
            AB_POSITIVE: "AB_POSITIVE";
            AB_NEGATIVE: "AB_NEGATIVE";
            O_POSITIVE: "O_POSITIVE";
            O_NEGATIVE: "O_NEGATIVE";
        }>>;
        city: z.ZodOptional<z.ZodString>;
        urgencyLevel: z.ZodOptional<z.ZodEnum<{
            "": "";
            LOW: "LOW";
            MEDIUM: "MEDIUM";
            HIGH: "HIGH";
            CRITICAL: "CRITICAL";
        }>>;
        status: z.ZodOptional<z.ZodEnum<{
            "": "";
            ACTIVE: "ACTIVE";
            PENDING: "PENDING";
            FULFILLED: "FULFILLED";
            CANCELLED: "CANCELLED";
        }>>;
        sortBy: z.ZodDefault<z.ZodEnum<{
            createdAt: "createdAt";
            urgencyLevel: "urgencyLevel";
            requiredDate: "requiredDate";
        }>>;
        sortOrder: z.ZodDefault<z.ZodEnum<{
            desc: "desc";
            asc: "asc";
        }>>;
        search: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type SearchRequestBloodInput = z.infer<typeof searchRequestBloodSchema>['query'];
export interface BloodRequestResponse {
    id: string;
    requestId: string;
    title: string;
    description: string | null;
    bloodGroup: string;
    unitsRequired: number;
    fulfilledUnits: number;
    urgencyLevel: string;
    hospitalName: string;
    hospitalAddress: string;
    city: string;
    contactPerson: string;
    contactPhone: string;
    requiredDate: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        email: string;
        profile: {
            firstName: string;
            lastName: string;
            phone: string;
        } | null;
    };
    _count: {
        donations: number;
    };
}
export interface PaginatedRequests {
    requests: BloodRequestResponse[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
//# sourceMappingURL=bloodRequest.validation.d.ts.map