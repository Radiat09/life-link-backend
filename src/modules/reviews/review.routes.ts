import express from 'express';
import { ReviewController } from './review.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { createReviewZodSchema, updateReviewZodSchema } from './review.validation';
import { UserRole } from '@prisma/client';

const router = express.Router();

// Public routes
router.get('/statistics', ReviewController.getReviewStats);
router.get('/donor/:donorId', ReviewController.getDonorReviews);

// Protected routes
router.post(
  '/',
  checkAuth(UserRole.DONOR, UserRole.RECIPIENT, UserRole.HOSPITAL, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(createReviewZodSchema),
  ReviewController.createReview
);

router.get(
  '/',
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ReviewController.getAllReviews
);

router.get(
  '/:id',
  ReviewController.getReviewById
);

router.patch(
  '/:id',
  checkAuth(UserRole.DONOR, UserRole.RECIPIENT, UserRole.HOSPITAL, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(updateReviewZodSchema),
  ReviewController.updateReview
);

router.delete(
  '/:id',
  checkAuth(UserRole.DONOR, UserRole.RECIPIENT, UserRole.HOSPITAL, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ReviewController.deleteReview
);

export const reviewRoutes = router;
