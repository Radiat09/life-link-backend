// helpers/handleDuplicateError.ts
export const handlerDuplicateError = (err: any) => {
  // For Prisma P2002 error (unique constraint violation)
  const field = err.meta?.target?.[0] || "unknown field";
  const value = err.meta?.target?.[1] || "unknown value";

  return {
    statusCode: 409,
    message: `Duplicate value '${value}' for field '${field}'. This value already exists.`,
    errorSources: [
      {
        path: field,
        message: `A record with this ${field} already exists`,
      },
    ],
  };
};
