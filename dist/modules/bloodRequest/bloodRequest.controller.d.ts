import { Request, Response } from 'express';
export declare const requestController: {
    createRequest: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getAllRequests: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getRequestById: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateRequest: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    deleteRequest: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getMyRequests: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getUrgentRequests: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    findMatchingDonors: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getStatistics: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=bloodRequest.controller.d.ts.map