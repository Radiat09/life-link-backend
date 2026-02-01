"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminZodSchema = exports.changeUserStatusZodSchema = void 0;
const zod_1 = require("zod");
exports.changeUserStatusZodSchema = zod_1.z.object({
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED']),
    reason: zod_1.z.string().optional(),
});
exports.createAdminZodSchema = zod_1.z.object({
    email: zod_1.z.email('Invalid email address'),
    password: zod_1.z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    firstName: zod_1.z.string().min(2, 'First name must be at least 2 characters'),
    lastName: zod_1.z.string().min(2, 'Last name must be at least 2 characters'),
    phone: zod_1.z.string().regex(/^[0-9]{10,15}$/, 'Invalid phone number'),
    role: zod_1.z.enum(['ADMIN', 'SUPER_ADMIN']).default('ADMIN'),
});
//# sourceMappingURL=admin.validation.js.map