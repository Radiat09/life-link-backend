"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const review_service_1 = require("./review.service");
const pick_1 = __importDefault(require("../../helpers/pick"));
/**
 * Create a new review
 */
const createReview = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await review_service_1.ReviewService.createReview(user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Review created successfully',
        data: result
    });
});
/**
 * Get all reviews
 */
const getAllReviews = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, ['donorId', 'rating', 'minRating']);
    const options = (0, pick_1.default)(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = await review_service_1.ReviewService.getReviews(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Reviews retrieved successfully',
        meta: result.meta,
        data: result.data
    });
});
/**
 * Get review by ID
 */
const getReviewById = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await review_service_1.ReviewService.getReviewById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Review retrieved successfully',
        data: result
    });
});
/**
 * Update a review
 */
const updateReview = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const result = await review_service_1.ReviewService.updateReview(id, user.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Review updated successfully',
        data: result
    });
});
/**
 * Delete a review
 */
const deleteReview = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    await review_service_1.ReviewService.deleteReview(id, user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Review deleted successfully',
        data: null
    });
});
/**
 * Get reviews for a specific donor
 */
const getDonorReviews = (0, catchAsync_1.default)(async (req, res) => {
    const { donorId } = req.params;
    const options = (0, pick_1.default)(req.query, ['page', 'limit']);
    const result = await review_service_1.ReviewService.getDonorReviews(donorId, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Donor reviews retrieved successfully',
        meta: result.meta,
        data: result.data
    });
});
/**
 * Get review statistics
 */
const getReviewStats = (0, catchAsync_1.default)(async (_req, res) => {
    const result = await review_service_1.ReviewService.getReviewStats();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Review statistics retrieved successfully',
        data: result
    });
});
exports.ReviewController = {
    createReview,
    getAllReviews,
    getReviewById,
    updateReview,
    deleteReview,
    getDonorReviews,
    getReviewStats
};
//# sourceMappingURL=review.controller.js.map