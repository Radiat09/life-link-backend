"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewAccessTokenWithRefreshToken = exports.createUserTokens = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../config/env");
const prisma_1 = require("../config/prisma");
const jwt_1 = require("./jwt");
const AppError_1 = require("./AppError");
const createUserTokens = (user) => {
    const jwtPayload = {
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, jwt_1.generateToken)(jwtPayload, env_1.envVars.JWT_ACCESS_SECRET, env_1.envVars.JWT_ACCESS_EXPIRES);
    const refreshToken = (0, jwt_1.generateToken)(jwtPayload, env_1.envVars.JWT_REFRESH_SECRET, env_1.envVars.JWT_REFRESH_EXPIRES);
    return { accessToken, refreshToken };
};
exports.createUserTokens = createUserTokens;
const createNewAccessTokenWithRefreshToken = async (refreshToken) => {
    const verifiedRefreshToken = (0, jwt_1.verifyToken)(refreshToken, env_1.envVars.JWT_REFRESH_SECRET);
    const isUserExist = await prisma_1.prisma.user.findUnique({
        where: {
            id: verifiedRefreshToken.userId,
            email: verifiedRefreshToken.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    if (!isUserExist) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, 'User does not exist');
    }
    if (isUserExist.status === client_1.UserStatus.INACTIVE) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, `User is ${isUserExist.status}`);
    }
    if (isUserExist.status === client_1.UserStatus.DELETED) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, 'User does not exits anymore');
    }
    if (isUserExist.status === client_1.UserStatus.SUSPENDED) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, 'User is SUSPENDED. Please contact support.');
    }
    const jwtPayload = {
        email: isUserExist.email,
        role: isUserExist.role,
    };
    const accessToken = (0, jwt_1.generateToken)(jwtPayload, env_1.envVars.JWT_ACCESS_SECRET, env_1.envVars.JWT_ACCESS_EXPIRES);
    return {
        accessToken,
        needPasswordChange: isUserExist.needPassChange
    };
};
exports.createNewAccessTokenWithRefreshToken = createNewAccessTokenWithRefreshToken;
//# sourceMappingURL=userTokens.js.map