"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const notification_controller_1 = require("./notification.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
// All routes require authentication
router.get('/', (0, checkAuth_1.checkAuth)(client_1.UserRole.USER, client_1.UserRole.HOSPITAL, client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), notification_controller_1.NotificationController.getNotifications);
router.patch('/:id/read', (0, checkAuth_1.checkAuth)(client_1.UserRole.USER, client_1.UserRole.HOSPITAL, client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), notification_controller_1.NotificationController.markAsRead);
router.delete('/:id', (0, checkAuth_1.checkAuth)(client_1.UserRole.USER, client_1.UserRole.HOSPITAL, client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), notification_controller_1.NotificationController.deleteNotification);
exports.notificationRoutes = router;
//# sourceMappingURL=notification.routes.js.map