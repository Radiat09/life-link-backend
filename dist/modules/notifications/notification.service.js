"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const prisma_1 = require("../../config/prisma");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../../utils/AppError");
// Helper function to create match notification
const createMatchNotification = async (donorId, request) => {
    await prisma_1.prisma.notification.create({
        data: {
            userId: donorId,
            type: 'MATCH_FOUND',
            title: 'Blood Request Match Found!',
            message: `A patient in ${request.city} needs ${request.bloodGroup} blood. Your blood type matches!`,
            link: `/requests/${request.id}`
        }
    });
};
const getUserNotifications = async (userId, options = {}) => {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 20;
    const skip = (page - 1) * limit;
    const [total, notifications] = await Promise.all([
        prisma_1.prisma.notification.count({ where: { userId } }),
        prisma_1.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        })
    ]);
    return {
        data: notifications,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1
        }
    };
};
const markAsRead = async (notificationId, userId) => {
    const notification = await prisma_1.prisma.notification.findUnique({ where: { id: notificationId } });
    if (!notification)
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Notification not found');
    if (notification.userId !== userId)
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, 'Not authorized');
    return prisma_1.prisma.notification.update({ where: { id: notificationId }, data: { isRead: true } });
};
const deleteNotification = async (notificationId, userId) => {
    const notification = await prisma_1.prisma.notification.findUnique({ where: { id: notificationId } });
    if (!notification)
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Notification not found');
    if (notification.userId !== userId)
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, 'Not authorized');
    return prisma_1.prisma.notification.delete({ where: { id: notificationId } });
};
exports.NotificationService = {
    createMatchNotification,
    getUserNotifications,
    markAsRead,
    deleteNotification
};
//# sourceMappingURL=notification.service.js.map