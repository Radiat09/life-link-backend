"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const admin_service_1 = require("./admin.service");
const analyticsService_1 = require("../../utils/analyticsService");
const pick_1 = __importDefault(require("../../helpers/pick"));
/**
 * Get all users
 */
const getAllUsers = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, ['role', 'status', 'searchTerm']);
    const options = (0, pick_1.default)(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = await admin_service_1.AdminService.getAllUsers(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Users retrieved successfully',
        meta: result.meta,
        data: result.data
    });
});
/**
 * Get dashboard statistics
 */
const getDashboardStats = (0, catchAsync_1.default)(async (_req, res) => {
    const result = await admin_service_1.AdminService.getDashboardStats();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Dashboard statistics retrieved successfully',
        data: result
    });
});
/**
 * Change user status
 */
const changeUserStatus = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await admin_service_1.AdminService.changeUserStatus(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User status changed successfully',
        data: result
    });
});
/**
 * Create a new admin
 */
const createAdmin = (0, catchAsync_1.default)(async (req, res) => {
    const result = await admin_service_1.AdminService.createAdmin(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Admin created successfully',
        data: result
    });
});
/**
 * Get user details
 */
const getUserDetails = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await admin_service_1.AdminService.getUserDetails(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User details retrieved successfully',
        data: result
    });
});
/**
 * Delete user account
 */
const deleteUserAccount = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await admin_service_1.AdminService.deleteUserAccount(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User account deleted successfully',
        data: result
    });
});
/**
 * Get activity reports
 */
const getActivityReports = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, ['startDate', 'endDate']);
    const options = (0, pick_1.default)(req.query, ['page', 'limit']);
    const result = await admin_service_1.AdminService.getActivityReports(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Activity reports retrieved successfully',
        meta: result.meta,
        data: result.data
    });
});
/**
 * Get donor demographics analytics
 */
const getDonorDemographics = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, ['bloodGroup', 'city']);
    const result = await analyticsService_1.AnalyticsService.getDonorDemographics(filters);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Donor demographics retrieved successfully',
        data: result
    });
});
/**
 * Get donation trends
 */
const getDonationTrends = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, ['period', 'bloodGroup']);
    const result = await analyticsService_1.AnalyticsService.getDonationTrends(filters);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Donation trends retrieved successfully',
        data: result
    });
});
/**
 * Get request analytics
 */
const getRequestAnalytics = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, ['period']);
    const result = await analyticsService_1.AnalyticsService.getRequestAnalytics(filters);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Request analytics retrieved successfully',
        data: result
    });
});
/**
 * Get dashboard metrics
 */
const getDashboardMetrics = (0, catchAsync_1.default)(async (_req, res) => {
    const result = await analyticsService_1.AnalyticsService.getDashboardMetrics();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Dashboard metrics retrieved successfully',
        data: result
    });
});
exports.AdminController = {
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
//# sourceMappingURL=admin.controller.js.map