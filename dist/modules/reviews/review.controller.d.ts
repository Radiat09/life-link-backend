import { Request, Response } from 'express';
export declare const ReviewController: {
    createReview: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getAllReviews: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getReviewById: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateReview: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    deleteReview: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getDonorReviews: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getReviewStats: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=review.controller.d.ts.map