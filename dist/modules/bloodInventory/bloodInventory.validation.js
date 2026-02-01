"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adjustBloodUnitsZodSchema = exports.updateBloodInventoryZodSchema = exports.createBloodInventoryZodSchema = void 0;
const zod_1 = require("zod");
exports.createBloodInventoryZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        hospitalId: zod_1.z.string().optional(),
        bloodGroup: zod_1.z.string(),
        unitsAvailable: zod_1.z.number().int().positive(),
        minThreshold: zod_1.z.number().int().positive(),
        notes: zod_1.z.string().optional()
    })
});
exports.updateBloodInventoryZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        unitsAvailable: zod_1.z.number().int().nonnegative().optional(),
        minThreshold: zod_1.z.number().int().positive().optional(),
        notes: zod_1.z.string().optional()
    })
});
exports.adjustBloodUnitsZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        quantity: zod_1.z.number().int(),
        type: zod_1.z.enum(['add', 'deduct']),
        reason: zod_1.z.string().optional()
    })
});
//# sourceMappingURL=bloodInventory.validation.js.map