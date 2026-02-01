import { User } from '@prisma/client';
export declare const createUserTokens: (user: Partial<User>) => {
    accessToken: string;
    refreshToken: string;
};
export declare const createNewAccessTokenWithRefreshToken: (refreshToken: string) => Promise<{
    accessToken: string;
    needPasswordChange: boolean;
}>;
//# sourceMappingURL=userTokens.d.ts.map