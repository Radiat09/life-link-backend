import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { verifyToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";
import { prisma } from "../config/prisma";
import { UserStatus } from "@prisma/client";


export const checkAuth =
  (...authRoles: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const accessToken = req.cookies.accessToken || req.headers.authorization;

        if (!accessToken) {
          throw new AppError(403, "No Token Recieved");
        }

        const verifiedToken = verifyToken(
          accessToken,
          envVars.JWT_ACCESS_SECRET
        ) as JwtPayload;


        const isUserExist = await prisma.user.findUnique({
          where: { email: verifiedToken.email },
        });

        if (!isUserExist) {
          throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
        }

        if (isUserExist.status === UserStatus.INACTIVE) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            `User is ${isUserExist.status}`
          );
        }
        if (isUserExist.status === UserStatus.SUSPENDED) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            "User is SUSPENDED"
          );
        }

        if (!authRoles.includes(verifiedToken.role)) {
          throw new AppError(403, "You are not authorized!!!");
        }
        req.user = verifiedToken;
        next();
      } catch (error) {
        console.log("jwt error", error);
        next(error);
      }
    };
