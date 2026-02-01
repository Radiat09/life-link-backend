import { JwtPayload } from "jsonwebtoken";
interface IOptions {
    page?: string | number;
    limit?: string | number;
    sortBy?: string;
    sortOrder?: string;
}
interface DonationResponse {
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
export declare const DonationService: {
    createDonation: (user: JwtPayload, data: any) => Promise<any>;
    getDonations: (filters: any, options: IOptions) => Promise<DonationResponse>;
    getDonationById: (id: string) => Promise<any>;
    updateDonation: (donationId: string, userId: string, data: any) => Promise<any>;
    getUserDonations: (userId: string, filters: any, options: IOptions) => Promise<DonationResponse>;
    getDonationStats: (filters: any) => Promise<any>;
    cancelDonation: (donationId: string, userId: string) => Promise<any>;
};
export {};
//# sourceMappingURL=donation.service.d.ts.map