import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";
import { UserStatus, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

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

/**
 * Get all users (for admin dashboard)
 */
const getAllUsers = async (
  filters: any,
  options: IOptions
): Promise<PaginatedResponse> => {
  const pageNum = Number(options.page) || 1;
  const limitNum = Number(options.limit) || 10;
  const skip = (pageNum - 1) * limitNum;
  const sortBy = options.sortBy || 'createdAt';
  const sortOrder = options.sortOrder || 'desc';

  const where: any = {};

  if (filters.role) {
    where.role = filters.role;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.searchTerm) {
    where.OR = [
      { email: { contains: filters.searchTerm, mode: 'insensitive' } },
      {
        profile: {
          firstName: { contains: filters.searchTerm, mode: 'insensitive' }
        }
      },
      {
        profile: {
          lastName: { contains: filters.searchTerm, mode: 'insensitive' }
        }
      }
    ];
  }

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
            bloodGroup: true,
            city: true,
            avatar: true
          }
        },
        _count: {
          select: {
            bloodRequests: true,
            donations: true
          }
        }
      },
      orderBy: {
        [sortBy]: sortOrder
      },
      skip,
      take: limitNum
    })
  ]);

  const totalPages = Math.ceil(total / limitNum);

  return {
    data: users,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
      hasNext: pageNum < totalPages,
      hasPrev: pageNum > 1
    }
  };
};

/**
 * Get dashboard statistics
 */
const getDashboardStats = async (): Promise<any> => {
  const [
    totalUsers,
    totalDonors,
    totalRecipients,
    totalHospitals,
    totalAdmins,
    totalDonations,
    completedDonations,
    totalBloodRequests,
    pendingRequests,
    fulfilledRequests,
    totalReviews,
    averageRating,
    activeRequests
  ] = await Promise.all([
    // Total users
    prisma.user.count(),

    // Total donors
    prisma.user.count({ where: { role: UserRole.DONOR } }),

    // Total recipients
    prisma.user.count({ where: { role: UserRole.RECIPIENT } }),

    // Total hospitals
    prisma.user.count({ where: { role: UserRole.HOSPITAL } }),

    // Total admins
    prisma.user.count({ where: { role: { in: [UserRole.ADMIN, UserRole.SUPER_ADMIN] } } }),

    // Total donations
    prisma.donation.count(),

    // Completed donations
    prisma.donation.count({ where: { status: 'COMPLETED' } }),

    // Total blood requests
    prisma.bloodRequest.count(),

    // Pending requests
    prisma.bloodRequest.count({ where: { status: 'PENDING' } }),

    // Fulfilled requests
    prisma.bloodRequest.count({ where: { status: 'FULFILLED' } }),

    // Total reviews
    prisma.review.count(),

    // Average rating
    prisma.review.aggregate({
      _avg: { rating: true }
    }),

    // Active requests
    prisma.bloodRequest.count({
      where: {
        status: {
          in: ['PENDING', 'ACTIVE', 'PARTIALLY_FULFILLED']
        }
      }
    })
  ]);

  // Get user status breakdown
  const userStatusBreakdown = await prisma.user.groupBy({
    by: ['status'],
    _count: {
      id: true
    }
  });

  // Get blood group distribution
  const bloodGroupDistribution = await prisma.profile.groupBy({
    by: ['bloodGroup'],
    _count: {
      id: true
    },
    orderBy: {
      _count: {
        id: 'desc'
      }
    }
  });

  // Get top cities
  const topCities = await prisma.profile.groupBy({
    by: ['city'],
    _count: {
      id: true
    },
    orderBy: {
      _count: {
        id: 'desc'
      }
    },
    take: 10
  });

  return {
    users: {
      total: totalUsers,
      byRole: {
        donors: totalDonors,
        recipients: totalRecipients,
        hospitals: totalHospitals,
        admins: totalAdmins
      },
      byStatus: userStatusBreakdown.reduce((acc: any, item) => {
        acc[item.status.toLowerCase()] = item._count.id;
        return acc;
      }, {})
    },
    donations: {
      total: totalDonations,
      completed: completedDonations,
      pending: totalDonations - completedDonations
    },
    bloodRequests: {
      total: totalBloodRequests,
      pending: pendingRequests,
      fulfilled: fulfilledRequests,
      active: activeRequests
    },
    reviews: {
      total: totalReviews,
      averageRating: averageRating._avg.rating || 0
    },
    bloodGroups: bloodGroupDistribution,
    topCities: topCities
  };
};

/**
 * Change user status
 */
const changeUserStatus = async (
  userId: string,
  data: { status: UserStatus; reason?: string }
): Promise<any> => {
  // Verify user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true }
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Cannot change super admin status
  if (user.role === UserRole.SUPER_ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN, 'Cannot change Super Admin status');
  }

  // Update user status
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status: data.status },
    include: {
      profile: true
    }
  });

  // Create notification for user about status change
  if (data.reason) {
    await prisma.notification.create({
      data: {
        userId: userId,
        type: 'ACCOUNT_STATUS_CHANGED',
        title: 'Account Status Changed',
        message: `Your account status has been changed to ${data.status}. ${data.reason || ''}`
      }
    });
  }

  return updatedUser;
};

/**
 * Create a new admin
 */
const createAdmin = async (data: any): Promise<any> => {
  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email }
  });

  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, 'User with this email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      role: data.role || UserRole.ADMIN,
      isVerified: true,
      profile: {
        create: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          bloodGroup: 'O_POSITIVE', // Default blood group for admin
          city: 'Dhaka', // Default city
          division: 'Dhaka', // Default division
          dateOfBirth: new Date('1990-01-01'),
        }
      }
    },
    include: {
      profile: true
    }
  });

  return {
    id: adminUser.id,
    email: adminUser.email,
    role: adminUser.role,
    profile: adminUser.profile
  };
};

/**
 * Get user details
 */
const getUserDetails = async (userId: string): Promise<any> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      bloodRequests: {
        take: 5,
        orderBy: { createdAt: 'desc' }
      },
      donations: {
        take: 5,
        orderBy: { donationDate: 'desc' }
      },
      _count: {
        select: {
          bloodRequests: true,
          donations: true,
          notifications: true
        }
      }
    }
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

/**
 * Delete a user account (soft delete)
 */
const deleteUserAccount = async (userId: string): Promise<any> => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const deletedUser = await prisma.user.update({
    where: { id: userId },
    data: { status: UserStatus.DELETED }
  });

  // Notify user
  await prisma.notification.create({
    data: {
      userId: userId,
      type: 'ACCOUNT_DELETED',
      title: 'Account Deleted',
      message: 'Your account has been deleted. Contact support if you need assistance.'
    }
  });

  return {
    id: deletedUser.id,
    email: deletedUser.email,
    status: deletedUser.status
  };
};

/**
 * Get activity logs/reports
 */
const getActivityReports = async (
  filters: any,
  options: IOptions
): Promise<PaginatedResponse> => {
  const pageNum = Number(options.page) || 1;
  const limitNum = Number(options.limit) || 20;
  const skip = (pageNum - 1) * limitNum;

  const where: any = {};

  if (filters.startDate && filters.endDate) {
    where.createdAt = {
      gte: new Date(filters.startDate),
      lte: new Date(filters.endDate)
    };
  }

  // Get donations (as activity)
  const [total, donations] = await Promise.all([
    prisma.donation.count({ where }),
    prisma.donation.findMany({
      where,
      include: {
        donor: {
          select: {
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum
    })
  ]);

  const totalPages = Math.ceil(total / limitNum);

  return {
    data: donations.map(d => ({
      type: 'DONATION',
      action: `Donation of ${d.unitsDonated} units`,
      user: `${d.donor?.profile?.firstName} ${d.donor?.profile?.lastName}`,
      status: d.status,
      date: d.donationDate
    })),
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
      hasNext: pageNum < totalPages,
      hasPrev: pageNum > 1
    }
  };
};

export const AdminService = {
  getAllUsers,
  getDashboardStats,
  changeUserStatus,
  createAdmin,
  getUserDetails,
  deleteUserAccount,
  getActivityReports
};
