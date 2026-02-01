"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.refreshTokenSchema = exports.loginSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.loginSchema = zod_1.default.object({
    body: zod_1.default.object({
        email: zod_1.default.email('Invalid email address'),
        password: zod_1.default.string().min(1, 'Password is required'),
    })
});
exports.refreshTokenSchema = zod_1.default.object({
    body: zod_1.default.object({
        refreshToken: zod_1.default.string().min(1, 'Refresh token is required'),
    })
});
exports.forgotPasswordSchema = zod_1.default.object({
    body: zod_1.default.object({
        email: zod_1.default.email('Invalid email address'),
    })
});
exports.resetPasswordSchema = zod_1.default.object({
    token: zod_1.default.string().min(1, 'Token is required'),
    password: zod_1.default.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
});
//# sourceMappingURL=auth.validation.js.map