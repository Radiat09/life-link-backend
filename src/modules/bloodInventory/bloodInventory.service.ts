import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";

interface IOptions {
  page?: string | number;
  limit?: string | number;
  sortBy?: string;
  sortOrder?: string;
}

interface PaginatedResponse {
  data: any[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const createBloodInventory = async (hospitalId: string | null, data: any): Promise<any> => {
  const existing = await prisma.bloodInventory.findUnique({
    where: {
      bloodGroup_hospitalId: {
        bloodGroup: data.bloodGroup,
        hospitalId: hospitalId || "SYSTEM"
      }
    }
  });

  if (existing) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Blood inventory for ${data.bloodGroup} already exists`
    );
  }

  return prisma.bloodInventory.create({
    data: {
      bloodGroup: data.bloodGroup,
      unitsAvailable: data.unitsAvailable,
      minThreshold: data.minThreshold,
      notes: data.notes || null,
      hospitalId: hospitalId || "SYSTEM"
    }
  });
};

const getBloodInventory = async (
  filters: any,
  options: IOptions
): Promise<PaginatedResponse> => {
  const pageNum = Number(options.page) || 1;
  const limitNum = Number(options.limit) || 10;
  const skip = (pageNum - 1) * limitNum;
  const sortBy = options.sortBy || 'bloodGroup';
  const sortOrder = options.sortOrder || 'asc';

  const where: any = {};

  if (filters.bloodGroup) {
    where.bloodGroup = filters.bloodGroup;
  }

  if (filters.hospitalId) {
    where.hospitalId = filters.hospitalId;
  }

  const [total, inventory] = await Promise.all([
    prisma.bloodInventory.count({ where }),
    prisma.bloodInventory.findMany({
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

const getBloodInventoryById = async (id: string): Promise<any> => {
  const inventory = await prisma.bloodInventory.findUnique({ where: { id } });

  if (!inventory) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blood inventory record not found');
  }

  return inventory;
};

const updateBloodInventory = async (id: string, data: any): Promise<any> => {
  const inventory = await prisma.bloodInventory.findUnique({ where: { id } });

  if (!inventory) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blood inventory record not found');
  }

  const updateData: any = { ...data, lastUpdated: new Date() };

  return prisma.bloodInventory.update({
    where: { id },
    data: updateData
  });
};

const adjustBloodUnits = async (
  id: string,
  quantity: number,
  type: 'add' | 'deduct'
): Promise<any> => {
  const inventory = await prisma.bloodInventory.findUnique({ where: { id } });

  if (!inventory) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blood inventory record not found');
  }

  let newUnits = inventory.unitsAvailable;

  if (type === 'add') {
    newUnits += quantity;
  } else if (type === 'deduct') {
    if (inventory.unitsAvailable < quantity) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Insufficient units. Available: ${inventory.unitsAvailable}, Requested: ${quantity}`
      );
    }
    newUnits -= quantity;
  }

  return prisma.bloodInventory.update({
    where: { id },
    data: {
      unitsAvailable: newUnits,
      lastUpdated: new Date()
    }
  });
};

const getLowStockInventory = async (): Promise<any[]> => {
  return prisma.bloodInventory.findMany({
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

const getInventoryStats = async (): Promise<any> => {
  const [totalTypes, totalUnits, lowStockCount] = await Promise.all([
    prisma.bloodInventory.count(),
    prisma.bloodInventory.aggregate({
      _sum: { unitsAvailable: true }
    }),
    prisma.bloodInventory.count({ where: { isLow: true } })
  ]);

  const byBloodGroup = await prisma.bloodInventory.groupBy({
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

export const BloodInventoryService = {
  createBloodInventory,
  getBloodInventory,
  getBloodInventoryById,
  updateBloodInventory,
  adjustBloodUnits,
  getLowStockInventory,
  getInventoryStats
};
