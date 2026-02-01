"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerDuplicateError = void 0;
// helpers/handleDuplicateError.ts
const handlerDuplicateError = (err) => {
    // For Prisma P2002 error (unique constraint violation)
    const field = err.meta?.target?.[0] || "unknown field";
    const value = err.meta?.target?.[1] || "unknown value";
    return {
        statusCode: 409,
        message: `Duplicate value '${value}' for field '${field}'. This value already exists.`,
        errorSources: [
            {
                path: field,
                message: `A record with this ${field} already exists`,
            },
        ],
    };
};
exports.handlerDuplicateError = handlerDuplicateError;
//# sourceMappingURL=handleDuplicateError.js.map