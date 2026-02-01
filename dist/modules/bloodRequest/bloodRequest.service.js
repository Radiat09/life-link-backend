"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloodRequestService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../config/prisma");
const AppError_1 = require("../../utils/AppError");
const http_status_1 = __importDefault(require("http-status"));
const calculateAge_1 = require("../../utils/calculateAge");
const notification_service_1 = require("../notifications/notification.service");
const emailService_1 = require("../../utils/emailService");
const auth_service_1 = require("../auth/auth.service");
// Helper function to format request response
const formatRequestResponse = (request) => {
    return {
        id: request.id,
        requestId: request.requestId,
        title: request.title,
        description: request.description,
        bloodGroup: request.bloodGroup,
        unitsRequired: request.unitsRequired,
        fulfilledUnits: request.fulfilledUnits,
        urgencyLevel: request.urgencyLevel,
        hospitalName: request.hospitalName,
        hospitalAddress: request.hospitalAddress,
        city: request.city,
        contactPerson: request.contactPerson,
        contactPhone: request.contactPhone,
        requiredDate: request.requiredDate,
        status: request.status,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
        user: request.user,
        donations: request.donations || [],
        _count: request._count
    };
};
/**
 * Create a new blood request
 */
const createRequest = async (user, data) => {
    // Check if user exists
    const userExists = await prisma_1.prisma.user.findUnique({
        where: { email: user.email }
    });
    if (!userExists) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // Check emergency restrictions
    const isEmergency = data.isEmergency || data.urgencyLevel === client_1.UrgencyLevel.CRITICAL;
    await auth_service_1.AuthService.checkEmergencyRestrictions(userExists.id, isEmergency);
    // Validate required date
    const requiredDate = new Date(data.requiredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (requiredDate < today) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Required date must be today or in the future');
    }
    // Create the blood request
    const request = await prisma_1.prisma.bloodRequest.create({
        data: {
            userId: userExists.id,
            title: data.title,
            description: data.description,
            bloodGroup: data.bloodGroup,
            unitsRequired: data.unitsRequired || 1,
            urgencyLevel: data.urgencyLevel || client_1.UrgencyLevel.MEDIUM,
            hospitalName: data.hospitalName,
            hospitalAddress: data.hospitalAddress,
            city: data.city,
            contactPerson: data.contactPerson,
            contactPhone: data.contactPhone,
            requiredDate: requiredDate,
            status: client_1.RequestStatus.PENDING,
            isEmergency: isEmergency,
            verificationRequired: isEmergency
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                    profile: {
                        select: {
                            firstName: true,
                            lastName: true,
                            phone: true
                        }
                    }
                }
            },
            _count: {
                select: {
                    donations: true
                }
            }
        }
    });
    // Send request created email
    emailService_1.EmailService.sendRequestCreatedEmail(userExists.email, request.user.profile?.firstName || 'User', {
        ...request,
        id: request.id
    }).catch(err => console.error('Email send failed:', err));
    // Trigger matching algorithm (async)
    findMatchingDonors(request.id).catch(console.error);
    return formatRequestResponse(request);
};
/**
 * Get all blood requests with pagination and filtering
 */
const getRequests = async (filters) => {
    const { page = '1', limit = '10', bloodGroup, city, urgencyLevel, status, sortBy = 'createdAt', sortOrder = 'desc', search } = filters;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    // Build where clause
    const where = {};
    if (bloodGroup) {
        where.bloodGroup = bloodGroup;
    }
    if (city) {
        where.city = {
            contains: city,
            mode: 'insensitive'
        };
    }
    if (urgencyLevel) {
        where.urgencyLevel = urgencyLevel;
    }
    if (status) {
        where.status = status;
    }
    else {
        // By default, exclude cancelled and fulfilled requests
        where.status = {
            notIn: [client_1.RequestStatus.CANCELLED, client_1.RequestStatus.FULFILLED, client_1.RequestStatus.EXPIRED]
        };
    }
    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { hospitalName: { contains: search, mode: 'insensitive' } },
            { city: { contains: search, mode: 'insensitive' } },
            { contactPerson: { contains: search, mode: 'insensitive' } }
        ];
    }
    // Only show requests that haven't expired (if not showing all)
    if (!status || status !== client_1.RequestStatus.EXPIRED) {
        where.requiredDate = {
            gte: new Date()
        };
    }
    // Get total count
    const total = await prisma_1.prisma.bloodRequest.count({ where });
    // Get requests with pagination
    const requests = await prisma_1.prisma.bloodRequest.findMany({
        where,
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                    profile: {
                        select: {
                            firstName: true,
                            lastName: true,
                            phone: true
                        }
                    }
                }
            },
            _count: {
                select: {
                    donations: true
                }
            }
        },
        orderBy: {
            [sortBy]: sortOrder
        },
        skip,
        take: limitNum
    });
    const totalPages = Math.ceil(total / limitNum);
    return {
        data: requests.map(formatRequestResponse),
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
 * Get a single blood request by ID
 */
const getRequestById = async (id) => {
    const request = await prisma_1.prisma.bloodRequest.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                    profile: {
                        select: {
                            firstName: true,
                            lastName: true,
                            phone: true
                        }
                    }
                }
            },
            donations: {
                include: {
                    donor: {
                        select: {
                            id: true,
                            email: true,
                            profile: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    phone: true,
                                    bloodGroup: true
                                }
                            }
                        }
                    }
                }
            },
            _count: {
                select: {
                    donations: true
                }
            }
        }
    });
    if (!request) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Blood request not found');
    }
    return formatRequestResponse(request);
};
/**
 * Update a blood request
 */
const updateRequest = async (requestId, userId, data) => {
    // Find the request
    const request = await prisma_1.prisma.bloodRequest.findUnique({
        where: { id: requestId },
        include: { user: true }
    });
    if (!request) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Blood request not found');
    }
    // Check authorization (only creator or admin can update)
    if (request.userId !== userId && !['ADMIN', 'SUPER_ADMIN'].includes(request.user.role)) {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, 'You are not authorized to update this request');
    }
    // Check if request can be updated
    if (request.status === client_1.RequestStatus.FULFILLED || request.status === client_1.RequestStatus.CANCELLED) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Cannot update a fulfilled or cancelled request');
    }
    // Prepare update data
    const updateData = { ...data };
    if (data.requiredDate) {
        updateData.requiredDate = new Date(data.requiredDate);
    }
    // Update the request
    const updatedRequest = await prisma_1.prisma.bloodRequest.update({
        where: { id: requestId },
        data: updateData,
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                    profile: {
                        select: {
                            firstName: true,
                            lastName: true,
                            phone: true
                        }
                    }
                }
            },
            _count: {
                select: {
                    donations: true
                }
            }
        }
    });
    return formatRequestResponse(updatedRequest);
};
/**
 * Delete/Cancel a blood request
 */
const deleteRequest = async (requestId, userId, userRole) => {
    // Find the request
    const request = await prisma_1.prisma.bloodRequest.findUnique({
        where: { id: requestId }
    });
    if (!request) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Blood request not found');
    }
    // Check authorization
    if (request.userId !== userId && !['ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, 'You are not authorized to delete this request');
    }
    // Soft delete by updating status to CANCELLED
    const updatedRequest = await prisma_1.prisma.bloodRequest.update({
        where: { id: requestId },
        data: { status: client_1.RequestStatus.CANCELLED },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    role: true
                }
            }
        }
    });
    return formatRequestResponse(updatedRequest);
};
/**
 * Get requests created by a specific user
 */
const getUserRequests = async (userId, filters) => {
    const { page = '1', limit = '10', status } = filters;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    const where = {
        userId
    };
    if (status) {
        where.status = status;
    }
    else {
        where.status = {
            not: client_1.RequestStatus.CANCELLED
        };
    }
    const [total, requests] = await Promise.all([
        prisma_1.prisma.bloodRequest.count({ where }),
        prisma_1.prisma.bloodRequest.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        profile: {
                            select: {
                                firstName: true,
                                lastName: true,
                                phone: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        donations: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip,
            take: limitNum
        })
    ]);
    const totalPages = Math.ceil(total / limitNum);
    return {
        data: requests.map(formatRequestResponse),
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
 * Get urgent blood requests (CRITICAL and HIGH urgency)
 */
const getUrgentRequests = async (filters) => {
    const { limit = '5' } = filters;
    const limitNum = parseInt(limit);
    const requests = await prisma_1.prisma.bloodRequest.findMany({
        where: {
            urgencyLevel: {
                in: [client_1.UrgencyLevel.CRITICAL, client_1.UrgencyLevel.HIGH]
            },
            status: {
                notIn: [client_1.RequestStatus.FULFILLED, client_1.RequestStatus.CANCELLED, client_1.RequestStatus.EXPIRED]
            },
            requiredDate: {
                gte: new Date()
            }
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                    profile: {
                        select: {
                            firstName: true,
                            lastName: true,
                            phone: true
                        }
                    }
                }
            },
            _count: {
                select: {
                    donations: true
                }
            }
        },
        orderBy: [
            { urgencyLevel: 'desc' },
            { requiredDate: 'asc' }
        ],
        take: limitNum
    });
    return requests.map(formatRequestResponse);
};
/**
 * Find matching donors for a blood request
 */
const findMatchingDonors = async (requestId) => {
    const request = await prisma_1.prisma.bloodRequest.findUnique({
        where: { id: requestId },
        include: {
            donations: {
                where: {
                    status: 'COMPLETED'
                },
                select: {
                    donorId: true
                }
            }
        }
    });
    if (!request) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Blood request not found');
    }
    // Get all eligible donors
    const eligibleDonors = await prisma_1.prisma.user.findMany({
        where: {
            role: client_1.UserRole.USER,
            status: client_1.UserStatus.ACTIVE,
            profile: {
                isAvailable: true,
                bloodGroup: request.bloodGroup,
                city: request.city,
                // lastDonation: {
                //   lt: new Date(Date.now() - 56 * 24 * 60 * 60 * 1000) // 56 days ago
                // }
                OR: [
                    {
                        lastDonation: {
                            lt: new Date(Date.now() - 56 * 24 * 60 * 60 * 1000)
                        }
                    },
                    {
                        lastDonation: null // Include people who haven't donated yet
                    }
                ]
            },
        },
        include: {
            profile: true,
            donations: {
                where: {
                    status: 'COMPLETED'
                },
                orderBy: {
                    donationDate: 'desc'
                },
                take: 1
            }
        }
    });
    // Filter out donors who have already donated to this request
    const alreadyDonatedIds = request.donations.map(d => d.donorId);
    const availableDonors = eligibleDonors.filter(donor => !alreadyDonatedIds.includes(donor.id));
    // Calculate compatibility score for each donor
    const donorsWithScore = availableDonors.map(donor => {
        let score = 100;
        // Proximity bonus (same city)
        if (donor.profile?.city === request.city) {
            score += 20;
        }
        // Recent donor penalty
        if (donor.donations.length > 0) {
            const lastDonation = new Date(donor.donations[0].donationDate);
            const daysSinceLast = Math.floor((Date.now() - lastDonation.getTime()) / (1000 * 60 * 60 * 24));
            if (daysSinceLast < 90) {
                score -= 10;
            }
        }
        if (donor.donations.length === 0) {
            score += 5; // Small encouragement bonus for first-timers
        }
        // Age factor
        if (donor.profile?.dateOfBirth) {
            const age = (0, calculateAge_1.calculateAge)(donor.profile.dateOfBirth);
            if (age >= 18 && age <= 30)
                score += 10; // Young donors bonus
        }
        return {
            ...donor,
            compatibilityScore: score
        };
    });
    // Sort by compatibility score
    const sortedDonors = donorsWithScore.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    // Create notifications for top 5 matching donors (if notification service exists)
    try {
        const topDonors = sortedDonors.slice(0, 5);
        for (const donor of topDonors) {
            // Create in-app notification
            await notification_service_1.NotificationService.createMatchNotification(donor.id, request);
            // Send email notification
            emailService_1.EmailService.sendDonationMatchEmail(donor.email, donor.profile?.firstName || 'Donor', {
                city: request.city,
                bloodGroup: request.bloodGroup,
                hospitalName: request.hospitalName,
                requiredDate: request.requiredDate,
                contactPhone: request.contactPhone,
                id: request.id
            }).catch(err => console.error('Match email failed:', err));
        }
    }
    catch (error) {
        console.error('Error creating notifications:', error);
    }
    return sortedDonors.slice(0, 20); // Return top 20 matches
};
/**
 * Update request status based on donations
 */
const updateRequestStatus = async (requestId) => {
    const request = await prisma_1.prisma.bloodRequest.findUnique({
        where: { id: requestId },
        include: {
            donations: {
                where: {
                    status: 'COMPLETED'
                }
            }
        }
    });
    if (!request)
        return;
    const fulfilledUnits = request.donations.reduce((sum, donation) => sum + (donation.unitsDonated || 1), 0);
    let newStatus = request.status;
    if (fulfilledUnits >= request.unitsRequired) {
        newStatus = client_1.RequestStatus.FULFILLED;
    }
    else if (fulfilledUnits > 0) {
        newStatus = client_1.RequestStatus.PARTIALLY_FULFILLED;
    }
    else if (request.status === client_1.RequestStatus.PENDING) {
        newStatus = client_1.RequestStatus.ACTIVE;
    }
    // Check if request is expired
    const now = new Date();
    const requiredDate = new Date(request.requiredDate);
    if (now > requiredDate && newStatus !== client_1.RequestStatus.FULFILLED) {
        newStatus = client_1.RequestStatus.EXPIRED;
    }
    if (newStatus !== request.status) {
        await prisma_1.prisma.bloodRequest.update({
            where: { id: requestId },
            data: {
                status: newStatus,
                fulfilledUnits
            }
        });
    }
};
/**
 * Get blood request statistics
 */
const getRequestStatistics = async () => {
    const [totalRequests, pendingRequests, activeRequests, partiallyFulfilledRequests, fulfilledRequests, expiredRequests, cancelledRequests, urgentRequests, requestsByCity, requestsByBloodGroup, requestsByUrgencyLevel] = await Promise.all([
        // Total requests
        prisma_1.prisma.bloodRequest.count(),
        // Pending requests
        prisma_1.prisma.bloodRequest.count({ where: { status: client_1.RequestStatus.PENDING } }),
        // Active requests
        prisma_1.prisma.bloodRequest.count({ where: { status: client_1.RequestStatus.ACTIVE } }),
        // Partially fulfilled requests
        prisma_1.prisma.bloodRequest.count({ where: { status: client_1.RequestStatus.PARTIALLY_FULFILLED } }),
        // Fulfilled requests
        prisma_1.prisma.bloodRequest.count({ where: { status: client_1.RequestStatus.FULFILLED } }),
        // Expired requests
        prisma_1.prisma.bloodRequest.count({ where: { status: client_1.RequestStatus.EXPIRED } }),
        // Cancelled requests
        prisma_1.prisma.bloodRequest.count({ where: { status: client_1.RequestStatus.CANCELLED } }),
        // Urgent requests (CRITICAL and HIGH)
        prisma_1.prisma.bloodRequest.count({
            where: {
                urgencyLevel: { in: [client_1.UrgencyLevel.CRITICAL, client_1.UrgencyLevel.HIGH] },
                status: { notIn: [client_1.RequestStatus.FULFILLED, client_1.RequestStatus.CANCELLED] }
            }
        }),
        // Requests by city
        prisma_1.prisma.bloodRequest.groupBy({
            by: ['city'],
            _count: {
                id: true
            },
            where: {
                status: { notIn: [client_1.RequestStatus.CANCELLED] }
            },
            orderBy: {
                _count: {
                    id: 'desc'
                }
            },
            take: 10
        }),
        // Requests by blood group
        prisma_1.prisma.bloodRequest.groupBy({
            by: ['bloodGroup'],
            _count: {
                id: true
            },
            where: {
                status: { notIn: [client_1.RequestStatus.FULFILLED, client_1.RequestStatus.CANCELLED] }
            },
            orderBy: {
                _count: {
                    id: 'desc'
                }
            }
        }),
        // Requests by urgency level
        prisma_1.prisma.bloodRequest.groupBy({
            by: ['urgencyLevel'],
            _count: {
                id: true
            },
            where: {
                status: { notIn: [client_1.RequestStatus.FULFILLED, client_1.RequestStatus.CANCELLED] }
            }
        })
    ]);
    return {
        totalRequests,
        byStatus: {
            pending: pendingRequests,
            active: activeRequests,
            partiallyFulfilled: partiallyFulfilledRequests,
            fulfilled: fulfilledRequests,
            expired: expiredRequests,
            cancelled: cancelledRequests
        },
        urgentRequests,
        requestsByCity,
        requestsByBloodGroup,
        requestsByUrgencyLevel,
        summary: {
            activeRequests: pendingRequests + activeRequests + partiallyFulfilledRequests,
            completedRequests: fulfilledRequests,
            failedRequests: expiredRequests + cancelledRequests
        }
    };
};
exports.BloodRequestService = {
    createRequest,
    getRequests,
    getRequestById,
    updateRequest,
    deleteRequest,
    getUserRequests,
    getUrgentRequests,
    findMatchingDonors,
    updateRequestStatus,
    getRequestStatistics
};
//# sourceMappingURL=bloodRequest.service.js.map