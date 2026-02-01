import { envVars } from "../config/env";
import twilio from "twilio";

// SMS Service - Currently console-based, ready for Twilio/AWS SNS integration
interface SMSProvider {
  sendOTP(phoneNumber: string, otp: string): Promise<void>;
  sendNotification(phoneNumber: string, message: string): Promise<void>;
}

class TwilioSMSProvider implements SMSProvider {
  private accountSid: string;
  private authToken: string;
  private fromNumber: string;
  private client: any;

  constructor() {
    this.accountSid = envVars.TWILIO_ACCOUNT_SID || '';
    this.authToken = envVars.TWILIO_AUTH_TOKEN || '';
    this.fromNumber = envVars.TWILIO_PHONE_NUMBER || '';

    // Initialize Twilio client if credentials are available
    if (this.accountSid && this.authToken) {
      try {

        this.client = twilio(this.accountSid, this.authToken);
      } catch (error) {
        console.warn('Twilio not installed or configured. SMS will be logged to console.');
        this.client = null;
      }
    }
  }

  async sendOTP(phoneNumber: string, otp: string): Promise<void> {
    const message = `Your LifeLink verification code is: ${otp}. Valid for 10 minutes.`;
    await this.sendSMS(phoneNumber, message);
  }

  async sendNotification(phoneNumber: string, message: string): Promise<void> {
    await this.sendSMS(phoneNumber, message);
  }

  private async sendSMS(phoneNumber: string, message: string): Promise<void> {

    console.log("Log from send sms class", phoneNumber);
    if (this.client) {
      try {
        await this.client.messages.create({
          body: message,
          from: this.fromNumber,
          to: phoneNumber,
        });
        console.log(`[SMS] Sent to ${phoneNumber}: ${message}`);
      } catch (error) {
        console.error(`[SMS Error] Failed to send SMS to ${phoneNumber}:`, error);
        // Fallback to console logging
        this.logToConsole(phoneNumber, message);
      }
    } else {
      // Fallback to console logging when Twilio is not configured
      this.logToConsole(phoneNumber, message);
    }
  }

  private logToConsole(phoneNumber: string, message: string): void {
    console.log(`
    ╔════════════════════════════════════════════════════════════╗
    ║                    📱 SMS SIMULATION                        ║
    ╠════════════════════════════════════════════════════════════╣
    ║ To: ${phoneNumber.padEnd(50)} ║
    ║ Message: ${message.substring(0, 45).padEnd(45)} ║
    ${message.length > 45 ? `║          ${message.substring(45).padEnd(45)} ║\n` : ''}    ╚════════════════════════════════════════════════════════════╝
    `);
  }
}

class AWSSNSSMSProvider implements SMSProvider {
  private client: any;

  constructor() {
    try {
      const AWS = require('aws-sdk');
      this.client = new AWS.SNS({
        region: envVars.AWS_REGION || 'us-east-1',
        accessKeyId: envVars.AWS_ACCESS_KEY_ID,
        secretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
      });
    } catch (error) {
      console.warn('AWS SDK not installed or configured. SMS will be logged to console.');
      this.client = null;
    }
  }

  async sendOTP(phoneNumber: string, otp: string): Promise<void> {
    const message = `Your LifeLink verification code is: ${otp}. Valid for 10 minutes.`;
    await this.sendSMS(phoneNumber, message);
  }

  async sendNotification(phoneNumber: string, message: string): Promise<void> {
    await this.sendSMS(phoneNumber, message);
  }

  private async sendSMS(phoneNumber: string, message: string): Promise<void> {
    if (this.client) {
      try {
        const params = {
          Message: message,
          PhoneNumber: phoneNumber,
        };
        await this.client.publish(params).promise();
        console.log(`[SMS via AWS SNS] Sent to ${phoneNumber}: ${message}`);
      } catch (error) {
        console.error(`[SMS Error] Failed to send SMS via AWS SNS to ${phoneNumber}:`, error);
        this.logToConsole(phoneNumber, message);
      }
    } else {
      this.logToConsole(phoneNumber, message);
    }
  }

  private logToConsole(phoneNumber: string, message: string): void {
    console.log(`
    ╔════════════════════════════════════════════════════════════╗
    ║                    📱 SMS SIMULATION                        ║
    ╠════════════════════════════════════════════════════════════╣
    ║ To: ${phoneNumber.padEnd(50)} ║
    ║ Message: ${message.substring(0, 45).padEnd(45)} ║
    ${message.length > 45 ? `║          ${message.substring(45).padEnd(45)} ║\n` : ''}    ╚════════════════════════════════════════════════════════════╝
    `);
  }
}

// Initialize based on configuration
const getSMSProvider = (): SMSProvider => {
  const provider = envVars.SMS_PROVIDER || 'console';

  switch (provider.toLowerCase()) {
    case 'twilio':
      return new TwilioSMSProvider();
    case 'aws':
    case 'sns':
      return new AWSSNSSMSProvider();
    case 'console':
    default:
      return new TwilioSMSProvider(); // Falls back to console logging
  }
};

export const smsService = getSMSProvider();
