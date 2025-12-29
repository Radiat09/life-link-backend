import { User, UserStatus } from '@prisma/client';
import httpStatus from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { envVars } from '../config/env';
import { prisma } from '../config/prisma';

import { generateToken, verifyToken } from './jwt';
import { AppError } from './AppError';

export const createUserTokens = (user: Partial<User>) => {
  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES,
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES,
  );
  return { accessToken, refreshToken };
};

export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
  const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload;

  const isUserExist = await prisma.user.findUnique({
    where: {
      id: verifiedRefreshToken.userId,
      // email: verifiedRefreshToken.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User does not exist');
  }

  if (isUserExist.status === UserStatus.INACTIVE) {
    throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.status}`);
  }
  if (isUserExist.status === UserStatus.DELETED) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User does not exits anymore');
  }

  const jwtPayload = {
    email: isUserExist.email,
    role: isUserExist.role,
  };
  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES,
  );

  return {
    accessToken,
    needPasswordChange: isUserExist.needPasswordChange
  };
};
