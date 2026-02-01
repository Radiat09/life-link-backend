"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const user_constant_1 = require("./user.constant");
const prisma_1 = require("../../config/prisma");
const paginationHelper_1 = require("../../helpers/paginationHelper");
const AppError_1 = require("../../utils/AppError");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const calculateAge_1 = require("../../utils/calculateAge");
const userTokens_1 = require("../../utils/userTokens");
const multer_config_1 = require("../../config/multer.config");
const createUser = async (req) => {
    const data = req.body;
    // Check if user already exists
    const existingUser = await prisma_1.prisma.user.findUnique({
        where: { email: data.email },
    });
    if (existingUser) {
        throw new AppError_1.AppError(http_status_codes_1.default.CONFLICT, 'User with this email already exists');
    }
    // Calculate age from date of birth
    const age = (0, calculateAge_1.calculateAge)(new Date(data.dateOfBirth));
    // Validate age for donors
    if (data.role === 'USER' && (age < 18 || age > 65)) {
        throw new AppError_1.AppError(http_status_codes_1.default.BAD_REQUEST, 'Users must be between 18 and 65 years old');
    }
    // Hash password
    const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
    // Create user transaction
    const result = await prisma_1.prisma.$transaction(async (tx) => {
        // Create user
        const user = await tx.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                role: data.role,
            },
        });
        // Create profile
        const profile = await tx.profile.create({
            data: {
                userId: user.id,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                bloodGroup: data.bloodGroup,
                dateOfBirth: new Date(data.dateOfBirth),
                city: data.city,
                division: data.division,
                address: data.address,
                country: data.country || 'Bangladesh', // Default for now
            },
        });
        // Generate tokens
        const tokens = (0, userTokens_1.createUserTokens)(user);
        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                profile: {
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    bloodGroup: profile.bloodGroup,
                    city: profile.city,
                },
            },
            tokens,
        };
    });
    return result;
};
const getAllFromDB = async (params, options) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = params;
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: user_constant_1.userSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        });
    }
    const whereConditions = andConditions.length > 0 ? {
        AND: andConditions
    } : {};
    const result = await prisma_1.prisma.user.findMany({
        skip,
        take: limit,
        where: whereConditions,
        orderBy: {
            [sortBy]: sortOrder
        }
    });
    const total = await prisma_1.prisma.user.count({
        where: whereConditions
    });
    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
};
const getMyProfile = async (user) => {
    const userInfo = await prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.ACTIVE
        },
        select: {
            id: true,
            email: true,
            needPassChange: true,
            role: true,
            status: true,
            profile: true
        }
    });
    return userInfo;
};
const changeProfileStatus = async (id, payload) => {
    await prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    });
    const updateUserStatus = await prisma_1.prisma.user.update({
        where: {
            id
        },
        data: payload
    });
    return updateUserStatus;
};
const updateMyProfile = async (req) => {
    const user = req.user;
    // 1. Verify user exists and get their ID
    const userInfo = await prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            email: user?.email,
            status: client_1.UserStatus.ACTIVE
        }
    });
    // 2. Handle File Upload
    const file = req.file;
    if (file) {
        const uploadToCloudinary = await multer_config_1.FileUploadService.uploadSingleFile(file.buffer, file.originalname);
        // Map the cloudinary URL to the 'avatar' field in your Profile model
        req.body.avatar = uploadToCloudinary?.data?.secure_url;
    }
    // 3. Extract data from body
    // We separate email/status if you want to prevent users from changing them via this route
    const { firstName, lastName, phone, avatar, bio, gender, weight, isAvailable, division, city, address } = req.body;
    // 4. Nested Update
    const updatedUser = await prisma_1.prisma.user.update({
        where: {
            id: userInfo.id
        },
        data: {
            profile: {
                upsert: {
                    // What to do if the profile ALREADY exists
                    update: {
                        firstName,
                        lastName,
                        phone,
                        avatar,
                        bio,
                        gender,
                        weight: weight ? parseFloat(weight) : undefined,
                        isAvailable,
                        division,
                        city,
                        address
                    },
                    // What to do if the profile DOES NOT exist
                    create: {
                        firstName: firstName ?? "", // Provide defaults for required fields
                        lastName: lastName ?? "",
                        phone: phone ?? "",
                        bloodGroup: req.body.bloodGroup || "O_POSITIVE", // Required in schema
                        dateOfBirth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : new Date(),
                        city: city ?? "",
                        division: division ?? "",
                        avatar,
                        bio,
                        gender,
                        weight: weight ? parseFloat(weight) : undefined,
                    }
                }
            }
        },
        include: { profile: true }
    });
    return updatedUser;
};
exports.UserService = {
    createUser,
    getAllFromDB,
    getMyProfile,
    changeProfileStatus,
    updateMyProfile
};
//# sourceMappingURL=user.service.js.map