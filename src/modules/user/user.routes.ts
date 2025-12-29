import express, { NextFunction, Request, Response } from 'express'
import { UserController } from './user.controller';
import { userValidation } from './user.validation';
import { UserRole } from '@prisma/client';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { multerWithErrorHandling } from '../../config/multer.config';




const router = express.Router();

router.get(
    "/",
    checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    UserController.getAllFromDB
)

router.get(
    '/me',
    checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DONOR, UserRole.HOSPITAL, UserRole.RECIPIENT),
    UserController.getMyProfile
)

router.post(
    "/",
    validateRequest(userValidation.createUserZodSchema),
    UserController.createUser
)


router.patch(
    '/:id/status',
    checkAuth(UserRole.ADMIN),
    UserController.changeProfileStatus
);

router.patch(
    "/update-my-profile",
    multerWithErrorHandling.single('file'),
    checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DONOR, UserRole.HOSPITAL, UserRole.RECIPIENT),
    validateRequest(userValidation.updateProfileZodSchema),
    UserController.updateMyProfile

);

export const userRoutes = router;