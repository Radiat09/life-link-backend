"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bloodInventoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const bloodInventory_controller_1 = require("./bloodInventory.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const bloodInventory_validation_1 = require("./bloodInventory.validation");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
// Public routes
router.get('/stats', bloodInventory_controller_1.BloodInventoryController.getInventoryStats);
router.get('/low-stock', bloodInventory_controller_1.BloodInventoryController.getLowStockInventory);
router.get('/', bloodInventory_controller_1.BloodInventoryController.getBloodInventory);
router.get('/:id', bloodInventory_controller_1.BloodInventoryController.getBloodInventoryById);
// Protected routes (admin/super-admin only)
router.post('/', (0, checkAuth_1.checkAuth)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.validateRequest)(bloodInventory_validation_1.createBloodInventoryZodSchema), bloodInventory_controller_1.BloodInventoryController.createBloodInventory);
router.patch('/:id', (0, checkAuth_1.checkAuth)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.validateRequest)(bloodInventory_validation_1.updateBloodInventoryZodSchema), bloodInventory_controller_1.BloodInventoryController.updateBloodInventory);
router.patch('/:id/adjust', (0, checkAuth_1.checkAuth)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.validateRequest)(bloodInventory_validation_1.adjustBloodUnitsZodSchema), bloodInventory_controller_1.BloodInventoryController.adjustBloodUnits);
exports.bloodInventoryRoutes = router;
//# sourceMappingURL=bloodInventory.routes.js.map