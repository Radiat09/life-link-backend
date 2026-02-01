"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloodInventoryService = void 0;
const prisma_1 = require("../../config/prisma");
const AppError_1 = require("../../utils/AppError");
const http_status_1 = __importDefault(require("http-status"));
const createBloodInventory = async (hospitalId, data) => {
    const existing = await prisma_1.prisma.bloodInventory.findUnique({
        where: {
            bloodGroup_hospitalId: {
                bloodGroup: data.bloodGroup,
                hospitalId: hospitalId || "SYSTEM"
            }
        }
    });
    if (existing) {
        throw new AppError_1.AppError(http_status_1.default.CONFLICT, `Blood inventory for ${data.bloodGroup} already exists`);
    }
    return prisma_1.prisma.bloodInventory.create({
        data: {
            bloodGroup: data.bloodGroup,
            unitsAvailable: data.unitsAvailable,
            minThreshold: data.minThreshold,
            notes: data.notes || null,
            hospitalId: hospitalId || "SYSTEM"
        }
    });
};
const getBloodInventory = async (filters, options) => {
    const pageNum = Number(options.page) || 1;
    const limitNum = Number(options.limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    const sortBy = options.sortBy || 'bloodGroup';
    const sortOrder = options.sortOrder || 'asc';
    const where = {};
    if (filters.bloodGroup) {
        where.bloodGroup = filters.bloodGroup;
    }
    if (filters.hospitalId) {
        where.hospitalId = filters.hospitalId;
    }
    const [total, inventory] = await Promise.all([
        prisma_1.prisma.bloodInventory.count({ where }),
        prisma_1.prisma.bloodInventory.findMany({
            where,
            select: {
                id: true,
                bloodGroup: true,
                unitsAvailable: true,
                minThreshold: true,
                isLow: true,
                notes: true,
                lastUpdated: true,
                hospitalId: true
            },
            orderBy: {
                [sortBy]: sortOrder
            },
            skip,
            take: limitNum
        })
    ]);
    return {
        data: inventory,
        meta: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
            hasNext: pageNum * limitNum < total,
            hasPrev: pageNum > 1
        }
    };
};
const getBloodInventoryById = async (id) => {
    const inventory = await prisma_1.prisma.bloodInventory.findUnique({ where: { id } });
    if (!inventory) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Blood inventory record not found');
    }
    return inventory;
};
const updateBloodInventory = async (id, data) => {
    const inventory = await prisma_1.prisma.bloodInventory.findUnique({ where: { id } });
    if (!inventory) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Blood inventory record not found');
    }
    const updateData = { ...data, lastUpdated: new Date() };
    return prisma_1.prisma.bloodInventory.update({
        where: { id },
        data: updateData
    });
};
const adjustBloodUnits = async (id, quantity, type) => {
    const inventory = await prisma_1.prisma.bloodInventory.findUnique({ where: { id } });
    if (!inventory) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Blood inventory record not found');
    }
    let newUnits = inventory.unitsAvailable;
    if (type === 'add') {
        newUnits += quantity;
    }
    else if (type === 'deduct') {
        if (inventory.unitsAvailable < quantity) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `Insufficient units. Available: ${inventory.unitsAvailable}, Requested: ${quantity}`);
        }
        newUnits -= quantity;
    }
    return prisma_1.prisma.bloodInventory.update({
        where: { id },
        data: {
            unitsAvailable: newUnits,
            lastUpdated: new Date()
        }
    });
};
const getLowStockInventory = async () => {
    return prisma_1.prisma.bloodInventory.findMany({
        where: {
            isLow: true
        },
        select: {
            id: true,
            bloodGroup: true,
            unitsAvailable: true,
            minThreshold: true,
            hospitalId: true,
            notes: true
        }
    });
};
const getInventoryStats = async () => {
    const [totalTypes, totalUnits, lowStockCount] = await Promise.all([
        prisma_1.prisma.bloodInventory.count(),
        prisma_1.prisma.bloodInventory.aggregate({
            _sum: { unitsAvailable: true }
        }),
        prisma_1.prisma.bloodInventory.count({ where: { isLow: true } })
    ]);
    const byBloodGroup = await prisma_1.prisma.bloodInventory.groupBy({
        by: ['bloodGroup'],
        _sum: { unitsAvailable: true },
        orderBy: { bloodGroup: 'asc' }
    });
    return {
        totalBloodTypes: totalTypes,
        totalUnitsAvailable: totalUnits._sum.unitsAvailable || 0,
        lowStockCount,
        byBloodGroup: byBloodGroup.map(item => ({
            bloodGroup: item.bloodGroup,
            totalUnits: item._sum.unitsAvailable || 0
        }))
    };
};
exports.BloodInventoryService = {
    createBloodInventory,
    getBloodInventory,
    getBloodInventoryById,
    updateBloodInventory,
    adjustBloodUnits,
    getLowStockInventory,
    getInventoryStats
};
//# sourceMappingURL=bloodInventory.service.js.map