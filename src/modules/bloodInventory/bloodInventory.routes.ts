import express from 'express';
import { BloodInventoryController } from './bloodInventory.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { createBloodInventoryZodSchema, updateBloodInventoryZodSchema, adjustBloodUnitsZodSchema } from './bloodInventory.validation';
import { UserRole } from '@prisma/client';

const router = express.Router();

// Public routes
router.get('/stats', BloodInventoryController.getInventoryStats);
router.get('/low-stock', BloodInventoryController.getLowStockInventory);
router.get('/', BloodInventoryController.getBloodInventory);
router.get('/:id', BloodInventoryController.getBloodInventoryById);

// Protected routes (admin/super-admin only)
router.post(
  '/',
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(createBloodInventoryZodSchema),
  BloodInventoryController.createBloodInventory
);

router.patch(
  '/:id',
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(updateBloodInventoryZodSchema),
  BloodInventoryController.updateBloodInventory
);

router.patch(
  '/:id/adjust',
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(adjustBloodUnitsZodSchema),
  BloodInventoryController.adjustBloodUnits
);

export const bloodInventoryRoutes = router;
