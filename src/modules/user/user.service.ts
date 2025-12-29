import { Request } from "express";
import bcrypt from "bcryptjs";
import { Prisma, UserStatus } from "@prisma/client";
import { userSearchableFields } from "./user.constant";
import { prisma } from "../../config/prisma";
import { IOptions, paginationHelper } from "../../helpers/paginationHelper";
import { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../utils/AppError";
import httpstatuscode from "http-status-codes";
import { calculateAge } from "../../utils/calculateAge";
import { createUserTokens } from "../../utils/userTokens";

const createUser = async (req: Request) => {
    const data = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (existingUser) {
        throw new AppError(httpstatuscode.CONFLICT, 'User with this email already exists');
    }

    // Calculate age from date of birth
    const age = calculateAge(new Date(data.dateOfBirth));

    // Validate age for donors
    if (data.role === 'DONOR' && (age < 18 || age > 65)) {
        throw new AppError(httpstatuscode.BAD_REQUEST, 'Donors must be between 18 and 65 years old');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user transaction
    const result = await prisma.$transaction(async (tx) => {
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
        const tokens = createUserTokens(user);

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
}

const getAllFromDB = async (params: any, options: IOptions) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options)
    const { searchTerm, ...filterData } = params;

    const andConditions: Prisma.UserWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: userSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    }

    const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {}

    const result = await prisma.user.findMany({
        skip,
        take: limit,

        where: whereConditions,
        orderBy: {
            [sortBy]: sortOrder
        }
    });

    const total = await prisma.user.count({
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
}

const getMyProfile = async (user: JwtPayload) => {
    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: UserStatus.ACTIVE
        },
        select: {
            id: true,
            email: true,
            needPassChange: true,
            role: true,
            status: true,
            profile: true
        }
    })

    return userInfo
};

const changeProfileStatus = async (id: string, payload: { status: UserStatus }) => {
    await prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    })

    const updateUserStatus = await prisma.user.update({
        where: {
            id
        },
        data: payload
    })

    return updateUserStatus;
};

const updateMyProfie = async (user: JwtPayload, req: Request) => {
    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            email: user?.email,
            status: UserStatus.ACTIVE
        }
    });

    const file = req.file;
    if (file) {
        // const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        // req.body.profilePhoto = uploadToCloudinary?.secure_url;
    }

    let profileInfo;



    // return { ...profileInfo };
}

export const UserService = {
    createUser,
    getAllFromDB,
    getMyProfile,
    changeProfileStatus,
    updateMyProfie
}