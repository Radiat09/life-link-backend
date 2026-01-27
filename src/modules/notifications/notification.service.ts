import { prisma } from "../../config/prisma";
import httpStatus from "http-status";
import { AppError } from "../../utils/AppError";

// Helper function to create match notification
const createMatchNotification = async (donorId: string, request: any): Promise<void> => {
  await prisma.notification.create({
    data: {
      userId: donorId,
      type: 'MATCH_FOUND',
      title: 'Blood Request Match Found!',
      message: `A patient in ${request.city} needs ${request.bloodGroup} blood. Your blood type matches!`,
      link: `/requests/${request.id}`
    }
  });
};

const getUserNotifications = async (userId: string, options: any = {}) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 20;
  const skip = (page - 1) * limit;

  const [total, notifications] = await Promise.all([
    prisma.notification.count({ where: { userId } }),
    prisma.notification.findMany({
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

const markAsRead = async (notificationId: string, userId: string) => {
  const notification = await prisma.notification.findUnique({ where: { id: notificationId } });
  if (!notification) throw new AppError(httpStatus.NOT_FOUND, 'Notification not found');
  if (notification.userId !== userId) throw new AppError(httpStatus.FORBIDDEN, 'Not authorized');

  return prisma.notification.update({ where: { id: notificationId }, data: { isRead: true } });
};

const deleteNotification = async (notificationId: string, userId: string) => {
  const notification = await prisma.notification.findUnique({ where: { id: notificationId } });
  if (!notification) throw new AppError(httpStatus.NOT_FOUND, 'Notification not found');
  if (notification.userId !== userId) throw new AppError(httpStatus.FORBIDDEN, 'Not authorized');

  return prisma.notification.delete({ where: { id: notificationId } });
};

export const NotificationService = {
  createMatchNotification,
  getUserNotifications,
  markAsRead,
  deleteNotification
};
