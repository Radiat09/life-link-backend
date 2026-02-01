interface AnalyticsFilters {
    period?: 'day' | 'week' | 'month' | 'year';
    bloodGroup?: string;
    city?: string;
}
export declare const AnalyticsService: {
    getDonorDemographics: (_filters?: AnalyticsFilters) => Promise<{
        totalDonors: number;
        byBloodGroup: any;
        byCity: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ProfileGroupByOutputType, "city"[]> & {
            _count: {
                id: number;
            };
        })[];
        byGender: any;
        ageRanges: any;
    }>;
    getDonationTrends: (filters?: AnalyticsFilters) => Promise<{
        period: "year" | "week" | "day" | "month";
        dateRange: {
            startDate: Date;
            endDate: Date;
        };
        totalDonations: number;
        totalUnitsCollected: number;
        averageUnitsPerDonation: number;
        byStatus: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.DonationGroupByOutputType, "status"[]> & {
            _count: {
                id: number;
            };
        })[];
        topDonors: {
            name: string;
            units: any;
        }[];
    }>;
    getRequestAnalytics: (filters?: AnalyticsFilters) => Promise<{
        period: "year" | "week" | "day" | "month";
        dateRange: {
            startDate: Date;
            endDate: Date;
        };
        totalRequests: number;
        byStatus: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BloodRequestGroupByOutputType, "status"[]> & {
            _count: {
                id: number;
            };
        })[];
        byBloodGroup: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BloodRequestGroupByOutputType, "bloodGroup"[]> & {
            _count: {
                id: number;
            };
        })[];
        topCities: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BloodRequestGroupByOutputType, "city"[]> & {
            _count: {
                id: number;
            };
        })[];
        averageFulfillmentRate: string;
    }>;
    getDashboardMetrics: () => Promise<{
        totalDonors: number;
        totalDonations: number;
        totalRequests: number;
        completedDonations: {
            id: number;
        };
        topBloodGroups: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.BloodRequestGroupByOutputType, "bloodGroup"[]> & {
            _count: {
                id: number;
            };
        })[];
    }>;
};
export {};
//# sourceMappingURL=analyticsService.d.ts.map