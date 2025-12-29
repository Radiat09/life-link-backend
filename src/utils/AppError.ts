import { TErrorSources } from "../interfaces/error.types";

export class AppError extends Error {
  public statusCode: number;
  public errorSources?: TErrorSources[];

  constructor(
    statusCode: number,
    message: string,
    errorSources?: TErrorSources[],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorSources = errorSources;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
