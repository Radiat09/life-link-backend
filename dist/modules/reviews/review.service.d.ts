import { JwtPayload } from "jsonwebtoken";
interface IOptions {
    page?: string | number;
    limit?: string | number;
    sortBy?: string;
    sortOrder?: string;
}
interface ReviewResponse {
    data: any[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
        averageRating?: number;
    };
}
export declare const ReviewService: {
    createReview: (user: JwtPayload, data: any) => Promise<any>;
    getReviews: (filters: any, options: IOptions) => Promise<ReviewResponse>;
    getReviewById: (id: string) => Promise<any>;
    updateReview: (reviewId: string, userId: string, data: any) => Promise<any>;
    deleteReview: (reviewId: string, userId: string) => Promise<any>;
    getDonorReviews: (donorId: string, options: IOptions) => Promise<ReviewResponse>;
    getReviewStats: () => Promise<any>;
};
export {};
//# sourceMappingURL=review.service.d.ts.map