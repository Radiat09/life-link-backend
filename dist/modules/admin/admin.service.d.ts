import { UserStatus } from "@prisma/client";
interface IOptions {
    page?: string | number;
    limit?: string | number;
    sortBy?: string;
    sortOrder?: string;
}
interface PaginatedResponse {
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
export declare const AdminService: {
    getAllUsers: (filters: any, options: IOptions) => Promise<PaginatedResponse>;
    getDashboardStats: () => Promise<any>;
    changeUserStatus: (userId: string, data: {
        status: UserStatus;
        reason?: string;
    }) => Promise<any>;
    createAdmin: (data: any) => Promise<any>;
    getUserDetails: (userId: string) => Promise<any>;
    deleteUserAccount: (userId: string) => Promise<any>;
    getActivityReports: (filters: any, options: IOptions) => Promise<PaginatedResponse>;
};
export {};
//# sourceMappingURL=admin.service.d.ts.map