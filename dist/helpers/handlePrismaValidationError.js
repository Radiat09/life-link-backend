"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePrismaValidationError = void 0;
const handlePrismaValidationError = (err) => {
    const errorSources = [];
    // Handle Prisma specific validation errors
    if (err.meta && err.meta.target) {
        errorSources.push({
            path: err.meta.target.join("."),
            message: `Validation failed for fields: ${err.meta.target.join(", ")}`,
        });
    }
    else {
        errorSources.push({
            path: "unknown",
            message: "Database validation error occurred",
        });
    }
    return {
        statusCode: 400,
        message: "Database Validation Error",
        errorSources,
    };
};
exports.handlePrismaValidationError = handlePrismaValidationError;
//# sourceMappingURL=handlePrismaValidationError.js.map