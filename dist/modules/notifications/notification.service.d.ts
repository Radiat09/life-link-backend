export declare const NotificationService: {
    createMatchNotification: (donorId: string, request: any) => Promise<void>;
    getUserNotifications: (userId: string, options?: any) => Promise<{
        data: {
            id: string;
            createdAt: Date;
            link: string | null;
            userId: string;
            type: string;
            message: string;
            title: string;
            isRead: boolean;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    markAsRead: (notificationId: string, userId: string) => Promise<{
        id: string;
        createdAt: Date;
        link: string | null;
        userId: string;
        type: string;
        message: string;
        title: string;
        isRead: boolean;
    }>;
    deleteNotification: (notificationId: string, userId: string) => Promise<{
        id: string;
        createdAt: Date;
        link: string | null;
        userId: string;
        type: string;
        message: string;
        title: string;
        isRead: boolean;
    }>;
};
//# sourceMappingURL=notification.service.d.ts.map