"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRequestBloodSchema = exports.updateRequestBloodSchema = exports.createRequestBloodSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
// Validation schemas
exports.createRequestBloodSchema = zod_1.z.object({
    title: zod_1.z.string()
        .min(10, 'Title must be at least 10 characters')
        .max(200, 'Title must not exceed 200 characters'),
    description: zod_1.z.string()
        .min(20, 'Description must be at least 20 characters')
        .max(1000, 'Description must not exceed 1000 characters')
        .optional(),
    bloodGroup: zod_1.z.enum(client_1.BloodGroup),
    unitsRequired: zod_1.z.number()
        .int('Units must be an integer')
        .min(1, 'At least 1 unit is required')
        .max(20, 'Maximum 20 units per request'),
    urgencyLevel: zod_1.z.enum(Object.values(client_1.UrgencyLevel))
        .default('MEDIUM'),
    hospitalName: zod_1.z.string()
        .min(3, 'Hospital name must be at least 3 characters')
        .max(100, 'Hospital name must not exceed 100 characters'),
    hospitalAddress: zod_1.z.string()
        .min(10, 'Hospital address must be at least 10 characters')
        .max(500, 'Hospital address must not exceed 500 characters'),
    city: zod_1.z.string()
        .min(2, 'City must be at least 2 characters')
        .max(50, 'City must not exceed 50 characters'),
    contactPerson: zod_1.z.string()
        .min(3, 'Contact person name must be at least 3 characters')
        .max(50, 'Contact person name must not exceed 50 characters'),
    contactPhone: zod_1.z.string()
        .regex(/^[0-9]{10,15}$/, 'Invalid phone number'),
    requiredDate: zod_1.z.string()
        .refine((date) => {
        const requiredDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return requiredDate >= today;
    }, 'Required date must be today or in the future')
});
exports.updateRequestBloodSchema = zod_1.z.object({
    title: zod_1.z.string()
        .min(10, 'Title must be at least 10 characters')
        .max(200, 'Title must not exceed 200 characters')
        .optional(),
    description: zod_1.z.string()
        .min(20, 'Description must be at least 20 characters')
        .max(1000, 'Description must not exceed 1000 characters')
        .optional(),
    unitsRequired: zod_1.z.number()
        .int('Units must be an integer')
        .min(1, 'At least 1 unit is required')
        .max(20, 'Maximum 20 units per request')
        .optional(),
    urgencyLevel: zod_1.z.enum(Object.values(client_1.UrgencyLevel))
        .optional(),
    hospitalName: zod_1.z.string()
        .min(3, 'Hospital name must be at least 3 characters')
        .max(100, 'Hospital name must not exceed 100 characters')
        .optional(),
    hospitalAddress: zod_1.z.string()
        .min(10, 'Hospital address must be at least 10 characters')
        .max(500, 'Hospital address must not exceed 500 characters')
        .optional(),
    city: zod_1.z.string()
        .min(2, 'City must be at least 2 characters')
        .max(50, 'City must not exceed 50 characters')
        .optional(),
    contactPerson: zod_1.z.string()
        .min(3, 'Contact person name must be at least 3 characters')
        .max(50, 'Contact person name must not exceed 50 characters')
        .optional(),
    contactPhone: zod_1.z.string()
        .regex(/^[0-9]{10,15}$/, 'Invalid phone number')
        .optional(),
    requiredDate: zod_1.z.string()
        .refine((date) => {
        const requiredDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return requiredDate >= today;
    }, 'Required date must be today or in the future')
        .optional(),
    status: zod_1.z.enum(['PENDING', 'ACTIVE', 'CANCELLED']).optional(),
    params: zod_1.z.object({
        id: zod_1.z.string().cuid('Invalid request ID')
    })
});
exports.searchRequestBloodSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().regex(/^\d+$/).transform(Number).default(1),
        limit: zod_1.z.string().regex(/^\d+$/).transform(Number).default(10),
        bloodGroup: zod_1.z.enum([...Object.values(client_1.BloodGroup), '']).optional(),
        city: zod_1.z.string().optional(),
        urgencyLevel: zod_1.z.enum([...Object.values(client_1.UrgencyLevel), '']).optional(),
        status: zod_1.z.enum(['PENDING', 'ACTIVE', 'FULFILLED', 'CANCELLED', '']).optional(),
        sortBy: zod_1.z.enum(['createdAt', 'requiredDate', 'urgencyLevel']).default('createdAt'),
        sortOrder: zod_1.z.enum(['asc', 'desc']).default('desc'),
        search: zod_1.z.string().optional()
    })
});
//# sourceMappingURL=bloodRequest.validation.js.map