"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloodInventoryController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const bloodInventory_service_1 = require("./bloodInventory.service");
const http_status_1 = __importDefault(require("http-status"));
const pick_1 = __importDefault(require("../../helpers/pick"));
const createBloodInventory = (0, catchAsync_1.default)(async (req, res) => {
    const result = await bloodInventory_service_1.BloodInventoryService.createBloodInventory(null, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Blood inventory created successfully',
        data: result
    });
});
const getBloodInventory = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, ['bloodGroup', 'hospitalId']);
    const options = (0, pick_1.default)(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = await bloodInventory_service_1.BloodInventoryService.getBloodInventory(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Blood inventory retrieved',
        meta: result.meta,
        data: result.data
    });
});
const getBloodInventoryById = (0, catchAsync_1.default)(async (req, res) => {
    const result = await bloodInventory_service_1.BloodInventoryService.getBloodInventoryById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Blood inventory retrieved',
        data: result
    });
});
const updateBloodInventory = (0, catchAsync_1.default)(async (req, res) => {
    const result = await bloodInventory_service_1.BloodInventoryService.updateBloodInventory(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Blood inventory updated',
        data: result
    });
});
const adjustBloodUnits = (0, catchAsync_1.default)(async (req, res) => {
    const { quantity, type } = req.body;
    const result = await bloodInventory_service_1.BloodInventoryService.adjustBloodUnits(req.params.id, quantity, type);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Blood units ${type === 'add' ? 'added' : 'deducted'} successfully`,
        data: result
    });
});
const getLowStockInventory = (0, catchAsync_1.default)(async (_req, res) => {
    const result = await bloodInventory_service_1.BloodInventoryService.getLowStockInventory();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Low stock inventory retrieved',
        data: result
    });
});
const getInventoryStats = (0, catchAsync_1.default)(async (_req, res) => {
    const result = await bloodInventory_service_1.BloodInventoryService.getInventoryStats();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Inventory statistics retrieved',
        data: result
    });
});
exports.BloodInventoryController = {
    createBloodInventory,
    getBloodInventory,
    getBloodInventoryById,
    updateBloodInventory,
    adjustBloodUnits,
    getLowStockInventory,
    getInventoryStats
};
//# sourceMappingURL=bloodInventory.controller.js.map