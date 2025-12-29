// helpers/handleMulterError.ts
import {
  TErrorSources,
  TGenericErrorResponse,
} from "../interfaces/error.types";

export const handleMulterError = (err: any): TGenericErrorResponse => {
  const errorSources: TErrorSources[] = [];
  let message = "File upload error";
  let statusCode = 400;

  switch (err.code) {
    case "LIMIT_FILE_SIZE":
      message = "File too large";
      errorSources.push({
        path: "file",
        message: "File size exceeds the allowed limit",
      });
      statusCode = 413;
      break;

    case "LIMIT_FILE_COUNT":
      message = "Too many files";
      errorSources.push({
        path: "files",
        message: "Too many files uploaded",
      });
      break;

    case "LIMIT_UNEXPECTED_FILE":
      message = "Unexpected file field";
      errorSources.push({
        path: err.field || "file",
        message: "Unexpected file field in request",
      });
      break;

    case "LIMIT_PART_COUNT":
      message = "Too many form parts";
      errorSources.push({
        path: "form",
        message: "Too many form parts in request",
      });
      break;

    case "LIMIT_FIELD_KEY":
      message = "Field name too long";
      errorSources.push({
        path: "field",
        message: "Field name is too long",
      });
      break;

    case "LIMIT_FIELD_VALUE":
      message = "Field value too long";
      errorSources.push({
        path: err.field || "field",
        message: "Field value is too long",
      });
      break;

    case "LIMIT_FIELD_COUNT":
      message = "Too many fields";
      errorSources.push({
        path: "fields",
        message: "Too many fields in form",
      });
      break;

    default:
      message = "File upload failed";
      errorSources.push({
        path: "file",
        message: err.message || "Unknown file upload error",
      });
  }

  return {
    statusCode,
    message,
    errorSources,
  };
};
