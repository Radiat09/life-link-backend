// helpers/handlePrismaValidationError.ts
import {
  TErrorSources,
  TGenericErrorResponse,
} from "../interfaces/error.types";

export const handlePrismaValidationError = (
  err: any
): TGenericErrorResponse => {
  const errorSources: TErrorSources[] = [];

  // Handle Prisma specific validation errors
  if (err.meta && err.meta.target) {
    errorSources.push({
      path: err.meta.target.join("."),
      message: `Validation failed for fields: ${err.meta.target.join(", ")}`,
    });
  } else {
    errorSources.push({
      path: "unknown",
      message: "Database validation error occurred",
    });
  }

  return {
    statusCode: 400,
    message: "Database Validation Error",
    errorSources,
  };
};
