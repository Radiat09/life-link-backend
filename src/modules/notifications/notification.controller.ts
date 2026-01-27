import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { NotificationService } from './notification.service';
import httpStatus from 'http-status';

const getNotifications = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const options = { page: req.query.page, limit: req.query.limit };
  const result = await NotificationService.getUserNotifications(user.id, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notifications fetched',
    meta: result.meta,
    data: result.data
  });
});

const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const { id } = req.params;
  await NotificationService.markAsRead(id, user.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification marked as read',
    data: null
  });
});

const deleteNotification = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;
  const { id } = req.params;
  await NotificationService.deleteNotification(id, user.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification deleted',
    data: null
  });
});

export const NotificationController = {
  getNotifications,
  markAsRead,
  deleteNotification
};
