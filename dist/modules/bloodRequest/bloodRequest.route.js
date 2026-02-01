"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bloodRequestRoutes = void 0;
const express_1 = __importDefault(require("express"));
const bloodRequest_controller_1 = require("./bloodRequest.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const checkAuth_1 = require("../../middlewares/checkAuth");
const bloodRequest_validation_1 = require("./bloodRequest.validation");
const router = express_1.default.Router();
// Public routes (accessible without authentication)
router.get('/urgent', bloodRequest_controller_1.requestController.getUrgentRequests);
router.get('/', bloodRequest_controller_1.requestController.getAllRequests);
// Protected routes (require authentication)
router.post('/', (0, checkAuth_1.checkAuth)('USER', 'HOSPITAL', 'ADMIN', 'SUPER_ADMIN'), (0, validateRequest_1.validateRequest)(bloodRequest_validation_1.createRequestBloodSchema), bloodRequest_controller_1.requestController.createRequest);
router.get('/my-requests', bloodRequest_controller_1.requestController.getMyRequests);
router.get('/statistics', (0, checkAuth_1.checkAuth)('ADMIN', 'HOSPITAL'), bloodRequest_controller_1.requestController.getStatistics);
// Routes with ID parameter
router.get('/:id', bloodRequest_controller_1.requestController.getRequestById);
router.patch('/:id', 
// auth(),
(0, validateRequest_1.validateRequest)(bloodRequest_validation_1.updateRequestBloodSchema), bloodRequest_controller_1.requestController.updateRequest);
router.delete('/:id', 
// auth(),
bloodRequest_controller_1.requestController.deleteRequest);
router.get('/:id/matching-donors', 
// auth(),
bloodRequest_controller_1.requestController.findMatchingDonors);
exports.bloodRequestRoutes = router;
//# sourceMappingURL=bloodRequest.route.js.map