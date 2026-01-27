import express from 'express';
import { authRoutes } from '../modules/auth/auth.routes';
import { userRoutes } from '../modules/user/user.routes';
import { bloodRequestRoutes } from '../modules/bloodRequest/bloodRequest.route';
import { donationRoutes } from '../modules/donations/donation.routes';
import { reviewRoutes } from '../modules/reviews/review.routes';
import { notificationRoutes } from '../modules/notifications/notification.routes';
import { bloodInventoryRoutes } from '../modules/bloodInventory/bloodInventory.routes';
import { adminRoutes } from '../modules/admin/admin.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/user',
    route: userRoutes,
  },
  {
    path: '/blood-requests',
    route: bloodRequestRoutes,
  },
  {
    path: '/donations',
    route: donationRoutes,
  },
  {
    path: '/reviews',
    route: reviewRoutes,
  },
  {
    path: '/notifications',
    route: notificationRoutes,
  },
  {
    path: '/blood-inventory',
    route: bloodInventoryRoutes,
  },
  {
    path: '/admin',
    route: adminRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

