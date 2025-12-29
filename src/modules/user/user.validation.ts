import z from 'zod';
import { Gender } from '@prisma/client'; // Import your Prisma Enums

// Validation schemas
export const createUserZodSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    role: z.enum(['DONOR', 'RECIPIENT', 'HOSPITAL', 'ADMIN']).default('RECIPIENT'),
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    phone: z.string().regex(/^[0-9]{10,15}$/, 'Invalid phone number'),
    bloodGroup: z.enum([
        'A_POSITIVE',
        'A_NEGATIVE',
        'B_POSITIVE',
        'B_NEGATIVE',
        'AB_POSITIVE',
        'AB_NEGATIVE',
        'O_POSITIVE',
        'O_NEGATIVE'
    ]),
    dateOfBirth: z.string().refine((date) => {
        const birthDate = new Date(date);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        return age >= 18 && age <= 65;
    }, 'You must be between 18 and 65 years old'),
    city: z.string().min(2, 'City is required'),
    division: z.string().min(2, 'Division is required'),
    address: z.string().optional(),
})




export const updateProfileZodSchema = z.object({
    firstName: z.string().min(2, "First name is too short").optional(),
    lastName: z.string().min(2, "Last name is too short").optional(),
    phone: z.string().regex(/^[0-9]{10,15}$/, "Invalid phone number").optional(),
    bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
    gender: z.nativeEnum(Gender).optional(),

    // Use coerce to convert strings from form-data into numbers/booleans
    weight: z.coerce.number().positive("Weight must be a positive number").optional(),
    isAvailable: z.coerce.boolean().optional(),

    city: z.string().min(2).optional(),
    division: z.string().min(2).optional(),
    address: z.string().optional(),

    // avatar is usually handled by the controller after Cloudinary upload,
    // but we can allow the URL string here if needed.
    avatar: z.string().optional(),
});




export const userValidation = {
    createUserZodSchema,
    updateProfileZodSchema
};
