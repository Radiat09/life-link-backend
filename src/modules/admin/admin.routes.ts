import express from 'express';
import { AdminController } from './admin.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { changeUserStatusZodSchema } from './admin.validation';
import { UserRole } from '@prisma/client';

const router = express.Router();

// All routes require admin authentication
router.use(checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN));

// Dashboard and statistics
router.get('/dashboard/statistics', AdminController.getDashboardStats);
router.get('/dashboard/metrics', AdminController.getDashboardMetrics);

// Analytics
router.get('/analytics/donor-demographics', AdminController.getDonorDemographics);
router.get('/analytics/donation-trends', AdminController.getDonationTrends);
router.get('/analytics/request-analytics', AdminController.getRequestAnalytics);

// User management
router.get('/users', AdminController.getAllUsers);
router.get('/users/:id', AdminController.getUserDetails);

router.post(
  '/users/admin/create',
  checkAuth(UserRole.SUPER_ADMIN),
  validateRequest(changeUserStatusZodSchema),
  AdminController.changeUserStatus
);

router.patch(
  '/users/:id/status',
  validateRequest(changeUserStatusZodSchema),
  AdminController.changeUserStatus
);

// Reports and activity
router.get('/reports/activity', AdminController.getActivityReports);

export const adminRoutes = router;
