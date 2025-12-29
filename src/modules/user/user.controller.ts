import { Request, Response } from "express";
import { UserService } from "./user.service";
import { userFilterableFields } from "./user.constant";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import pick from "../../helpers/pick";
import { JwtPayload } from "jsonwebtoken";
import { setAuthCookie } from "../../utils/setCookie";
import { envVars } from "../../config/env";

const createUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createUser(req);
    setAuthCookie(res, {
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
    });
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "User created successfully!",
        data: envVars.NODE_ENV === "development" ? result.user : null
    })
})

// const createAdmin = catchAsync(async (req: Request, res: Response) => {

//     const result = await UserService.createAdmin(req);
//     sendResponse(res, {
//         statusCode: 201,
//         success: true,
//         message: "Admin Created successfuly!",
//         data: result
//     })
// });

// const createDoctor = catchAsync(async (req: Request, res: Response) => {

//     const result = await UserService.createDoctor(req);
//     sendResponse(res, {
//         statusCode: 201,
//         success: true,
//         message: "Doctor Created successfuly!",
//         data: result
//     })
// });

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, userFilterableFields) // searching , filtering
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]) // pagination and sorting

    const result = await UserService.getAllFromDB(filters, options);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User retrive successfully!",
        meta: result.meta,
        data: result.data
    })
})

const getMyProfile = catchAsync(async (req: Request, res: Response) => {

    const result = await UserService.getMyProfile(req.user);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My profile data fetched!",
        data: result
    })
});

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;
    const result = await UserService.changeProfileStatus(id, req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users profile status changed!",
        data: result
    })
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {

    const result = await UserService.updateMyProfile(req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My profile updated!",
        data: result
    })
});

export const UserController = {
    createUser,
    getAllFromDB,
    getMyProfile,
    changeProfileStatus,
    updateMyProfile
}