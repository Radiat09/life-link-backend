"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const transporter = nodemailer_1.default.createTransport({
    host: env_1.envVars.EMAIL_SENDER.SMTP_HOST,
    port: Number(env_1.envVars.EMAIL_SENDER.SMTP_PORT),
    secure: true,
    auth: {
        user: env_1.envVars.EMAIL_SENDER.SMTP_USER,
        pass: env_1.envVars.EMAIL_SENDER.SMTP_PASS
    }
});
const sendEmail = async (payload) => {
    try {
        await transporter.sendMail({
            from: env_1.envVars.EMAIL_SENDER.SMTP_FROM,
            to: payload.to,
            subject: payload.subject,
            html: payload.html
        });
        return { success: true };
    }
    catch (error) {
        console.error('Email send failed:', error);
        return { success: false, error };
    }
};
const sendDonationMatchEmail = async (donorEmail, donorName, requestData) => {
    const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>🩸 Blood Match Found!</h2>
      <p>Hi ${donorName},</p>
      <p>Great news! Your blood type <strong>${donorName}'s blood group</strong> matches a request in <strong>${requestData.city}</strong>.</p>
      <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <p><strong>Request Details:</strong></p>
        <p>📍 Location: ${requestData.city}</p>
        <p>🏥 Hospital: ${requestData.hospitalName}</p>
        <p>⏰ Required Date: ${new Date(requestData.requiredDate).toLocaleDateString()}</p>
        <p>📞 Contact: ${requestData.contactPhone}</p>
      </div>
      <p>If you can help, please log in and respond to this request!</p>
      <a href="${env_1.envVars.FRONTEND_URL}/requests/${requestData.id}" style="background-color: #d32f2f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Request</a>
      <p style="margin-top: 20px; color: #666; font-size: 12px;">Thank you for being a blood donor!</p>
    </div>
  `;
    return sendEmail({ to: donorEmail, subject: '🩸 Blood Match Found - Help Needed!', html });
};
const sendDonationConfirmationEmail = async (donorEmail, donorName, donationData) => {
    const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>✅ Donation Confirmed</h2>
      <p>Hi ${donorName},</p>
      <p>Thank you for your donation! Your contribution saves lives.</p>
      <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <p><strong>Donation Details:</strong></p>
        <p>📅 Date: ${new Date(donationData.donationDate).toLocaleDateString()}</p>
        <p>🩸 Units Donated: ${donationData.unitsDonated}</p>
        <p>⏳ Status: ${donationData.status}</p>
      </div>
      <p>You can donate again after 56 days. Take care of yourself!</p>
      <a href="${env_1.envVars.FRONTEND_URL}/donations" style="background-color: #1976d2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Your Donations</a>
    </div>
  `;
    return sendEmail({ to: donorEmail, subject: '✅ Donation Confirmation', html });
};
const sendRequestCreatedEmail = async (requesterEmail, requesterName, requestData) => {
    const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>📝 Blood Request Created</h2>
      <p>Hi ${requesterName},</p>
      <p>Your blood request has been posted and is now visible to donors in your area.</p>
      <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <p><strong>Request Details:</strong></p>
        <p>🩸 Blood Type: ${requestData.bloodGroup}</p>
        <p>📍 Location: ${requestData.city}</p>
        <p>⏰ Required Date: ${new Date(requestData.requiredDate).toLocaleDateString()}</p>
        <p>📊 Units Needed: ${requestData.unitsRequired}</p>
      </div>
      <p>You'll receive notifications as donors respond to your request. Keep checking your notifications!</p>
      <a href="${env_1.envVars.FRONTEND_URL}/requests/${requestData.id}" style="background-color: #388e3c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Your Request</a>
    </div>
  `;
    return sendEmail({ to: requesterEmail, subject: '📝 Blood Request Posted Successfully', html });
};
const sendReviewNotificationEmail = async (donorEmail, donorName, reviewerName) => {
    const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>⭐ You Received a Review</h2>
      <p>Hi ${donorName},</p>
      <p>${reviewerName} has left a review for your recent donation.</p>
      <p>Thank you for being a reliable and trusted donor in our community!</p>
      <a href="${env_1.envVars.FRONTEND_URL}/profile" style="background-color: #ff9800; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Review</a>
    </div>
  `;
    return sendEmail({ to: donorEmail, subject: '⭐ You Received a Review', html });
};
exports.EmailService = {
    sendEmail,
    sendDonationMatchEmail,
    sendDonationConfirmationEmail,
    sendRequestCreatedEmail,
    sendReviewNotificationEmail
};
//# sourceMappingURL=emailService.js.map