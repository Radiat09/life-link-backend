import { Request, Response } from 'express';
export declare const DonationController: {
    createDonation: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getAllDonations: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getDonationById: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateDonation: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getMyDonations: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getDonationStats: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    cancelDonation: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=donation.controller.d.ts.map