import { z } from 'zod';

export const createBloodInventoryZodSchema = z.object({
  body: z.object({
    hospitalId: z.string().optional(),
    bloodGroup: z.string(),
    unitsAvailable: z.number().int().positive(),
    minThreshold: z.number().int().positive(),
    notes: z.string().optional()
  })
});

export const updateBloodInventoryZodSchema = z.object({
  body: z.object({
    unitsAvailable: z.number().int().nonnegative().optional(),
    minThreshold: z.number().int().positive().optional(),
    notes: z.string().optional()
  })
});

export const adjustBloodUnitsZodSchema = z.object({
  body: z.object({
    quantity: z.number().int(),
    type: z.enum(['add', 'deduct']),
    reason: z.string().optional()
  })
});
