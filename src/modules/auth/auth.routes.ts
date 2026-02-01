import { UserRole } from "@prisma/client";
import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { authController } from "./auth.controller";

const router = express.Router();


router.get(
  "/me",
  checkAuth(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN
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
    UserRole.SUPER_ADMIN
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

router.post(
  '/send-email-verification',
  checkAuth(
    UserRole.USER,
    UserRole.HOSPITAL
  ),
  authController.sendEmailVerification
);

router.post(
  '/verify-email',
  authController.verifyEmail
);

router.post(
  '/send-phone-verification',
  checkAuth(
    UserRole.USER,
    UserRole.HOSPITAL
  ),
  authController.sendPhoneVerification
);

router.post(
  '/verify-phone',
  checkAuth(
    UserRole.USER,
    UserRole.HOSPITAL
  ),
  authController.verifyPhone
);

export const authRoutes = router;
