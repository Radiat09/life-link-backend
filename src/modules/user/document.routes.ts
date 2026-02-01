import express from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { UserRole } from '@prisma/client';
import { documentController } from './document.controller';
import { documentUploadService } from '../../utils/documentUploadService';

const router = express.Router();

/**
 * Verification and document management routes
 */

// Get verification status
router.get(
  '/verification-status',
  checkAuth(UserRole.USER, UserRole.HOSPITAL),
  documentController.getVerificationStatus
);

// Upload medical certificate
router.post(
  '/upload-medical-certificate',
  checkAuth(UserRole.USER, UserRole.HOSPITAL),
  documentUploadService.getMedicalCertificateUpload(),
  documentController.uploadMedicalCertificate
);

// Upload ID document
router.post(
  '/upload-id-document',
  checkAuth(UserRole.USER, UserRole.HOSPITAL),
  documentUploadService.getIDDocumentUpload(),
  documentController.uploadIDDocument
);

// Download document
router.get(
  '/download/:fileName',
  checkAuth(UserRole.USER, UserRole.HOSPITAL, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  documentController.getDocument
);

// Delete medical certificate
router.delete(
  '/delete-medical-certificate',
  checkAuth(UserRole.USER, UserRole.HOSPITAL),
  documentController.deleteMedicalCertificate
);

// Delete ID document
router.delete(
  '/delete-id-document',
  checkAuth(UserRole.USER, UserRole.HOSPITAL),
  documentController.deleteIDDocument
);

export const documentRoutes = router;
