import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookie";
import { AuthService } from "./auth.service";
import { AppError } from "../../utils/AppError";

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);

  setAuthCookie(res, {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Logged in successfully",
    data: {
      needPasswordChange: result.needPasswordChange,
    }
  });
});


const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "No refresh token recieved from cookies"
    );
  }

  const result = await AuthService.refreshToken(refreshToken);
  res.cookie("accessToken", result.accessToken, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token genereated successfully!",
    data: {
      message: "Access token genereated successfully!",
    },
  });
});

const changePassword = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;

    const result = await AuthService.changePassword(user, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password Changed successfully",
      data: result,
    });
  }
);

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  await AuthService.forgotPassword(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Check your email!",
    data: null,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || req.cookies.accessToken;
  if (!token) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "No token recieved from cookies"
    );
  }


  await AuthService.resetPassword(token, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password Reset!",
    data: null,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user
  const result = await AuthService.getMe(decodedToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrive successfully!",
    data: result,
  });
});

export const authController = {
  login,
  refreshToken,
  changePassword,
  resetPassword,
  forgotPassword,
  getMe
};
