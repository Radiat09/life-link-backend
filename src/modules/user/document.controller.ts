import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AppError } from '../../utils/AppError';
import { prisma } from '../../config/prisma';
import { documentUploadService } from '../../utils/documentUploadService';
import path from 'path';

/**
 * Upload medical certificate
 */
const uploadMedicalCertificate = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  if (!req.file) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No file uploaded');
  }

  // Get user profile
  const profile = await prisma.profile.findUniqueOrThrow({
    where: { userId: user.id }
  });

  // Delete old certificate if exists
  if (profile.medicalCert) {
    try {
      await documentUploadService.deleteFile(
        documentUploadService.getFilePath(path.basename(profile.medicalCert))
      );
    } catch (error) {
      console.error('Error deleting old certificate:', error);
    }
  }

  // Update profile with new certificate
  const updatedProfile = await prisma.profile.update({
    where: { userId: user.id },
    data: {
      medicalCert: req.file.filename
    }
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Medical certificate uploaded successfully',
    data: {
      fileName: req.file.filename,
      fileSize: req.file.size,
      uploadedAt: new Date()
    }
  });
});

/**
 * Upload ID document
 */
const uploadIDDocument = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  if (!req.file) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No file uploaded');
  }

  // Get user profile
  const profile = await prisma.profile.findUniqueOrThrow({
    where: { userId: user.id }
  });

  // Delete old ID document if exists
  if (profile.idDocument) {
    try {
      await documentUploadService.deleteFile(
        documentUploadService.getFilePath(path.basename(profile.idDocument))
      );
    } catch (error) {
      console.error('Error deleting old ID document:', error);
    }
  }

  // Update profile with new ID document
  const updatedProfile = await prisma.profile.update({
    where: { userId: user.id },
    data: {
      idDocument: req.file.filename
    }
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'ID document uploaded successfully',
    data: {
      fileName: req.file.filename,
      fileSize: req.file.size,
      uploadedAt: new Date()
    }
  });
});

/**
 * Get document (download)
 */
const getDocument = catchAsync(async (req: Request, res: Response) => {
  const { fileName } = req.params;

  // Security: validate file name to prevent directory traversal
  if (fileName.includes('..') || fileName.includes('/')) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid file name');
  }

  const filePath = documentUploadService.getFilePath(fileName);

  // Check if file exists
  if (!documentUploadService.fileExists(filePath)) {
    throw new AppError(httpStatus.NOT_FOUND, 'Document not found');
  }

  res.download(filePath, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Error downloading file');
    }
  });
});

/**
 * Delete medical certificate
 */
const deleteMedicalCertificate = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const profile = await prisma.profile.findUniqueOrThrow({
    where: { userId: user.id }
  });

  if (!profile.medicalCert) {
    throw new AppError(httpStatus.NOT_FOUND, 'No medical certificate found');
  }

  // Delete file
  await documentUploadService.deleteFile(
    documentUploadService.getFilePath(path.basename(profile.medicalCert))
  );

  // Update profile
  await prisma.profile.update({
    where: { userId: user.id },
    data: {
      medicalCert: null
    }
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Medical certificate deleted successfully',
    data: null
  });
});

/**
 * Delete ID document
 */
const deleteIDDocument = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const profile = await prisma.profile.findUniqueOrThrow({
    where: { userId: user.id }
  });

  if (!profile.idDocument) {
    throw new AppError(httpStatus.NOT_FOUND, 'No ID document found');
  }

  // Delete file
  await documentUploadService.deleteFile(
    documentUploadService.getFilePath(path.basename(profile.idDocument))
  );

  // Update profile
  await prisma.profile.update({
    where: { userId: user.id },
    data: {
      idDocument: null
    }
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'ID document deleted successfully',
    data: null
  });
});

/**
 * Get verification status
 */
const getVerificationStatus = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const userWithProfile = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
    include: { profile: true }
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Verification status retrieved successfully',
    data: {
      emailVerified: userWithProfile.emailVerified,
      phoneVerified: userWithProfile.phoneVerified,
      emergencyVerified: userWithProfile.profile?.emergencyVerified || false,
      hasMedicalCertificate: !!userWithProfile.profile?.medicalCert,
      hasIDDocument: !!userWithProfile.profile?.idDocument,
      fullVerificationComplete:
        userWithProfile.emailVerified &&
        userWithProfile.phoneVerified &&
        !!userWithProfile.profile?.medicalCert &&
        !!userWithProfile.profile?.idDocument
    }
  });
});

export const documentController = {
  uploadMedicalCertificate,
  uploadIDDocument,
  getDocument,
  deleteMedicalCertificate,
  deleteIDDocument,
  getVerificationStatus
};
