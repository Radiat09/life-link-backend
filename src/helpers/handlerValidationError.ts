import {
  TErrorSources,
  TGenericErrorResponse,
} from "../interfaces/error.types";
import { Prisma } from "@prisma/client";

export const handlerValidationError = (
  err: Prisma.PrismaClientKnownRequestError
): TGenericErrorResponse => {
  const errorSources: TErrorSources[] = [];

  // Handle different Prisma error codes
  switch (err.code) {
    case "P2002": // Unique constraint violation
      const field = (err.meta?.target as string[])?.join(", ") || "field";
      errorSources.push({
        path: field,
        message: `${field} must be unique`,
      });
      break;

    case "P2003": // Foreign key constraint violation
      errorSources.push({
        path: "foreign_key",
        message: "Foreign key constraint failed",
      });
      break;

    case "P2025": // Record not found
      errorSources.push({
        path: "record",
        message: "Record not found",
      });
      break;

    default:
      errorSources.push({
        path: "unknown",
        message: err.message || "Validation error occurred",
      });
  }

  return {
    statusCode: 400,
    message: "Validation Error",
    errorSources,
  };
};
