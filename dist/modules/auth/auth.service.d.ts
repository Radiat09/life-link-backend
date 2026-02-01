import { JwtPayload } from "jsonwebtoken";
export declare const AuthService: {
    login: (payload: {
        email: string;
        password: string;
    }) => Promise<{
        needPasswordChange: boolean;
        accessToken: string;
        refreshToken: string;
    }>;
    refreshToken: (token: string) => Promise<{
        accessToken: string;
        needPasswordChange: boolean;
    }>;
    changePassword: (user: any, payload: any) => Promise<{
        message: string;
    }>;
    forgotPassword: (payload: {
        email: string;
    }) => Promise<void>;
    resetPassword: (token: string, payload: {
        id: string;
        password: string;
    }) => Promise<void>;
    getMe: (decodedData: JwtPayload) => Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
        needPassChange: boolean;
    }>;
    sendEmailVerification: (userId: string) => Promise<{
        message: string;
    }>;
    verifyEmail: (token: string) => Promise<{
        message: string;
    }>;
    sendPhoneVerification: (userId: string) => Promise<{
        message: string;
    }>;
    verifyPhone: (userId: string, code: string) => Promise<{
        message: string;
    }>;
    checkEmergencyRestrictions: (userId: string, isEmergency?: boolean) => Promise<{
        allowed: boolean;
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map