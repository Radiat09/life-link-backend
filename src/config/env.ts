import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

interface EnvConfig {
  PORT: string;
  DATABASE_URL: string;
  NODE_ENV: "development" | "production";
  BCRYPT_SALT_ROUND: string;
  CLOUDINARY: {
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
  };
  JWT_REFRESH_EXPIRES: string;
  JWT_ACCESS_EXPIRES: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PASSWORD: string;
  OPENAI_API_KEY: string;
  STRIPE_SECRET_KEY: string;
  FRONTEND_URL: string;
  EMAIL_SENDER: {
    SMTP_USER: string;
    SMTP_PASS: string;
    SMTP_PORT: string;
    SMTP_HOST: string;
    SMTP_FROM: string;
  };
  SMS_PROVIDER: string;
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  TWILIO_PHONE_NUMBER: string;
  AWS_REGION: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  DOCUMENT_UPLOAD_PATH: string;
  MAX_FILE_SIZE: string;
  ALLOWED_FILE_TYPES: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables: string[] = [
    "PORT",
    "DATABASE_URL",
    "NODE_ENV",
    "BCRYPT_SALT_ROUND",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRES",
    "JWT_ACCESS_EXPIRES",
    "JWT_ACCESS_SECRET",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD",
    "OPENAI_API_KEY",
    "STRIPE_SECRET_KEY",
    "FRONTEND_URL",
    "SMTP_PASS",
    "SMTP_PORT",
    "SMTP_HOST",
    "SMTP_USER",
    "SMTP_FROM",
    "SMS_PROVIDER",
    "DOCUMENT_UPLOAD_PATH",
    "MAX_FILE_SIZE",
    "ALLOWED_FILE_TYPES",
  ];

  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      // SMS and AWS variables are optional (can use defaults)
      const optionalVars = ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_PHONE_NUMBER", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"];
      if (!optionalVars.includes(key)) {
        throw new Error(`Missing required environment variable ${key}`);
      }
    }
  });

  return {
    PORT: process.env.PORT as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    CLOUDINARY: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
    },
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY as string,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    EMAIL_SENDER: {
      SMTP_USER: process.env.SMTP_USER as string,
      SMTP_PASS: process.env.SMTP_PASS as string,
      SMTP_PORT: process.env.SMTP_PORT as string,
      SMTP_HOST: process.env.SMTP_HOST as string,
      SMTP_FROM: process.env.SMTP_FROM as string,
    },
    SMS_PROVIDER: process.env.SMS_PROVIDER || "console",
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || "",
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || "",
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER || "",
    AWS_REGION: process.env.AWS_REGION || "us-east-1",
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
    DOCUMENT_UPLOAD_PATH: process.env.DOCUMENT_UPLOAD_PATH || "./uploads/documents",
    MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || "5242880",
    ALLOWED_FILE_TYPES: process.env.ALLOWED_FILE_TYPES || "application/pdf,image/jpeg,image/png,image/jpg",
  };
};

export const envVars: EnvConfig = loadEnvVariables();
