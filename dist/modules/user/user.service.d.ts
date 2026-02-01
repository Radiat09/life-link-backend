import { Request } from "express";
import { Prisma, UserStatus } from "@prisma/client";
import { IOptions } from "../../helpers/paginationHelper";
import { JwtPayload } from "jsonwebtoken";
export declare const UserService: {
    createUser: (req: Request) => Promise<{
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            isVerified: boolean;
            profile: {
                firstName: string;
                lastName: string;
                bloodGroup: import(".prisma/client").$Enums.BloodGroup;
                city: string;
            };
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    getAllFromDB: (params: any, options: IOptions) => Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
        };
        data: {
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.UserRole;
            isVerified: boolean;
            emailVerified: boolean;
            phoneVerified: boolean;
            verificationToken: string | null;
            verificationExpires: Date | null;
            lastRequestDate: Date | null;
            requestCount: number;
            createdAt: Date;
            updatedAt: Date;
            needPassChange: boolean;
            status: import(".prisma/client").$Enums.UserStatus;
        }[];
    }>;
    getMyProfile: (user: JwtPayload) => Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
        needPassChange: boolean;
        status: import(".prisma/client").$Enums.UserStatus;
        profile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            firstName: string;
            lastName: string;
            phone: string;
            avatar: string | null;
            bio: string | null;
            gender: import(".prisma/client").$Enums.Gender | null;
            bloodGroup: import(".prisma/client").$Enums.BloodGroup;
            dateOfBirth: Date;
            weight: number | null;
            lastDonation: Date | null;
            address: string | null;
            city: string;
            division: string;
            country: string;
            latitude: number | null;
            longitude: number | null;
            isAvailable: boolean;
            notificationPrefs: Prisma.JsonValue;
            medicalCert: string | null;
            idDocument: string | null;
            emergencyVerified: boolean;
        } | null;
    }>;
    changeProfileStatus: (id: string, payload: {
        status: UserStatus;
    }) => Promise<{
        id: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.UserRole;
        isVerified: boolean;
        emailVerified: boolean;
        phoneVerified: boolean;
        verificationToken: string | null;
        verificationExpires: Date | null;
        lastRequestDate: Date | null;
        requestCount: number;
        createdAt: Date;
        updatedAt: Date;
        needPassChange: boolean;
        status: import(".prisma/client").$Enums.UserStatus;
    }>;
    updateMyProfile: (req: Request) => Promise<{
        profile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            firstName: string;
            lastName: string;
            phone: string;
            avatar: string | null;
            bio: string | null;
            gender: import(".prisma/client").$Enums.Gender | null;
            bloodGroup: import(".prisma/client").$Enums.BloodGroup;
            dateOfBirth: Date;
            weight: number | null;
            lastDonation: Date | null;
            address: string | null;
            city: string;
            division: string;
            country: string;
            latitude: number | null;
            longitude: number | null;
            isAvailable: boolean;
            notificationPrefs: Prisma.JsonValue;
            medicalCert: string | null;
            idDocument: string | null;
            emergencyVerified: boolean;
        } | null;
    } & {
        id: string;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.UserRole;
        isVerified: boolean;
        emailVerified: boolean;
        phoneVerified: boolean;
        verificationToken: string | null;
        verificationExpires: Date | null;
        lastRequestDate: Date | null;
        requestCount: number;
        createdAt: Date;
        updatedAt: Date;
        needPassChange: boolean;
        status: import(".prisma/client").$Enums.UserStatus;
    }>;
};
//# sourceMappingURL=user.service.d.ts.map