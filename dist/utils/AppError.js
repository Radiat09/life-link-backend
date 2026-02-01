"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    constructor(statusCode, message, errorSources, stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.errorSources = errorSources;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.AppError = AppError;
//# sourceMappingURL=AppError.js.map