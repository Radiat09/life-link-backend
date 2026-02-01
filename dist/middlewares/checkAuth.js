"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../config/env");
const jwt_1 = require("../utils/jwt");
const AppError_1 = require("../utils/AppError");
const prisma_1 = require("../config/prisma");
const client_1 = require("@prisma/client");
const checkAuth = (...authRoles) => async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken || req.headers.authorization;
        if (!accessToken) {
            throw new AppError_1.AppError(403, "No Token Recieved");
        }
        const verifiedToken = (0, jwt_1.verifyToken)(accessToken, env_1.envVars.JWT_ACCESS_SECRET);
        const isUserExist = await prisma_1.prisma.user.findUnique({
            where: { email: verifiedToken.email },
        });
        if (!isUserExist) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "User does not exist");
        }
        if (isUserExist.status === client_1.UserStatus.INACTIVE) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, `User is ${isUserExist.status}`);
        }
        if (isUserExist.status === client_1.UserStatus.SUSPENDED) {
            throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "User is SUSPENDED");
        }
        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError_1.AppError(403, "You are not authorized!!!");
        }
        req.user = verifiedToken;
        next();
    }
    catch (error) {
        console.log("jwt error", error);
        next(error);
    }
};
exports.checkAuth = checkAuth;
//# sourceMappingURL=checkAuth.js.map