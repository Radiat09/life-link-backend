import express from 'express';
import { authRoutes } from '../modules/auth/auth.routes';
import { userRoutes } from '../modules/user/user.routes';
import { bloodRequestRoutes } from '../modules/bloodRequest/bloodRequest.route';
const router = express.Router();

const moduleRoutes = [
  {
    path: '/user',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/blood-requests',
    route: bloodRequestRoutes,
  },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
