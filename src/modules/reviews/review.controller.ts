import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReviewService } from './review.service';
import pick from '../../helpers/pick';

/**
 * Create a new review
 */
const createReview = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await ReviewService.createReview(user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Review created successfully',
    data: result
  });
});

/**
 * Get all reviews
 */
const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['donorId', 'rating', 'minRating']);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

  const result = await ReviewService.getReviews(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reviews retrieved successfully',
    meta: result.meta,
    data: result.data
  });
});

/**
 * Get review by ID
 */
const getReviewById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ReviewService.getReviewById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review retrieved successfully',
    data: result
  });
});

/**
 * Update a review
 */
const updateReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  const result = await ReviewService.updateReview(id, user.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review updated successfully',
    data: result
  });
});

/**
 * Delete a review
 */
const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  await ReviewService.deleteReview(id, user.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review deleted successfully',
    data: null
  });
});

/**
 * Get reviews for a specific donor
 */
const getDonorReviews = catchAsync(async (req: Request, res: Response) => {
  const { donorId } = req.params;
  const options = pick(req.query, ['page', 'limit']);

  const result = await ReviewService.getDonorReviews(donorId, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Donor reviews retrieved successfully',
    meta: result.meta,
    data: result.data
  });
});

/**
 * Get review statistics
 */
const getReviewStats = catchAsync(async (_req: Request, res: Response) => {
  const result = await ReviewService.getReviewStats();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review statistics retrieved successfully',
    data: result
  });
});

export const ReviewController = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getDonorReviews,
  getReviewStats
};
