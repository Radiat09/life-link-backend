import { BloodGroup, UrgencyLevel } from '@prisma/client';
import { z } from 'zod';


// Validation schemas
export const createRequestBloodSchema = z.object({
  body: z.object({
    title: z.string()
      .min(10, 'Title must be at least 10 characters')
      .max(200, 'Title must not exceed 200 characters'),
    description: z.string()
      .min(20, 'Description must be at least 20 characters')
      .max(1000, 'Description must not exceed 1000 characters')
      .optional(),
    bloodGroup: z.enum(BloodGroup),
    unitsRequired: z.number()
      .int('Units must be an integer')
      .min(1, 'At least 1 unit is required')
      .max(20, 'Maximum 20 units per request'),
    urgencyLevel: z.enum(Object.values(UrgencyLevel) as [string, ...string[]])
      .default('MEDIUM'),
    hospitalName: z.string()
      .min(3, 'Hospital name must be at least 3 characters')
      .max(100, 'Hospital name must not exceed 100 characters'),
    hospitalAddress: z.string()
      .min(10, 'Hospital address must be at least 10 characters')
      .max(500, 'Hospital address must not exceed 500 characters'),
    city: z.string()
      .min(2, 'City must be at least 2 characters')
      .max(50, 'City must not exceed 50 characters'),
    contactPerson: z.string()
      .min(3, 'Contact person name must be at least 3 characters')
      .max(50, 'Contact person name must not exceed 50 characters'),
    contactPhone: z.string()
      .regex(/^[0-9]{10,15}$/, 'Invalid phone number'),
    requiredDate: z.string()
      .refine((date) => {
        const requiredDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return requiredDate >= today;
      }, 'Required date must be today or in the future')
  })
});

export const updateRequestBloodSchema = z.object({
  body: z.object({
    title: z.string()
      .min(10, 'Title must be at least 10 characters')
      .max(200, 'Title must not exceed 200 characters')
      .optional(),
    description: z.string()
      .min(20, 'Description must be at least 20 characters')
      .max(1000, 'Description must not exceed 1000 characters')
      .optional(),
    unitsRequired: z.number()
      .int('Units must be an integer')
      .min(1, 'At least 1 unit is required')
      .max(20, 'Maximum 20 units per request')
      .optional(),
    urgencyLevel: z.enum(Object.values(UrgencyLevel) as [string, ...string[]])
      .optional(),
    hospitalName: z.string()
      .min(3, 'Hospital name must be at least 3 characters')
      .max(100, 'Hospital name must not exceed 100 characters')
      .optional(),
    hospitalAddress: z.string()
      .min(10, 'Hospital address must be at least 10 characters')
      .max(500, 'Hospital address must not exceed 500 characters')
      .optional(),
    city: z.string()
      .min(2, 'City must be at least 2 characters')
      .max(50, 'City must not exceed 50 characters')
      .optional(),
    contactPerson: z.string()
      .min(3, 'Contact person name must be at least 3 characters')
      .max(50, 'Contact person name must not exceed 50 characters')
      .optional(),
    contactPhone: z.string()
      .regex(/^[0-9]{10,15}$/, 'Invalid phone number')
      .optional(),
    requiredDate: z.string()
      .refine((date) => {
        const requiredDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return requiredDate >= today;
      }, 'Required date must be today or in the future')
      .optional(),
    status: z.enum(['PENDING', 'ACTIVE', 'CANCELLED']).optional()
  }),
  params: z.object({
    id: z.string().cuid('Invalid request ID')
  })
});

export const searchRequestBloodSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).default(1),
    limit: z.string().regex(/^\d+$/).transform(Number).default(10),
    bloodGroup: z.enum([...Object.values(BloodGroup), '']).optional(),
    city: z.string().optional(),
    urgencyLevel: z.enum([...Object.values(UrgencyLevel), '']).optional(),
    status: z.enum(['PENDING', 'ACTIVE', 'FULFILLED', 'CANCELLED', '']).optional(),
    sortBy: z.enum(['createdAt', 'requiredDate', 'urgencyLevel']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    search: z.string().optional()
  })
});

// Types
export type CreateRequestBloodInput = z.infer<typeof createRequestBloodSchema>['body'];
export type UpdateRequestBloodInput = z.infer<typeof updateRequestBloodSchema>['body'];
export type SearchRequestBloodInput = z.infer<typeof searchRequestBloodSchema>['query'];
// Response types
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