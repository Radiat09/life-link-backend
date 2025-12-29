import { UserRole } from "@prisma/client";
import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { authController } from "./auth.controller";

const router = express.Router();


router.get(
  "/me",
  checkAuth(
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT
  ),
  authController.getMe
)

router.post(
  "/login",
  authController.login
)

router.post(
  '/refresh-token',
  authController.refreshToken
)

router.post(
  '/change-password',
  checkAuth(
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT
  ),
  authController.changePassword
);

router.post(
  '/forgot-password',
  authController.forgotPassword
);

router.post(
  '/reset-password',
  authController.resetPassword
)
export const authRoutes = router;
