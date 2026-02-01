"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerWithErrorHandling = exports.FileUploadService = void 0;
// utils/fileUploader.ts
const multer_1 = __importDefault(require("multer"));
const cloudinary_config_1 = require("../config/cloudinary.config");
// Memory storage - files are stored in memory as Buffer
const memoryStorage = multer_1.default.memoryStorage();
// Multer instance with memory storage
const multerUpload = (0, multer_1.default)({
    storage: memoryStorage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});
// Function to sanitize filename
const sanitizeFileName = (originalName) => {
    const fileName = originalName
        .toLowerCase()
        .replace(/\s+/g, "-") // Replace spaces with dashes
        .replace(/\./g, "-")
        .replace(/[^a-z0-9\-\.]/g, ""); // Remove special characters
    const extension = originalName.split(".").pop() || '';
    const uniqueFileName = Math.random().toString(36).substring(2) +
        "-" +
        Date.now() +
        "-" +
        fileName +
        "." +
        extension;
    return uniqueFileName;
};
// Service functions for Cloudinary upload
class FileUploadService {
    /**
     * Upload a single file to Cloudinary
     */
    static async uploadSingleFile(fileBuffer, originalname, options = {}) {
        try {
            const publicId = sanitizeFileName(originalname);
            // Convert buffer to data URI
            const dataUri = `data:${this.getMimeType(originalname)};base64,${fileBuffer.toString('base64')}`;
            const uploadOptions = {
                public_id: publicId,
                folder: options.folder || 'uploads',
                resource_type: options.resource_type || 'auto',
            };
            if (options.transformation) {
                uploadOptions.transformation = options.transformation;
            }
            const uploadResult = await cloudinary_config_1.cloudinary.uploader.upload(dataUri, uploadOptions);
            return {
                success: true,
                data: uploadResult,
            };
        }
        catch (error) {
            console.error('Cloudinary upload error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Upload failed',
            };
        }
    }
    /**
     * Upload multiple files to Cloudinary
     */
    static async uploadMultipleFiles(files, options = {}) {
        const uploadPromises = files.map(file => this.uploadSingleFile(file.buffer, file.originalname, options));
        const results = await Promise.all(uploadPromises);
        return results;
    }
    /**
     * Delete file from Cloudinary
     */
    static async deleteFile(publicId) {
        try {
            const result = await cloudinary_config_1.cloudinary.uploader.destroy(publicId);
            return {
                success: result.result === 'ok',
                data: result,
            };
        }
        catch (error) {
            console.error('Cloudinary delete error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Delete failed',
            };
        }
    }
    /**
     * Delete file by URL
     */
    static async deleteFileByUrl(url) {
        try {
            // Extract public_id from Cloudinary URL
            const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp|pdf|doc|docx)$/i;
            const match = url.match(regex);
            if (match && match[1]) {
                const publicId = match[1];
                return await this.deleteFile(publicId);
            }
            return {
                success: false,
                error: 'Invalid Cloudinary URL',
            };
        }
        catch (error) {
            console.error('Cloudinary delete error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Delete failed',
            };
        }
    }
    /**
     * Get MIME type from filename
     */
    static getMimeType(filename) {
        const extension = filename.split('.').pop()?.toLowerCase();
        const mimeTypes = {
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            gif: 'image/gif',
            webp: 'image/webp',
            pdf: 'application/pdf',
            doc: 'application/msword',
            docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        };
        return mimeTypes[extension || ''] || 'application/octet-stream';
    }
}
exports.FileUploadService = FileUploadService;
// Multer middleware with error handling
exports.multerWithErrorHandling = {
    // Single file
    single: (fieldName) => {
        return (req, res, next) => {
            multerUpload.single(fieldName)(req, res, (err) => {
                handleMulterError(err, res, next);
            });
        };
    },
    // Multiple files
    array: (fieldName, maxCount) => {
        return (req, res, next) => {
            multerUpload.array(fieldName, maxCount)(req, res, (err) => {
                handleMulterError(err, res, next);
            });
        };
    },
    // Multiple fields with different files
    fields: (fields) => {
        return (req, res, next) => {
            multerUpload.fields(fields)(req, res, (err) => {
                handleMulterError(err, res, next);
            });
        };
    },
    // Any file (single or multiple)
    any: () => {
        return (req, res, next) => {
            multerUpload.any()(req, res, (err) => {
                handleMulterError(err, res, next);
            });
        };
    },
};
// Common error handler
const handleMulterError = (err, res, next) => {
    if (err) {
        // Handle Multer-specific errors
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(413).json({
                success: false,
                message: "File too large. Maximum size is 5MB",
            });
        }
        if (err.code === "LIMIT_FILE_COUNT") {
            return res.status(400).json({
                success: false,
                message: "Too many files",
            });
        }
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({
                success: false,
                message: "Unexpected file field",
            });
        }
        // Handle unsupported file type
        if (err.message && err.message.includes("Unsupported file type")) {
            return res.status(400).json({
                success: false,
                message: "Unsupported file type",
            });
        }
        return res.status(500).json({
            success: false,
            message: "File upload failed",
            error: err.message,
        });
    }
    return next();
};
exports.default = multerUpload;
//# sourceMappingURL=multer.config.js.map