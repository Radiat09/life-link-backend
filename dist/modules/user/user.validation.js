"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = exports.updateProfileZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const client_1 = require("@prisma/client"); // Import your Prisma Enums
// Validation schemas
exports.createUserZodSchema = zod_1.default.object({
    email: zod_1.default.email('Invalid email address'),
    password: zod_1.default.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    role: zod_1.default.enum(['USER', 'HOSPITAL', 'ADMIN']).default('USER'),
    firstName: zod_1.default.string().min(2, 'First name must be at least 2 characters'),
    lastName: zod_1.default.string().min(2, 'Last name must be at least 2 characters'),
    phone: zod_1.default.string().regex(/^[0-9]{10,15}$/, 'Invalid phone number'),
    bloodGroup: zod_1.default.enum([
        'A_POSITIVE',
        'A_NEGATIVE',
        'B_POSITIVE',
        'B_NEGATIVE',
        'AB_POSITIVE',
        'AB_NEGATIVE',
        'O_POSITIVE',
        'O_NEGATIVE'
    ]),
    dateOfBirth: zod_1.default.string().refine((date) => {
        const birthDate = new Date(date);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        return age >= 18 && age <= 65;
    }, 'You must be between 18 and 65 years old'),
    city: zod_1.default.string().min(2, 'City is required'),
    division: zod_1.default.string().min(2, 'Division is required'),
    address: zod_1.default.string().optional(),
});
exports.updateProfileZodSchema = zod_1.default.object({
    firstName: zod_1.default.string().min(2, "First name is too short").optional(),
    lastName: zod_1.default.string().min(2, "Last name is too short").optional(),
    phone: zod_1.default.string().regex(/^[0-9]{10,15}$/, "Invalid phone number").optional(),
    bio: zod_1.default.string().max(500, "Bio cannot exceed 500 characters").optional(),
    gender: zod_1.default.nativeEnum(client_1.Gender).optional(),
    // Use coerce to convert strings from form-data into numbers/booleans
    weight: zod_1.default.coerce.number().positive("Weight must be a positive number").optional(),
    isAvailable: zod_1.default.coerce.boolean().optional(),
    city: zod_1.default.string().min(2).optional(),
    division: zod_1.default.string().min(2).optional(),
    address: zod_1.default.string().optional(),
    // avatar is usually handled by the controller after Cloudinary upload,
    // but we can allow the URL string here if needed.
    avatar: zod_1.default.string().optional(),
});
exports.userValidation = {
    createUserZodSchema: exports.createUserZodSchema,
    updateProfileZodSchema: exports.updateProfileZodSchema
};
//# sourceMappingURL=user.validation.js.map