"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonationController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const donation_service_1 = require("./donation.service");
const pick_1 = __importDefault(require("../../helpers/pick"));
/**
 * Create a new donation record
 */
const createDonation = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await donation_service_1.DonationService.createDonation(user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Donation record created successfully',
        data: result
    });
});
/**
 * Get all donations (admin only)
 */
const getAllDonations = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, ['status', 'donorId', 'requestId', 'bloodGroup']);
    const options = (0, pick_1.default)(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = await donation_service_1.DonationService.getDonations(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Donations retrieved successfully',
        meta: result.meta,
        data: result.data
    });
});
/**
 * Get donation by ID
 */
const getDonationById = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await donation_service_1.DonationService.getDonationById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Donation record retrieved successfully',
        data: result
    });
});
/**
 * Update donation record
 */
const updateDonation = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const result = await donation_service_1.DonationService.updateDonation(id, user.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Donation record updated successfully',
        data: result
    });
});
/**
 * Get user's donations
 */
const getMyDonations = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const filters = (0, pick_1.default)(req.query, ['status', 'requestId']);
    const options = (0, pick_1.default)(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = await donation_service_1.DonationService.getUserDonations(user.id, filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Your donations retrieved successfully',
        meta: result.meta,
        data: result.data
    });
});
/**
 * Get donation statistics
 */
const getDonationStats = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, ['period', 'bloodGroup']);
    const result = await donation_service_1.DonationService.getDonationStats(filters);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Donation statistics retrieved successfully',
        data: result
    });
});
/**
 * Cancel a donation
 */
const cancelDonation = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const result = await donation_service_1.DonationService.cancelDonation(id, user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Donation cancelled successfully',
        data: result
    });
});
exports.DonationController = {
    createDonation,
    getAllDonations,
    getDonationById,
    updateDonation,
    getMyDonations,
    getDonationStats,
    cancelDonation
};
//# sourceMappingURL=donation.controller.js.map