import z from 'zod';
export const loginSchema = z.object({
  body: z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  })
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  })
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.email('Invalid email address'),
  })
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const sendVerificationSchema = z.object({
  body: z.object({
    email: z.email('Invalid email address').optional(),
    phone: z.string().regex(/^[0-9]{10,15}$/, 'Invalid phone number').optional(),
  })
});

export const verifyEmailSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Verification token is required'),
  })
});

export const verifyPhoneSchema = z.object({
  body: z.object({
    phone: z.string().regex(/^[0-9]{10,15}$/, 'Invalid phone number'),
    code: z.string().length(6, 'Verification code must be 6 digits'),
  })
});

export type LoginInput = z.infer<typeof loginSchema>['body'];
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>['body'];
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>['body'];
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type SendVerificationInput = z.infer<typeof sendVerificationSchema>['body'];
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>['body'];
export type VerifyPhoneInput = z.infer<typeof verifyPhoneSchema>['body'];