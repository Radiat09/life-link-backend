import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";
import { calculateAge } from "../../utils/calculateAge";
import { JwtPayload } from "jsonwebtoken";
import { UserStatus, RequestStatus } from "@prisma/client";
import { BloodRequestService } from "../bloodRequest/bloodRequest.service";

interface IOptions {
  page?: string | number;
  limit?: string | number;
  sortBy?: string;
  sortOrder?: string;
}

interface DonationResponse {
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

// Helper to format donation response
const formatDonationResponse = (donation: any) => {
  return {
    id: donation.id,
    donorId: donation.donorId,
    requestId: donation.requestId,
    donationDate: donation.donationDate,
    status: donation.status,
    unitsDonated: donation.unitsDonated,
    hemoglobinLevel: donation.hemoglobinLevel,
    bloodPressure: donation.bloodPressure,
    notes: donation.notes,
    createdAt: donation.createdAt,
    updatedAt: donation.updatedAt,
    donor: donation.donor,
    bloodRequest: donation.bloodRequest,
    review: donation.review,
  };
};

/**
 * Create a new donation record
 */
const createDonation = async (
  user: JwtPayload,
  data: any
): Promise<any> => {
  // Verify user exists and is a donor
  const userExists = await prisma.user.findUnique({
    where: { email: user.email },
    include: { profile: true }
  });

  if (!userExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (userExists.status === UserStatus.SUSPENDED) {
    throw new AppError(httpStatus.FORBIDDEN, 'Your account is suspended');
  }

  // Validate donor eligibility
  const profile = userExists.profile;
  if (!profile) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Please complete your profile first');
  }

  // Check age (donors should be 18-65)
  const age = calculateAge(profile.dateOfBirth);
  if (age < 18 || age > 65) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Donors must be between 18 and 65 years old');
  }

  // Check last donation (must be at least 56 days apart)
  const lastDonation = profile.lastDonation;
  if (lastDonation) {
    const daysSinceLast = Math.floor(
      (Date.now() - new Date(lastDonation).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceLast < 56) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `You can only donate after 56 days. You can donate again on ${new Date(new Date(lastDonation).getTime() + 56 * 24 * 60 * 60 * 1000).toLocaleDateString()}`
      );
    }
  }

  // If requestId provided, verify it exists and is valid
  if (data.requestId) {
    const bloodRequest = await prisma.bloodRequest.findUnique({
      where: { id: data.requestId }
    });

    if (!bloodRequest) {
      throw new AppError(httpStatus.NOT_FOUND, 'Blood request not found');
    }

    if (bloodRequest.status === RequestStatus.FULFILLED) {
      throw new AppError(httpStatus.BAD_REQUEST, 'This blood request is already fulfilled');
    }

    if (bloodRequest.status === RequestStatus.CANCELLED) {
      throw new AppError(httpStatus.BAD_REQUEST, 'This blood request has been cancelled');
    }
  }

  // Create donation record
  const donation = await prisma.donation.create({
    data: {
      donorId: userExists.id,
      requestId: data.requestId || null,
      donationDate: new Date(data.donationDate),
      status: data.status || 'SCHEDULED',
      unitsDonated: data.unitsDonated || 1.0,
      hemoglobinLevel: data.hemoglobinLevel || null,
      bloodPressure: data.bloodPressure || null,
      notes: data.notes || null,
    },
    include: {
      donor: {
        select: {
          id: true,
          email: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
              bloodGroup: true,
              phone: true
            }
          }
        }
      },
      bloodRequest: {
        select: {
          id: true,
          title: true,
          bloodGroup: true,
          city: true
        }
      }
    }
  });

  // If donation is completed, update request status
  if (donation.status === 'COMPLETED' && donation.requestId) {
    await BloodRequestService.updateRequestStatus(donation.requestId);

    // Update last donation date in profile
    await prisma.profile.update({
      where: { userId: userExists.id },
      data: { lastDonation: new Date(data.donationDate) }
    });
  }

  return formatDonationResponse(donation);
};

/**
 * Get all donations with pagination and filtering
 */
const getDonations = async (
  filters: any,
  options: IOptions
): Promise<DonationResponse> => {
  const pageNum = Number(options.page) || 1;
  const limitNum = Number(options.limit) || 10;
  const skip = (pageNum - 1) * limitNum;
  const sortBy = options.sortBy || 'createdAt';
  const sortOrder = options.sortOrder || 'desc';

  const where: any = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.donorId) {
    where.donorId = filters.donorId;
  }

  if (filters.requestId) {
    where.requestId = filters.requestId;
  }

  if (filters.bloodGroup) {
    where.donor = {
      profile: {
        bloodGroup: filters.bloodGroup
      }
    };
  }

  const [total, donations] = await Promise.all([
    prisma.donation.count({ where }),
    prisma.donation.findMany({
      where,
      include: {
        donor: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                bloodGroup: true,
                phone: true
              }
            }
          }
        },
        bloodRequest: {
          select: {
            id: true,
            title: true,
            bloodGroup: true,
            city: true
          }
        },
        review: true
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
    data: donations.map(formatDonationResponse),
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
 * Get donation by ID
 */
const getDonationById = async (id: string): Promise<any> => {
  const donation = await prisma.donation.findUnique({
    where: { id },
    include: {
      donor: {
        select: {
          id: true,
          email: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
              bloodGroup: true,
              phone: true,
              avatar: true
            }
          }
        }
      },
      bloodRequest: {
        select: {
          id: true,
          title: true,
          bloodGroup: true,
          city: true,
          hospitalName: true,
          requiredDate: true,
          contactPerson: true
        }
      },
      review: true
    }
  });

  if (!donation) {
    throw new AppError(httpStatus.NOT_FOUND, 'Donation record not found');
  }

  return formatDonationResponse(donation);
};

/**
 * Update donation record
 */
const updateDonation = async (
  donationId: string,
  userId: string,
  data: any
): Promise<any> => {
  const donation = await prisma.donation.findUnique({
    where: { id: donationId },
    include: { donor: true }
  });

  if (!donation) {
    throw new AppError(httpStatus.NOT_FOUND, 'Donation record not found');
  }

  // Only donor or admin can update
  if (donation.donorId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to update this donation');
  }

  // Cannot update completed or cancelled donations
  if (donation.status === 'COMPLETED' || donation.status === 'CANCELLED') {
    throw new AppError(httpStatus.BAD_REQUEST, `Cannot update a ${donation.status.toLowerCase()} donation`);
  }

  const updateData: any = { ...data };

  // If status is being changed to COMPLETED
  if (data.status === 'COMPLETED' && donation.status !== 'COMPLETED') {
    // Update last donation in profile
    await prisma.profile.update({
      where: { userId: donation.donorId },
      data: { lastDonation: donation.donationDate }
    });

    // Update blood request status if exists
    if (donation.requestId) {
      await BloodRequestService.updateRequestStatus(donation.requestId);
    }
  }

  const updatedDonation = await prisma.donation.update({
    where: { id: donationId },
    data: updateData,
    include: {
      donor: {
        select: {
          id: true,
          email: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
              bloodGroup: true,
              phone: true
            }
          }
        }
      },
      bloodRequest: {
        select: {
          id: true,
          title: true,
          bloodGroup: true,
          city: true
        }
      },
      review: true
    }
  });

  return formatDonationResponse(updatedDonation);
};

/**
 * Get user's donations
 */
const getUserDonations = async (
  userId: string,
  filters: any,
  options: IOptions
): Promise<DonationResponse> => {
  const pageNum = Number(options.page) || 1;
  const limitNum = Number(options.limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  const where: any = {
    donorId: userId
  };

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.requestId) {
    where.requestId = filters.requestId;
  }

  const [total, donations] = await Promise.all([
    prisma.donation.count({ where }),
    prisma.donation.findMany({
      where,
      include: {
        donor: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                bloodGroup: true,
                phone: true
              }
            }
          }
        },
        bloodRequest: {
          select: {
            id: true,
            title: true,
            bloodGroup: true,
            city: true
          }
        },
        review: true
      },
      orderBy: {
        donationDate: 'desc'
      },
      skip,
      take: limitNum
    })
  ]);

  const totalPages = Math.ceil(total / limitNum);

  return {
    data: donations.map(formatDonationResponse),
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
 * Get donation statistics
 */
const getDonationStats = async (filters: any): Promise<any> => {
  const { period = 'month', bloodGroup } = filters;

  // Calculate date range
  const now = new Date();
  let startDate = new Date();

  switch (period) {
    case 'day':
      startDate.setDate(startDate.getDate() - 1);
      break;
    case 'week':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case 'year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
  }

  const where: any = {
    donationDate: {
      gte: startDate,
      lte: now
    },
    status: 'COMPLETED'
  };

  if (bloodGroup) {
    where.donor = {
      profile: {
        bloodGroup
      }
    };
  }

  const [
    totalDonations,
    totalUnitsCollected,
    completedDonations,
    scheduledDonations,
    donationsByCity,
    topDonors
  ] = await Promise.all([
    prisma.donation.count({ where }),

    prisma.donation.aggregate({
      _sum: { unitsDonated: true },
      where
    }),

    prisma.donation.count({
      where: { ...where, status: 'COMPLETED' }
    }),

    prisma.donation.count({
      where: { ...where, status: 'SCHEDULED' }
    }),

    prisma.donation.findMany({
      where: { ...where },
      select: {
        id: true,
        donor: {
          select: {
            profile: {
              select: { city: true }
            }
          }
        }
      }
    }),

    prisma.donation.groupBy({
      by: ['donorId'],
      where,
      _count: { id: true },
      _sum: { unitsDonated: true },
      orderBy: {
        _count: { id: 'desc' }
      },
      take: 5
    })
  ]);

  // Calculate donors by city
  const donorsByCity: Record<string, number> = {};
  donationsByCity.forEach(donation => {
    const city = donation.donor?.profile?.city || 'Unknown';
    donorsByCity[city] = (donorsByCity[city] || 0) + 1;
  });

  return {
    period,
    dateRange: {
      startDate,
      endDate: now
    },
    totalDonations,
    totalUnitsCollected: totalUnitsCollected._sum.unitsDonated || 0,
    completedDonations,
    scheduledDonations,
    averageUnitsPerDonation: totalDonations > 0
      ? (totalUnitsCollected._sum.unitsDonated || 0) / totalDonations
      : 0,
    donorsByCity,
    topDonors: topDonors.length
  };
};

/**
 * Cancel a donation
 */
const cancelDonation = async (
  donationId: string,
  userId: string
): Promise<any> => {
  const donation = await prisma.donation.findUnique({
    where: { id: donationId }
  });

  if (!donation) {
    throw new AppError(httpStatus.NOT_FOUND, 'Donation record not found');
  }

  if (donation.donorId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to cancel this donation');
  }

  if (donation.status === 'COMPLETED') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Cannot cancel a completed donation');
  }

  const cancelledDonation = await prisma.donation.update({
    where: { id: donationId },
    data: { status: 'CANCELLED' },
    include: {
      donor: {
        select: {
          id: true,
          email: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
              bloodGroup: true,
              phone: true
            }
          }
        }
      },
      bloodRequest: true,
      review: true
    }
  });

  return formatDonationResponse(cancelledDonation);
};

export const DonationService = {
  createDonation,
  getDonations,
  getDonationById,
  updateDonation,
  getUserDonations,
  getDonationStats,
  cancelDonation
};
