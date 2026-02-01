import { RequestStatus, UrgencyLevel, BloodGroup, UserRole } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
interface CreateRequestInput {
    title: string;
    description?: string;
    bloodGroup: BloodGroup;
    unitsRequired?: number;
    urgencyLevel?: UrgencyLevel;
    hospitalName: string;
    hospitalAddress: string;
    city: string;
    contactPerson: string;
    contactPhone: string;
    requiredDate: Date;
    isEmergency?: boolean;
}
interface UpdateRequestInput {
    title?: string;
    description?: string;
    unitsRequired?: number;
    urgencyLevel?: UrgencyLevel;
    hospitalName?: string;
    hospitalAddress?: string;
    city?: string;
    contactPerson?: string;
    contactPhone?: string;
    requiredDate?: Date;
    status?: RequestStatus;
}
interface PaginatedRequests {
    data: any[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
export declare const BloodRequestService: {
    createRequest: (user: JwtPayload, data: CreateRequestInput) => Promise<any>;
    getRequests: (filters: any) => Promise<PaginatedRequests>;
    getRequestById: (id: string) => Promise<any>;
    updateRequest: (requestId: string, userId: string, data: UpdateRequestInput) => Promise<any>;
    deleteRequest: (requestId: string, userId: string, userRole: UserRole) => Promise<any>;
    getUserRequests: (userId: string, filters: any) => Promise<PaginatedRequests>;
    getUrgentRequests: (filters: any) => Promise<any[]>;
    findMatchingDonors: (requestId: string) => Promise<any[]>;
    updateRequestStatus: (requestId: string) => Promise<void>;
    getRequestStatistics: () => Promise<any>;
};
export {};
//# sourceMappingURL=bloodRequest.service.d.ts.map