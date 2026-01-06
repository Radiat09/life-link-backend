import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BloodRequestService } from './bloodRequest.service';

// Create a new blood request
const createRequest = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const result = await BloodRequestService.createRequest(user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Blood request created successfully',
    data: result
  });
});

// Get all blood requests
const getAllRequests = catchAsync(async (req: Request, res: Response) => {
  const result = await BloodRequestService.getRequests(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blood requests retrieved successfully',
    data: result.data,
    meta: result.meta
  });
});

// Get single blood request
const getRequestById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BloodRequestService.getRequestById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blood request retrieved successfully',
    data: result
  });
});

// Update blood request
const updateRequest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  const result = await BloodRequestService.updateRequest(id, user.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blood request updated successfully',
    data: result
  });
});

// Delete blood request
const deleteRequest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  const result = await BloodRequestService.deleteRequest(id, user.id, user.role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blood request cancelled successfully',
    data: result
  });
});

// Get user's blood requests
const getMyRequests = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await BloodRequestService.getUserRequests(user.id, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Your blood requests retrieved successfully',
    data: result.data,
    meta: result.meta
  });
});

// Get urgent blood requests
const getUrgentRequests = catchAsync(async (req: Request, res: Response) => {
  const result = await BloodRequestService.getUrgentRequests(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Urgent blood requests retrieved successfully',
    data: result
  });
});

// Find matching donors for a request
const findMatchingDonors = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BloodRequestService.findMatchingDonors(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Matching donors found successfully',
    data: result
  });
});

// Get request statistics
const getStatistics = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  // Only admin and hospital roles can view statistics
  if (!['ADMIN', 'HOSPITAL', 'SUPER_ADMIN'].includes(user.role)) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to view statistics');
  }

  const result = await BloodRequestService.getRequestStatistics();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Statistics retrieved successfully',
    data: result
  });
});

export const requestController = {
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