import { Request, Response } from "express";
import { UserService } from "./user.service";
import { userFilterableFields } from "./user.constant";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import pick from "../../helpers/pick";
import { JwtPayload } from "jsonwebtoken";

const createPatient = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createPatient(req);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Patient created successfully!",
        data: result
    })
})

const createAdmin = catchAsync(async (req: Request, res: Response) => {

    const result = await UserService.createAdmin(req);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Admin Created successfuly!",
        data: result
    })
});

const createDoctor = catchAsync(async (req: Request, res: Response) => {

    const result = await UserService.createDoctor(req);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Doctor Created successfuly!",
        data: result
    })
});

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

const getMyProfile = catchAsync(async (req: Request & { user?: JwtPayload }, res: Response) => {

    const user = req.user;

    const result = await UserService.getMyProfile(user);

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

const updateMyProfie = catchAsync(async (req: Request & { user?: JwtPayload }, res: Response) => {

    const user = req.user;

    const result = await UserService.updateMyProfie(user, req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My profile updated!",
        data: result
    })
});

export const UserController = {
    createPatient,
    createAdmin,
    createDoctor,
    getAllFromDB,
    getMyProfile,
    changeProfileStatus,
    updateMyProfie
}