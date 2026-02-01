import { Request, Response } from 'express';
export declare const AdminController: {
    getAllUsers: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getDashboardStats: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    changeUserStatus: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    createAdmin: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getUserDetails: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    deleteUserAccount: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getActivityReports: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getDonorDemographics: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getDonationTrends: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getRequestAnalytics: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getDashboardMetrics: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=admin.controller.d.ts.map