import multer from 'multer';
import { NextFunction, Request, Response } from 'express';
declare const multerUpload: multer.Multer;
export declare class FileUploadService {
    /**
     * Upload a single file to Cloudinary
     */
    static uploadSingleFile(fileBuffer: Buffer, originalname: string, options?: {
        folder?: string;
        transformation?: any[];
        resource_type?: 'auto' | 'image' | 'video' | 'raw';
    }): Promise<{
        success: boolean;
        data: import("cloudinary").UploadApiResponse;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        data?: undefined;
    }>;
    /**
     * Upload multiple files to Cloudinary
     */
    static uploadMultipleFiles(files: Array<{
        buffer: Buffer;
        originalname: string;
    }>, options?: {
        folder?: string;
        transformation?: any[];
        resource_type?: 'auto' | 'image' | 'video' | 'raw';
    }): Promise<({
        success: boolean;
        data: import("cloudinary").UploadApiResponse;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        data?: undefined;
    })[]>;
    /**
     * Delete file from Cloudinary
     */
    static deleteFile(publicId: string): Promise<{
        success: boolean;
        data: any;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        data?: undefined;
    }>;
    /**
     * Delete file by URL
     */
    static deleteFileByUrl(url: string): Promise<{
        success: boolean;
        data: any;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        data?: undefined;
    }>;
    /**
     * Get MIME type from filename
     */
    private static getMimeType;
}
export declare const multerWithErrorHandling: {
    single: (fieldName: string) => (req: Request, res: Response, next: NextFunction) => void;
    array: (fieldName: string, maxCount?: number) => (req: Request, res: Response, next: NextFunction) => void;
    fields: (fields: multer.Field[]) => (req: Request, res: Response, next: NextFunction) => void;
    any: () => (req: Request, res: Response, next: NextFunction) => void;
};
export default multerUpload;
//# sourceMappingURL=multer.config.d.ts.map