import express from 'express';
import { requestController } from './bloodRequest.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { checkAuth } from '../../middlewares/checkAuth';
import { createRequestBloodSchema, updateRequestBloodSchema } from './bloodRequest.validation';


const router = express.Router();

// Public routes (accessible without authentication)
router.get('/urgent', requestController.getUrgentRequests);
router.get('/', requestController.getAllRequests);

// Protected routes (require authentication)
router.post(
  '/',
  validateRequest(createRequestBloodSchema),
  requestController.createRequest
);

router.get(
  '/my-requests',
  requestController.getMyRequests
);

router.get(
  '/statistics',
  checkAuth('ADMIN', 'HOSPITAL'),
  requestController.getStatistics
);

// Routes with ID parameter
router.get(
  '/:id',
  requestController.getRequestById
);

router.patch(
  '/:id',
  // auth(),
  validateRequest(updateRequestBloodSchema),
  requestController.updateRequest
);

router.delete(
  '/:id',
  // auth(),
  requestController.deleteRequest
);

router.get(
  '/:id/matching-donors',
  // auth(),
  requestController.findMatchingDonors
);

export const bloodRequestRoutes = router;