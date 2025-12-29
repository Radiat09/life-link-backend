import express, { NextFunction, Request, Response } from 'express'
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import { UserRole } from '@prisma/client';
import { checkAuth } from '../../middlewares/checkAuth';




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
    "/create-patient",
    // fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.createPatientValidationSchema.parse(JSON.parse(req.body.data))
        return UserController.createPatient(req, res, next)
    }
)

router.post(
    "/create-admin",
    // checkAuth(UserRole.ADMIN),
    // fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.createAdminValidationSchema.parse(JSON.parse(req.body.data))
        return UserController.createAdmin(req, res, next)
    }
);

router.post(
    "/create-doctor",
    // checkAuth(UserRole.ADMIN),
    // fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        console.log(JSON.parse(req.body.data))
        req.body = UserValidation.createDoctorValidationSchema.parse(JSON.parse(req.body.data))
        return UserController.createDoctor(req, res, next)
    }
);

router.patch(
    '/:id/status',
    checkAuth(UserRole.ADMIN),
    UserController.changeProfileStatus
);

router.patch(
    "/update-my-profile",
    // checkAuth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
    // fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        return UserController.updateMyProfie(req, res, next)
    }
);

export const userRoutes = router;