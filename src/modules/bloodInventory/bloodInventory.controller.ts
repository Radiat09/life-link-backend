import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BloodInventoryService } from './bloodInventory.service';
import httpStatus from 'http-status';
import pick from '../../helpers/pick';

const createBloodInventory = catchAsync(async (req: Request, res: Response) => {
  const result = await BloodInventoryService.createBloodInventory(null, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Blood inventory created successfully',
    data: result
  });
});

const getBloodInventory = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['bloodGroup', 'hospitalId']);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

  const result = await BloodInventoryService.getBloodInventory(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blood inventory retrieved',
    meta: result.meta,
    data: result.data
  });
});

const getBloodInventoryById = catchAsync(async (req: Request, res: Response) => {
  const result = await BloodInventoryService.getBloodInventoryById(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blood inventory retrieved',
    data: result
  });
});

const updateBloodInventory = catchAsync(async (req: Request, res: Response) => {
  const result = await BloodInventoryService.updateBloodInventory(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blood inventory updated',
    data: result
  });
});

const adjustBloodUnits = catchAsync(async (req: Request, res: Response) => {
  const { quantity, type } = req.body;
  const result = await BloodInventoryService.adjustBloodUnits(
    req.params.id,
    quantity,
    type
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Blood units ${type === 'add' ? 'added' : 'deducted'} successfully`,
    data: result
  });
});

const getLowStockInventory = catchAsync(async (_req: Request, res: Response) => {
  const result = await BloodInventoryService.getLowStockInventory();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Low stock inventory retrieved',
    data: result
  });
});

const getInventoryStats = catchAsync(async (_req: Request, res: Response) => {
  const result = await BloodInventoryService.getInventoryStats();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Inventory statistics retrieved',
    data: result
  });
});

export const BloodInventoryController = {
  createBloodInventory,
  getBloodInventory,
  getBloodInventoryById,
  updateBloodInventory,
  adjustBloodUnits,
  getLowStockInventory,
  getInventoryStats
};
