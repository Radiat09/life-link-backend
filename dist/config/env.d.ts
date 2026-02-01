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
}
export declare const envVars: EnvConfig;
export {};
//# sourceMappingURL=env.d.ts.map