"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const setCookie_1 = require("../../utils/setCookie");
const auth_service_1 = require("./auth.service");
const AppError_1 = require("../../utils/AppError");
const login = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.AuthService.login(req.body);
    (0, setCookie_1.setAuthCookie)(res, {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Logged in successfully",
        data: {
            needPasswordChange: result.needPasswordChange,
        }
    });
});
const refreshToken = (0, catchAsync_1.default)(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "No refresh token recieved from cookies");
    }
    const result = await auth_service_1.AuthService.refreshToken(refreshToken);
    res.cookie("accessToken", result.accessToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Access token genereated successfully!",
        data: {
            message: "Access token genereated successfully!",
        },
    });
});
const changePassword = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await auth_service_1.AuthService.changePassword(user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Password Changed successfully",
        data: result,
    });
});
const forgotPassword = (0, catchAsync_1.default)(async (req, res) => {
    await auth_service_1.AuthService.forgotPassword(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Check your email!",
        data: null,
    });
});
const resetPassword = (0, catchAsync_1.default)(async (req, res) => {
    const token = req.headers.authorization || req.cookies.accessToken;
    if (!token) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "No token recieved from cookies");
    }
    await auth_service_1.AuthService.resetPassword(token, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Password Reset!",
        data: null,
    });
});
const getMe = (0, catchAsync_1.default)(async (req, res) => {
    const decodedToken = req.user;
    const result = await auth_service_1.AuthService.getMe(decodedToken);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User retrive successfully!",
        data: result,
    });
});
const sendEmailVerification = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await auth_service_1.AuthService.sendEmailVerification(user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: null,
    });
});
const verifyEmail = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.AuthService.verifyEmail(req.body.token);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: null,
    });
});
const sendPhoneVerification = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await auth_service_1.AuthService.sendPhoneVerification(user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: null,
    });
});
const verifyPhone = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await auth_service_1.AuthService.verifyPhone(user.id, req.body.code);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: null,
    });
});
exports.authController = {
    login,
    refreshToken,
    changePassword,
    resetPassword,
    forgotPassword,
    getMe,
    sendEmailVerification,
    verifyEmail,
    sendPhoneVerification,
    verifyPhone
};
//# sourceMappingURL=auth.controller.js.map