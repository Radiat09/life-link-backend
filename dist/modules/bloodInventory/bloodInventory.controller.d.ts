import { Request, Response } from 'express';
export declare const BloodInventoryController: {
    createBloodInventory: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getBloodInventory: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getBloodInventoryById: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateBloodInventory: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    adjustBloodUnits: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getLowStockInventory: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getInventoryStats: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=bloodInventory.controller.d.ts.map