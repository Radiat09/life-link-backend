"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const notification_service_1 = require("./notification.service");
const http_status_1 = __importDefault(require("http-status"));
const getNotifications = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const options = { page: req.query.page, limit: req.query.limit };
    const result = await notification_service_1.NotificationService.getUserNotifications(user.id, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Notifications fetched',
        meta: result.meta,
        data: result.data
    });
});
const markAsRead = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    await notification_service_1.NotificationService.markAsRead(id, user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Notification marked as read',
        data: null
    });
});
const deleteNotification = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    await notification_service_1.NotificationService.deleteNotification(id, user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Notification deleted',
        data: null
    });
});
exports.NotificationController = {
    getNotifications,
    markAsRead,
    deleteNotification
};
//# sourceMappingURL=notification.controller.js.map