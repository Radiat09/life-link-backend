import express from 'express';
import { NotificationController } from './notification.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { UserRole } from '@prisma/client';

const router = express.Router();

// All routes require authentication
router.get(
  '/',
  checkAuth(UserRole.DONOR, UserRole.HOSPITAL, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  NotificationController.getNotifications
);

router.patch(
  '/:id/read',
  checkAuth(UserRole.DONOR, UserRole.HOSPITAL, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  NotificationController.markAsRead
);

router.delete(
  '/:id',
  checkAuth(UserRole.DONOR, UserRole.HOSPITAL, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  NotificationController.deleteNotification
);

export const notificationRoutes = router;
