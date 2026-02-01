import { NextFunction, Request, Response } from 'express';
import { ZodObject } from 'zod';
export declare const validateRequest: (zodSchema: ZodObject) => (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=validateRequest.d.ts.map