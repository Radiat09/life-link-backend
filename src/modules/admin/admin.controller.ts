import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminService } from './admin.service';
import { AnalyticsService } from '../../utils/analyticsService';
import pick from '../../helpers/pick';

/**
 * Get all users
 */
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['role', 'status', 'searchTerm']);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

  const result = await AdminService.getAllUsers(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully',
    meta: result.meta,
    data: result.data
  });
});

/**
 * Get dashboard statistics
 */
const getDashboardStats = catchAsync(async (_req: Request, res: Response) => {
  const result = await AdminService.getDashboardStats();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dashboard statistics retrieved successfully',
    data: result
  });
});

/**
 * Change user status
 */
const changeUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdminService.changeUserStatus(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User status changed successfully',
    data: result
  });
});

/**
 * Create a new admin
 */
const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.createAdmin(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Admin created successfully',
    data: result
  });
});

/**
 * Get user details
 */
const getUserDetails = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdminService.getUserDetails(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User details retrieved successfully',
    data: result
  });
});

/**
 * Delete user account
 */
const deleteUserAccount = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdminService.deleteUserAccount(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User account deleted successfully',
    data: result
  });
});

/**
 * Get activity reports
 */
const getActivityReports = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['startDate', 'endDate']);
  const options = pick(req.query, ['page', 'limit']);

  const result = await AdminService.getActivityReports(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Activity reports retrieved successfully',
    meta: result.meta,
    data: result.data
  });
});

/**
 * Get donor demographics analytics
 */
const getDonorDemographics = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['bloodGroup', 'city']);
  const result = await AnalyticsService.getDonorDemographics(filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Donor demographics retrieved successfully',
    data: result
  });
});

/**
 * Get donation trends
 */
const getDonationTrends = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['period', 'bloodGroup']);
  const result = await AnalyticsService.getDonationTrends(filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Donation trends retrieved successfully',
    data: result
  });
});

/**
 * Get request analytics
 */
const getRequestAnalytics = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['period']);
  const result = await AnalyticsService.getRequestAnalytics(filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Request analytics retrieved successfully',
    data: result
  });
});

/**
 * Get dashboard metrics
 */
const getDashboardMetrics = catchAsync(async (_req: Request, res: Response) => {
  const result = await AnalyticsService.getDashboardMetrics();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dashboard metrics retrieved successfully',
    data: result
  });
});

export const AdminController = {
  getAllUsers,
  getDashboardStats,
  changeUserStatus,
  createAdmin,
  getUserDetails,
  deleteUserAccount,
  getActivityReports,
  getDonorDemographics,
  getDonationTrends,
  getRequestAnalytics,
  getDashboardMetrics
};
