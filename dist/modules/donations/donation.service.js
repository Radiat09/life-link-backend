"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonationService = void 0;
const prisma_1 = require("../../config/prisma");
const AppError_1 = require("../../utils/AppError");
const http_status_1 = __importDefault(require("http-status"));
const calculateAge_1 = require("../../utils/calculateAge");
const client_1 = require("@prisma/client");
const bloodRequest_service_1 = require("../bloodRequest/bloodRequest.service");
const emailService_1 = require("../../utils/emailService");
// Helper to format donation response
const formatDonationResponse = (donation) => {
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
const createDonation = async (user, data) => {
    // Verify user exists and is a donor
    const userExists = await prisma_1.prisma.user.findUnique({
        where: { email: user.email },
        include: { profile: true }
    });
    if (!userExists) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (userExists.status === client_1.UserStatus.SUSPENDED) {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, 'Your account is suspended');
    }
    // Validate donor eligibility
    const profile = userExists.profile;
    if (!profile) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Please complete your profile first');
    }
    // Check age (donors should be 18-65)
    const age = (0, calculateAge_1.calculateAge)(profile.dateOfBirth);
    if (age < 18 || age > 65) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Donors must be between 18 and 65 years old');
    }
    // Check last donation (must be at least 56 days apart)
    const lastDonation = profile.lastDonation;
    if (lastDonation) {
        const daysSinceLast = Math.floor((Date.now() - new Date(lastDonation).getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceLast < 56) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `You can only donate after 56 days. You can donate again on ${new Date(new Date(lastDonation).getTime() + 56 * 24 * 60 * 60 * 1000).toLocaleDateString()}`);
        }
    }
    // If requestId provided, verify it exists and is valid
    if (data.requestId) {
        const bloodRequest = await prisma_1.prisma.bloodRequest.findUnique({
            where: { id: data.requestId }
        });
        if (!bloodRequest) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Blood request not found');
        }
        if (bloodRequest.status === client_1.RequestStatus.FULFILLED) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'This blood request is already fulfilled');
        }
        if (bloodRequest.status === client_1.RequestStatus.CANCELLED) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'This blood request has been cancelled');
        }
    }
    // Create donation record
    const donation = await prisma_1.prisma.donation.create({
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
        await bloodRequest_service_1.BloodRequestService.updateRequestStatus(donation.requestId);
        // Update last donation date in profile
        await prisma_1.prisma.profile.update({
            where: { userId: userExists.id },
            data: { lastDonation: new Date(data.donationDate) }
        });
        // Send donation confirmation email
        emailService_1.EmailService.sendDonationConfirmationEmail(userExists.email, userExists.profile?.firstName || 'Donor', donation).catch(err => console.error('Donation confirmation email failed:', err));
    }
    return formatDonationResponse(donation);
};
/**
 * Get all donations with pagination and filtering
 */
const getDonations = async (filters, options) => {
    const pageNum = Number(options.page) || 1;
    const limitNum = Number(options.limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'desc';
    const where = {};
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
        prisma_1.prisma.donation.count({ where }),
        prisma_1.prisma.donation.findMany({
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
const getDonationById = async (id) => {
    const donation = await prisma_1.prisma.donation.findUnique({
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
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Donation record not found');
    }
    return formatDonationResponse(donation);
};
/**
 * Update donation record
 */
const updateDonation = async (donationId, userId, data) => {
    const donation = await prisma_1.prisma.donation.findUnique({
        where: { id: donationId },
        include: { donor: true }
    });
    if (!donation) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Donation record not found');
    }
    // Only donor or admin can update
    if (donation.donorId !== userId) {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, 'You are not authorized to update this donation');
    }
    // Cannot update completed or cancelled donations
    if (donation.status === 'COMPLETED' || donation.status === 'CANCELLED') {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `Cannot update a ${donation.status.toLowerCase()} donation`);
    }
    const updateData = { ...data };
    // If status is being changed to COMPLETED
    if (data.status === 'COMPLETED' && donation.status !== 'COMPLETED') {
        // Update last donation in profile
        await prisma_1.prisma.profile.update({
            where: { userId: donation.donorId },
            data: { lastDonation: donation.donationDate }
        });
        // Update blood request status if exists
        if (donation.requestId) {
            await bloodRequest_service_1.BloodRequestService.updateRequestStatus(donation.requestId);
        }
    }
    const updatedDonation = await prisma_1.prisma.donation.update({
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
const getUserDonations = async (userId, filters, options) => {
    const pageNum = Number(options.page) || 1;
    const limitNum = Number(options.limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    const where = {
        donorId: userId
    };
    if (filters.status) {
        where.status = filters.status;
    }
    if (filters.requestId) {
        where.requestId = filters.requestId;
    }
    const [total, donations] = await Promise.all([
        prisma_1.prisma.donation.count({ where }),
        prisma_1.prisma.donation.findMany({
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
const getDonationStats = async (filters) => {
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
    const where = {
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
    const [totalDonations, totalUnitsCollected, completedDonations, scheduledDonations, donationsByCity, topDonors] = await Promise.all([
        prisma_1.prisma.donation.count({ where }),
        prisma_1.prisma.donation.aggregate({
            _sum: { unitsDonated: true },
            where
        }),
        prisma_1.prisma.donation.count({
            where: { ...where, status: 'COMPLETED' }
        }),
        prisma_1.prisma.donation.count({
            where: { ...where, status: 'SCHEDULED' }
        }),
        prisma_1.prisma.donation.findMany({
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
        prisma_1.prisma.donation.groupBy({
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
    const donorsByCity = {};
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
const cancelDonation = async (donationId, userId) => {
    const donation = await prisma_1.prisma.donation.findUnique({
        where: { id: donationId }
    });
    if (!donation) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Donation record not found');
    }
    if (donation.donorId !== userId) {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, 'You are not authorized to cancel this donation');
    }
    if (donation.status === 'COMPLETED') {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Cannot cancel a completed donation');
    }
    const cancelledDonation = await prisma_1.prisma.donation.update({
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
exports.DonationService = {
    createDonation,
    getDonations,
    getDonationById,
    updateDonation,
    getUserDonations,
    getDonationStats,
    cancelDonation
};
//# sourceMappingURL=donation.service.js.map