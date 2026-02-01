"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("./admin.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const admin_validation_1 = require("./admin.validation");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
// All routes require admin authentication
router.use((0, checkAuth_1.checkAuth)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN));
// Dashboard and statistics
router.get('/dashboard/statistics', admin_controller_1.AdminController.getDashboardStats);
router.get('/dashboard/metrics', admin_controller_1.AdminController.getDashboardMetrics);
// Analytics
router.get('/analytics/donor-demographics', admin_controller_1.AdminController.getDonorDemographics);
router.get('/analytics/donation-trends', admin_controller_1.AdminController.getDonationTrends);
router.get('/analytics/request-analytics', admin_controller_1.AdminController.getRequestAnalytics);
// User management
router.get('/users', admin_controller_1.AdminController.getAllUsers);
router.get('/users/:id', admin_controller_1.AdminController.getUserDetails);
router.post('/users/admin/create', (0, checkAuth_1.checkAuth)(client_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.validateRequest)(admin_validation_1.changeUserStatusZodSchema), admin_controller_1.AdminController.changeUserStatus);
router.patch('/users/:id/status', (0, validateRequest_1.validateRequest)(admin_validation_1.changeUserStatusZodSchema), admin_controller_1.AdminController.changeUserStatus);
// Reports and activity
router.get('/reports/activity', admin_controller_1.AdminController.getActivityReports);
exports.adminRoutes = router;
//# sourceMappingURL=admin.routes.js.map