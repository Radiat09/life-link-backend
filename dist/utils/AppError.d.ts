import { TErrorSources } from "../interfaces/error.types";
export declare class AppError extends Error {
    statusCode: number;
    errorSources?: TErrorSources[];
    constructor(statusCode: number, message: string, errorSources?: TErrorSources[], stack?: string);
}
//# sourceMappingURL=AppError.d.ts.map