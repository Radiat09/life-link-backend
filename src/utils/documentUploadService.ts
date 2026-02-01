import { Express } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AppError } from './AppError';
import httpStatus from 'http-status';

interface UploadOptions {
  maxFileSize?: number; // in bytes
  allowedMimeTypes?: string[];
  storagePath?: string;
}

const DEFAULT_OPTIONS: UploadOptions = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  storagePath: './uploads/documents'
};

class DocumentUploadService {
  private storage: multer.StorageEngine;
  private upload: multer.Multer;
  private options: UploadOptions;

  constructor(options: UploadOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.ensureUploadDirectory();
    this.storage = this.createStorage();
    this.upload = multer({
      storage: this.storage,
      limits: {
        fileSize: this.options.maxFileSize
      },
      fileFilter: this.fileFilter.bind(this)
    });
  }

  private ensureUploadDirectory(): void {
    const dir = this.options.storagePath;
    if (!fs.existsSync(dir!)) {
      fs.mkdirSync(dir!, { recursive: true });
    }
  }

  private createStorage(): multer.StorageEngine {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.options.storagePath!);
      },
      filename: (req, file, cb) => {
        // Create unique filename with timestamp
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}-${uniqueSuffix}${ext}`);
      }
    });
  }

  private fileFilter(
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ): void {
    // Check file size
    if (file.size > this.options.maxFileSize!) {
      return cb(new AppError(httpStatus.BAD_REQUEST, 'File size exceeds maximum limit'));
    }

    // Check MIME type
    if (!this.options.allowedMimeTypes!.includes(file.mimetype)) {
      return cb(new AppError(httpStatus.BAD_REQUEST, 'File type not allowed. Allowed types: PDF, JPEG, PNG, DOC, DOCX'));
    }

    cb(null, true);
  }

  getMedicalCertificateUpload() {
    return this.upload.single('medicalCertificate');
  }

  getIDDocumentUpload() {
    return this.upload.single('idDocument');
  }

  getProfilePhotoUpload() {
    return this.upload.single('profilePhoto');
  }

  /**
   * Delete a file from the server
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to delete file');
    }
  }

  /**
   * Get file path
   */
  getFilePath(fileName: string): string {
    return path.join(this.options.storagePath!, fileName);
  }

  /**
   * Get public URL for file
   */
  getPublicUrl(fileName: string): string {
    return `/documents/${fileName}`;
  }

  /**
   * Validate file exists
   */
  fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }
}

export const documentUploadService = new DocumentUploadService();
