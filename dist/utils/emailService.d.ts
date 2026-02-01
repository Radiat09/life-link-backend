interface EmailPayload {
    to: string;
    subject: string;
    html: string;
}
export declare const EmailService: {
    sendEmail: (payload: EmailPayload) => Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: unknown;
    }>;
    sendDonationMatchEmail: (donorEmail: string, donorName: string, requestData: any) => Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: unknown;
    }>;
    sendDonationConfirmationEmail: (donorEmail: string, donorName: string, donationData: any) => Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: unknown;
    }>;
    sendRequestCreatedEmail: (requesterEmail: string, requesterName: string, requestData: any) => Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: unknown;
    }>;
    sendReviewNotificationEmail: (donorEmail: string, donorName: string, reviewerName: string) => Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: unknown;
    }>;
};
export {};
//# sourceMappingURL=emailService.d.ts.map