import { Request, Response } from "express";
export declare const UserController: {
    createUser: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getAllFromDB: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    getMyProfile: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    changeProfileStatus: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
    updateMyProfile: (req: Request, res: Response, next: import("express").NextFunction) => Promise<void>;
};
//# sourceMappingURL=user.controller.d.ts.map