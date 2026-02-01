"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_1 = __importDefault(require("http-status"));
const env_1 = require("../../config/env");
const jwt_1 = require("../../utils/jwt");
const userTokens_1 = require("../../utils/userTokens");
const emailSender_1 = __importDefault(require("./emailSender"));
const AppError_1 = require("../../utils/AppError");
const prisma_1 = require("../../config/prisma");
const client_1 = require("@prisma/client");
const login = async (payload) => {
    const user = await prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const isCorrectPasswrd = await bcryptjs_1.default.compare(payload.password, user.password);
    if (!isCorrectPasswrd) {
        throw new AppError_1.AppError(401, "Password is incorrect");
    }
    const userTokens = (0, userTokens_1.createUserTokens)(user);
    return {
        ...userTokens,
        needPasswordChange: user.needPassChange,
    };
};
const refreshToken = async (token) => {
    const newAccessToken = await (0, userTokens_1.createNewAccessTokenWithRefreshToken)(token);
    return {
        ...newAccessToken
    };
};
const changePassword = async (user, payload) => {
    const userData = await prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.ACTIVE
        }
    });
    const isCorrectPassword = await bcryptjs_1.default.compare(payload.oldPassword, userData.password);
    if (!isCorrectPassword) {
        throw new Error("Password incorrect!");
    }
    const hashedPassword = await bcryptjs_1.default.hash(payload.newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    await prisma_1.prisma.user.update({
        where: {
            email: userData.email
        },
        data: {
            password: hashedPassword,
            needPassChange: false
        }
    });
    return {
        message: "Password changed successfully!"
    };
};
const forgotPassword = async (payload) => {
    const userData = await prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE
        }
    });
    const resetPassToken = (0, jwt_1.generateToken)({ email: userData.email, role: userData.role }, env_1.envVars.JWT_ACCESS_SECRET, env_1.envVars.JWT_ACCESS_EXPIRES);
    const resetPassLink = `${env_1.envVars.FRONTEND_URL}/reset-password?id=${userData.id}&token=${resetPassToken}`;
    // await emailSender(
    //   userData.email,
    //   `
    //       <div>
    //           <p>Dear User,</p>
    //           <p>Your password reset link
    //               <a href=${resetPassLink}>
    //                   <button>
    //                       Reset Password
    //                   </button>
    //               </a>
    //           </p>
    //       </div>
    //       `
    // )
    await (0, emailSender_1.default)(userData.email, `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            }
            
            body {
                background-color: #f5f5f5;
                padding: 20px;
                line-height: 1.6;
                color: #333;
            }
            
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 32px 24px;
                text-align: center;
            }
            
            .logo {
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 8px;
            }
            
            .content {
                padding: 40px 32px;
            }
            
            .greeting {
                font-size: 18px;
                margin-bottom: 24px;
                color: #333;
            }
            
            .instructions {
                color: #666;
                margin-bottom: 32px;
                font-size: 16px;
            }
            
            .reset-button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-decoration: none;
                padding: 16px 32px;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                text-align: center;
                transition: transform 0.2s, box-shadow 0.2s;
                margin: 24px 0;
                border: none;
                cursor: pointer;
            }
            
            .reset-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
            }
            
            .link-alternative {
                margin: 24px 0;
                padding: 16px;
                background-color: #f8f9fa;
                border-radius: 6px;
                border-left: 4px solid #667eea;
            }
            
            .link-text {
                word-break: break-all;
                color: #666;
                font-size: 14px;
                font-family: monospace;
            }
            
            .warning {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 6px;
                padding: 16px;
                margin: 24px 0;
                font-size: 14px;
                color: #856404;
            }
            
            .warning strong {
                display: block;
                margin-bottom: 8px;
            }
            
            .footer {
                background-color: #f8f9fa;
                padding: 24px;
                text-align: center;
                color: #666;
                font-size: 14px;
                border-top: 1px solid #e9ecef;
            }
            
            .expiry-notice {
                color: #e74c3c;
                font-weight: 600;
                margin: 16px 0;
            }
            
            .support {
                margin-top: 24px;
                font-size: 14px;
                color: #666;
            }
            
            @media (max-width: 600px) {
                .content {
                    padding: 24px 20px;
                }
                
                .reset-button {
                    display: block;
                    width: 100%;
                }
                
                .header {
                    padding: 24px 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <div class="logo">YourApp</div>
                <h1>Password Reset</h1>
            </div>
            
            <div class="content">
                <p class="greeting">Hi ${'there'},</p>
                
                <p class="instructions">We received a request to reset your password. Click the button below to create a new password:</p>
                
                <div style="text-align: center;">
                    <a href="${resetPassLink}" class="reset-button">
                        Reset Password
                    </a>
                </div>
                
                <p class="expiry-notice">This link will expire in 1 hour</p>
                
                <div class="link-alternative">
                    <p style="margin-bottom: 8px; font-weight: 600;">Or copy and paste this link:</p>
                    <p class="link-text">${resetPassLink}</p>
                </div>
                
                <div class="warning">
                    <strong>⚠️ Security Notice:</strong>
                    <p>If you didn't request this password reset, please ignore this email or contact support if you're concerned about your account security.</p>
                </div>
                
                <div class="support">
                    <p>Need help? Contact our support team at <a href="mailto:support@yourapp.com">support@yourapp.com</a></p>
                </div>
            </div>
            
            <div class="footer">
                <p>© ${new Date().getFullYear()} YourApp. All rights reserved.</p>
                <p style="margin-top: 8px; font-size: 12px;">
                    This is an automated message, please do not reply to this email.
                </p>
            </div>
        </div>
    </body>
    </html>
    `);
};
const resetPassword = async (token, payload) => {
    const userData = await prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: client_1.UserStatus.ACTIVE
        }
    });
    const isValidToken = (0, jwt_1.verifyToken)(token, env_1.envVars.JWT_REFRESH_SECRET);
    if (!isValidToken) {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "Forbidden!");
    }
    // hash password
    const password = await bcryptjs_1.default.hash(payload.password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    // update into database
    await prisma_1.prisma.user.update({
        where: {
            id: payload.id
        },
        data: {
            password
        }
    });
};
const getMe = async (decodedData) => {
    const userData = await prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: client_1.UserStatus.ACTIVE
        }
    });
    const { id, email, role, needPassChange } = userData;
    return {
        id,
        email,
        role,
        needPassChange
    };
};
exports.AuthService = {
    login,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
    getMe
};
//# sourceMappingURL=auth.service.js.map