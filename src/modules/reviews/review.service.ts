import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";

interface IOptions {
  page?: string | number;
  limit?: string | number;
  sortBy?: string;
  sortOrder?: string;
}

interface ReviewResponse {
  data: any[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    averageRating?: number;
  };
}

const formatReviewResponse = (review: any) => {
  return {
    id: review.id,
    donationId: review.donationId,
    rating: review.rating,
    comment: review.comment,
    reviewerId: review.reviewerId,
    createdAt: review.createdAt,
    donation: review.donation
  };
};

/**
 * Create a new review
 */
const createReview = async (
  user: JwtPayload,
  data: any
): Promise<any> => {
  // Verify donation exists
  const donation = await prisma.donation.findUnique({
    where: { id: data.donationId },
    include: { donor: true }
  });

  if (!donation) {
    throw new AppError(httpStatus.NOT_FOUND, 'Donation record not found');
  }

  // Check if donation is completed
  if (donation.status !== 'COMPLETED') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Can only review completed donations');
  }

  // Check if review already exists
  const existingReview = await prisma.review.findUnique({
    where: { donationId: data.donationId }
  });

  if (existingReview) {
    throw new AppError(httpStatus.CONFLICT, 'Review already exists for this donation');
  }

  // Get reviewer info
  const reviewer = await prisma.user.findUnique({
    where: { email: user.email }
  });

  if (!reviewer) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Create review
  const review = await prisma.review.create({
    data: {
      donationId: data.donationId,
      rating: data.rating,
      comment: data.comment || null,
      reviewerId: reviewer.id,
    },
    include: {
      donation: {
        select: {
          id: true,
          donationDate: true,
          unitsDonated: true,
          donor: {
            select: {
              id: true,
              email: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatar: true,
                  bloodGroup: true
                }
              }
            }
          }
        }
      }
    }
  });

  return formatReviewResponse(review);
};

/**
 * Get all reviews with pagination and filtering
 */
const getReviews = async (
  filters: any,
  options: IOptions
): Promise<ReviewResponse> => {
  const pageNum = Number(options.page) || 1;
  const limitNum = Number(options.limit) || 10;
  const skip = (pageNum - 1) * limitNum;
  const sortBy = options.sortBy || 'createdAt';
  const sortOrder = options.sortOrder || 'desc';

  const where: any = {};

  if (filters.donorId) {
    where.donation = {
      donorId: filters.donorId
    };
  }

  if (filters.rating) {
    where.rating = parseInt(filters.rating);
  }

  if (filters.minRating) {
    where.rating = {
      gte: parseInt(filters.minRating)
    };
  }

  const [total, reviews] = await Promise.all([
    prisma.review.count({ where }),
    prisma.review.findMany({
      where,
      include: {
        donation: {
          select: {
            id: true,
            donationDate: true,
            unitsDonated: true,
            donor: {
              select: {
                id: true,
                email: true,
                profile: {
                  select: {
                    firstName: true,
                    lastName: true,
                    avatar: true,
                    bloodGroup: true
                  }
                }
              }
            }
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
    data: reviews.map(formatReviewResponse),
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
 * Get review by ID
 */
const getReviewById = async (id: string): Promise<any> => {
  const review = await prisma.review.findUnique({
    where: { id },
    include: {
      donation: {
        select: {
          id: true,
          donationDate: true,
          unitsDonated: true,
          bloodRequest: {
            select: {
              title: true,
              city: true,
              hospitalName: true
            }
          },
          donor: {
            select: {
              id: true,
              email: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatar: true,
                  bloodGroup: true
                }
              }
            }
          }
        }
      }
    }
  });

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
  }

  return formatReviewResponse(review);
};

/**
 * Update a review
 */
const updateReview = async (
  reviewId: string,
  userId: string,
  data: any
): Promise<any> => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId }
  });

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
  }

  // Only reviewer can update their own review
  if (review.reviewerId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to update this review');
  }

  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data,
    include: {
      donation: {
        select: {
          id: true,
          donationDate: true,
          unitsDonated: true,
          donor: {
            select: {
              id: true,
              email: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatar: true,
                  bloodGroup: true
                }
              }
            }
          }
        }
      }
    }
  });

  return formatReviewResponse(updatedReview);
};

/**
 * Delete a review
 */
const deleteReview = async (
  reviewId: string,
  userId: string
): Promise<any> => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId }
  });

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
  }

  // Only reviewer or admin can delete
  if (review.reviewerId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to delete this review');
  }

  const deletedReview = await prisma.review.delete({
    where: { id: reviewId },
    include: {
      donation: true
    }
  });

  return formatReviewResponse(deletedReview);
};

/**
 * Get reviews for a donor (by donor ID)
 */
const getDonorReviews = async (
  donorId: string,
  options: IOptions
): Promise<ReviewResponse> => {
  const pageNum = Number(options.page) || 1;
  const limitNum = Number(options.limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  const where = {
    donation: {
      donorId
    }
  };

  const [total, reviews] = await Promise.all([
    prisma.review.count({ where }),
    prisma.review.findMany({
      where,
      include: {
        donation: {
          select: {
            id: true,
            donationDate: true,
            unitsDonated: true
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

  // Calculate average rating
  const avgRatingResult = await prisma.review.aggregate({
    _avg: {
      rating: true
    },
    where
  });

  return {
    data: reviews.map(formatReviewResponse),
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
      hasNext: pageNum < totalPages,
      hasPrev: pageNum > 1,
      averageRating: avgRatingResult._avg.rating || 0
    }
  };
};

/**
 * Get review statistics
 */
const getReviewStats = async (): Promise<any> => {
  const [totalReviews, averageRating, ratingDistribution] = await Promise.all([
    prisma.review.count(),

    prisma.review.aggregate({
      _avg: {
        rating: true
      }
    }),

    prisma.review.groupBy({
      by: ['rating'],
      _count: {
        id: true
      },
      orderBy: {
        rating: 'asc'
      }
    })
  ]);

  // Top rated reviewers (by average rating)
  const topRatedReviewers = await prisma.review.groupBy({
    by: ['reviewerId'],
    _avg: { rating: true },
    _count: { id: true },
    orderBy: { _avg: { rating: 'desc' } },
    take: 10
  });

  return {
    totalReviews,
    averageRating: averageRating._avg.rating || 0,
    ratingDistribution: ratingDistribution.map(r => ({
      rating: r.rating,
      count: r._count.id,
      percentage: totalReviews > 0 ? ((r._count.id / totalReviews) * 100).toFixed(2) : 0
    })),
    topRatedReviewers
  };
};

export const ReviewService = {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getDonorReviews,
  getReviewStats
};
