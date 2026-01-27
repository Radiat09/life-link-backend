import express from 'express';
import { DonationController } from './donation.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { createDonationZodSchema, updateDonationZodSchema } from './donation.validation';
import { UserRole } from '@prisma/client';

const router = express.Router();

// Public routes
router.get('/statistics', DonationController.getDonationStats);

// Protected routes
router.post(
  '/',
  checkAuth(UserRole.DONOR, UserRole.HOSPITAL, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(createDonationZodSchema),
  DonationController.createDonation
);

router.get(
  '/my-donations',
  checkAuth(UserRole.DONOR, UserRole.HOSPITAL, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  DonationController.getMyDonations
);

router.get(
  '/',
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  DonationController.getAllDonations
);

router.get(
  '/:id',
  checkAuth(UserRole.DONOR, UserRole.HOSPITAL, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  DonationController.getDonationById
);

router.patch(
  '/:id',
  checkAuth(UserRole.DONOR, UserRole.HOSPITAL, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(updateDonationZodSchema),
  DonationController.updateDonation
);

router.patch(
  '/:id/cancel',
  checkAuth(UserRole.DONOR, UserRole.HOSPITAL, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  DonationController.cancelDonation
);

export const donationRoutes = router;
