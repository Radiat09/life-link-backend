import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DonationService } from './donation.service';
import pick from '../../helpers/pick';

/**
 * Create a new donation record
 */
const createDonation = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await DonationService.createDonation(user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Donation record created successfully',
    data: result
  });
});

/**
 * Get all donations (admin only)
 */
const getAllDonations = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['status', 'donorId', 'requestId', 'bloodGroup']);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

  const result = await DonationService.getDonations(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Donations retrieved successfully',
    meta: result.meta,
    data: result.data
  });
});

/**
 * Get donation by ID
 */
const getDonationById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DonationService.getDonationById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Donation record retrieved successfully',
    data: result
  });
});

/**
 * Update donation record
 */
const updateDonation = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  const result = await DonationService.updateDonation(id, user.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Donation record updated successfully',
    data: result
  });
});

/**
 * Get user's donations
 */
const getMyDonations = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const filters = pick(req.query, ['status', 'requestId']);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

  const result = await DonationService.getUserDonations(user.id, filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Your donations retrieved successfully',
    meta: result.meta,
    data: result.data
  });
});

/**
 * Get donation statistics
 */
const getDonationStats = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['period', 'bloodGroup']);
  const result = await DonationService.getDonationStats(filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Donation statistics retrieved successfully',
    data: result
  });
});

/**
 * Cancel a donation
 */
const cancelDonation = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  const result = await DonationService.cancelDonation(id, user.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Donation cancelled successfully',
    data: result
  });
});

export const DonationController = {
  createDonation,
  getAllDonations,
  getDonationById,
  updateDonation,
  getMyDonations,
  getDonationStats,
  cancelDonation
};
