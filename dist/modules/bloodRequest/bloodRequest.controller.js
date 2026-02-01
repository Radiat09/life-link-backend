"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const bloodRequest_service_1 = require("./bloodRequest.service");
const AppError_1 = require("../../utils/AppError");
// Create a new blood request
const createRequest = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await bloodRequest_service_1.BloodRequestService.createRequest(user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Blood request created successfully',
        data: result
    });
});
// Get all blood requests
const getAllRequests = (0, catchAsync_1.default)(async (req, res) => {
    const result = await bloodRequest_service_1.BloodRequestService.getRequests(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Blood requests retrieved successfully',
        data: result.data,
        meta: result.meta
    });
});
// Get single blood request
const getRequestById = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await bloodRequest_service_1.BloodRequestService.getRequestById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Blood request retrieved successfully',
        data: result
    });
});
// Update blood request
const updateRequest = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const result = await bloodRequest_service_1.BloodRequestService.updateRequest(id, user.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Blood request updated successfully',
        data: result
    });
});
// Delete blood request
const deleteRequest = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const result = await bloodRequest_service_1.BloodRequestService.deleteRequest(id, user.id, user.role);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Blood request cancelled successfully',
        data: result
    });
});
// Get user's blood requests
const getMyRequests = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await bloodRequest_service_1.BloodRequestService.getUserRequests(user.id, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Your blood requests retrieved successfully',
        data: result.data,
        meta: result.meta
    });
});
// Get urgent blood requests
const getUrgentRequests = (0, catchAsync_1.default)(async (req, res) => {
    const result = await bloodRequest_service_1.BloodRequestService.getUrgentRequests(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Urgent blood requests retrieved successfully',
        data: result
    });
});
// Find matching donors for a request
const findMatchingDonors = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await bloodRequest_service_1.BloodRequestService.findMatchingDonors(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Matching donors found successfully',
        data: result
    });
});
// Get request statistics
const getStatistics = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    // Only admin and hospital roles can view statistics
    if (!['ADMIN', 'HOSPITAL', 'SUPER_ADMIN'].includes(user.role)) {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, 'You are not authorized to view statistics');
    }
    const result = await bloodRequest_service_1.BloodRequestService.getRequestStatistics();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Statistics retrieved successfully',
        data: result
    });
});
exports.requestController = {
    createRequest,
    getAllRequests,
    getRequestById,
    updateRequest,
    deleteRequest,
    getMyRequests,
    getUrgentRequests,
    findMatchingDonors,
    getStatistics
};
//# sourceMappingURL=bloodRequest.controller.js.map