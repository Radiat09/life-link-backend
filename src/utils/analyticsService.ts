import { prisma } from "../config/prisma";

interface AnalyticsFilters {
  period?: 'day' | 'week' | 'month' | 'year';
  bloodGroup?: string;
  city?: string;
}

const getDonorDemographics = async (_filters: AnalyticsFilters = {}) => {
  const [total, donors, byCity] = await Promise.all([
    prisma.user.count({ where: { role: 'DONOR' } }),
    prisma.user.findMany({
      where: { role: 'DONOR' },
      select: {
        profile: {
          select: {
            bloodGroup: true,
            gender: true,
            dateOfBirth: true,
            city: true
          }
        }
      },
      take: 10000
    }),
    prisma.profile.groupBy({
      by: ['city'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10
    })
  ]);

  // Calculate distributions
  const byBloodGroup: any = {};
  const byGender: any = {};
  const ageRanges: any = { '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, '56-65': 0, '65+': 0 };

  donors.forEach(user => {
    if (user.profile) {
      byBloodGroup[user.profile.bloodGroup] = (byBloodGroup[user.profile.bloodGroup] || 0) + 1;
      byGender[user.profile.gender || 'Not Specified'] = (byGender[user.profile.gender || 'Not Specified'] || 0) + 1;

      const age = new Date().getFullYear() - new Date(user.profile.dateOfBirth).getFullYear();
      if (age >= 18 && age <= 25) ageRanges['18-25']++;
      else if (age >= 26 && age <= 35) ageRanges['26-35']++;
      else if (age >= 36 && age <= 45) ageRanges['36-45']++;
      else if (age >= 46 && age <= 55) ageRanges['46-55']++;
      else if (age >= 56 && age <= 65) ageRanges['56-65']++;
      else if (age > 65) ageRanges['65+']++;
    }
  });

  return {
    totalDonors: total,
    byBloodGroup,
    byCity,
    byGender,
    ageRanges
  };
};

const getDonationTrends = async (filters: AnalyticsFilters = {}) => {
  const { period = 'month' } = filters;

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
    donationDate: { gte: startDate, lte: now },
    status: 'COMPLETED'
  };

  const [totalDonations, totalUnits, byStatus, topDonors] = await Promise.all([
    prisma.donation.count({ where }),
    prisma.donation.aggregate({
      _sum: { unitsDonated: true },
      where
    }),
    prisma.donation.groupBy({
      by: ['status'],
      where: { donationDate: { gte: startDate, lte: now } },
      _count: { id: true }
    }),
    prisma.donation.findMany({
      where,
      include: { donor: { select: { profile: { select: { firstName: true, lastName: true } } } } },
      orderBy: { unitsDonated: 'desc' },
      take: 10
    })
  ]);

  return {
    period,
    dateRange: { startDate, endDate: now },
    totalDonations,
    totalUnitsCollected: totalUnits._sum.unitsDonated || 0,
    averageUnitsPerDonation: totalDonations > 0 ? (totalUnits._sum.unitsDonated || 0) / totalDonations : 0,
    byStatus,
    topDonors: topDonors.map((d: any) => ({
      name: `${d.donor?.profile?.firstName} ${d.donor?.profile?.lastName}`,
      units: d.unitsDonated
    }))
  };
};

const getRequestAnalytics = async (filters: AnalyticsFilters = {}) => {
  const { period = 'month' } = filters;

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
    createdAt: { gte: startDate, lte: now }
  };

  const [totalRequests, byStatus, byBloodGroup, byCity, fulfilledStats] = await Promise.all([
    prisma.bloodRequest.count({ where }),
    prisma.bloodRequest.groupBy({
      by: ['status'],
      where,
      _count: { id: true }
    }),
    prisma.bloodRequest.groupBy({
      by: ['bloodGroup'],
      where,
      _count: { id: true }
    }),
    prisma.bloodRequest.groupBy({
      by: ['city'],
      where,
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10
    }),
    prisma.bloodRequest.findMany({
      where: { status: 'FULFILLED' },
      select: { fulfilledUnits: true, unitsRequired: true }
    })
  ]);

  const avgFulfillmentRate = fulfilledStats.length > 0
    ? (fulfilledStats.reduce((sum: number, r: any) => sum + (r.fulfilledUnits / r.unitsRequired), 0) / fulfilledStats.length) * 100
    : 0;

  return {
    period,
    dateRange: { startDate, endDate: now },
    totalRequests,
    byStatus,
    byBloodGroup,
    topCities: byCity,
    averageFulfillmentRate: avgFulfillmentRate.toFixed(2)
  };
};

const getDashboardMetrics = async () => {
  const [
    totalDonors,
    totalDonations,
    totalRequests,
    fulfillmentRate,
    topBloodGroups
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'DONOR' } }),
    prisma.donation.count(),
    prisma.bloodRequest.count(),
    prisma.donation.aggregate({
      _count: { id: true },
      where: { status: 'COMPLETED' }
    }),
    prisma.bloodRequest.groupBy({
      by: ['bloodGroup'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5
    })
  ]);

  return {
    totalDonors,
    totalDonations,
    totalRequests,
    completedDonations: fulfillmentRate._count,
    topBloodGroups
  };
};

export const AnalyticsService = {
  getDonorDemographics,
  getDonationTrends,
  getRequestAnalytics,
  getDashboardMetrics
};
