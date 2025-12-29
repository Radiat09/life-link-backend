import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { MulterError } from 'multer';
import { AppError } from '../utils/AppError';


const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);

  let statusCode: number = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let success = false;
  let message = err.message || 'Something went wrong!';
  let error = err;

  // Handle AppError instances
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    error = err.errorSources || err;
  }
  // Prisma Known Request Errors
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const { modelName, cause, target, field_name } = err.meta || {};

    if (err.code === 'P2002') {
      // Unique constraint violation
      const field = (target as string[])?.[0] || 'unknown';
      message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
      error = {
        model: modelName,
        field,
        constraint: 'unique',
        details: `A ${(modelName as string)?.toLowerCase() || 'record'
          } with this ${field} already exists`,
        ...((target && { target }) as object),
      };
      statusCode = httpStatus.CONFLICT;
    } else if (err.code === 'P1000') {
      // Authentication failed
      message = 'Database authentication failed';
      error = {
        type: 'authentication',
        details: 'Unable to authenticate with the database server',
        suggestion: 'Check database credentials and connection settings',
      };
      statusCode = httpStatus.BAD_GATEWAY;
    } else if (err.code === 'P2003') {
      // Foreign key constraint failed
      const field = field_name || 'unknown';
      message = `Invalid ${field} reference`;
      error = {
        model: modelName,
        field,
        constraint: 'foreign_key',
        details: `The referenced record does not exist`,
        ...((field_name && { field_name }) as object),
      };
      statusCode = httpStatus.BAD_REQUEST;
    } else if (err.code === 'P2025') {
      // Record not found - Enhanced field detection
      const fieldInfo = extractFieldFromP2025Error(err, req);
      message = `${modelName || 'Record'} not found`;
      error = {
        model: modelName,
        ...fieldInfo,
        details: getP2025Details(modelName as string, fieldInfo.field),
        suggestion: 'Please check the search criteria and try again',
      };
      statusCode = httpStatus.NOT_FOUND;
    } else if (err.code === 'P2018') {
      // Required relation violation
      message = 'Required relationship not found';
      error = {
        model: modelName,
        type: 'relation',
        details: 'The required connected records were not found',
        suggestion: 'Ensure all required related records exist before creating this record',
      };
      statusCode = httpStatus.BAD_REQUEST;
    } else if (err.code === 'P2020') {
      // Value out of range
      const field = target || 'unknown';
      message = `Value out of range for ${field}`;
      error = {
        model: modelName,
        field,
        type: 'range_error',
        details: `The value provided for ${field} is too large for its data type`,
        ...((target && { target }) as object),
      };
      statusCode = httpStatus.BAD_REQUEST;
    } else if (err.code === 'P2000') {
      // Value too long for column
      const field = target || 'unknown';
      message = `Value too long for ${field}`;
      error = {
        model: modelName,
        field,
        type: 'length_error',
        details: `The value provided for ${field} exceeds the maximum allowed length`,
        ...((target && { target }) as object),
      };
      statusCode = httpStatus.BAD_REQUEST;
    } else if (err.code === 'P2001') {
      // Record does not exist
      message = `${modelName || 'Record'} does not exist`;
      error = {
        model: modelName,
        details: 'The record you are trying to access does not exist',
        suggestion: 'Verify the record exists before performing this operation',
      };
      statusCode = httpStatus.NOT_FOUND;
    } else if (err.code === 'P2006') {
      // Invalid value provided
      message = 'Invalid value provided';
      error = {
        model: modelName,
        type: 'validation',
        details: 'The provided value is not valid for this field',
        suggestion: 'Check the data type and constraints for this field',
      };
      statusCode = httpStatus.BAD_REQUEST;
    } else if (err.code === 'P2024') {
      // Database operation timeout
      message = 'Database operation timed out';
      error = {
        type: 'timeout',
        details: 'The database operation took too long to complete',
        suggestion: 'Try again later or optimize your query',
      };
      statusCode = httpStatus.REQUEST_TIMEOUT;
    } else if (err.code === 'P2028') {
      // Transaction error
      message = 'Database transaction failed';
      error = {
        type: 'transaction',
        details: 'A database transaction error occurred',
        suggestion: 'The operation may have been partially applied. Please verify the results.',
      };
      statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    } else {
      // Handle other Prisma errors generically
      message = `Database error: ${err.code}`;
      error = {
        code: err.code,
        model: modelName,
        details: cause || 'An unexpected database error occurred',
        ...(err.meta && { meta: err.meta }),
      };
      statusCode = httpStatus.BAD_REQUEST;
    }
  }
  // ... rest of your error handlers remain the same
  // Prisma Validation Error
  else if (err instanceof Prisma.PrismaClientValidationError) {
    message = 'Database validation error';
    error = {
      type: 'validation',
      details: 'The provided data does not match the database schema',
      suggestion: 'Check all required fields and data types',
      originalMessage: err.message,
    };
    statusCode = httpStatus.BAD_REQUEST;
  }
  // Prisma Unknown Request Error
  else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    message = 'Unknown database error occurred';
    error = {
      type: 'unknown',
      details: 'An unexpected database error occurred',
      originalMessage: err.message,
    };
    statusCode = httpStatus.BAD_REQUEST;
  }
  // Prisma Initialization Error
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    message = 'Database connection failed';
    error = {
      type: 'initialization',
      details: 'Unable to initialize database connection',
      originalMessage: err.message,
      errorCode: err.errorCode,
    };
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  }
  // Multer Errors (file upload)
  // Handle OpenAI/OpenRouter API Errors
  // if (err instanceof OpenAI.APIError) {
  //   statusCode = err.status || 500;
  //   message = `AI Service Error: ${err.message}`;
  //   error = {
  //     code: err.code,
  //     type: err.type,
  //     param: err.param,
  //     status: err.status
  //   };

  //   // Specific handling for different OpenAI error types
  //   switch (err.status) {
  //     case 401:
  //       message = 'AI Service Authentication Failed: Invalid API Key';
  //       break;
  //     case 403:
  //       message = 'AI Service Access Denied: Check your permissions';
  //       break;
  //     case 429:
  //       message = 'AI Service Rate Limit Exceeded: Too many requests';
  //       break;
  //     case 500:
  //       message = 'AI Service Internal Error: Please try again later';
  //       break;
  //     case 503:
  //       message = 'AI Service Unavailable: Service is overloaded';
  //       break;
  //   }
  // }

  // Handle Multer Errors (with safe code check)
  else if (err instanceof MulterError ||
    (err.code && typeof err.code === 'string' && err.code.startsWith('MULTER_'))) {
    statusCode = 400;
    message = `File Upload Error: ${err.message}`;

    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        message = 'File too large: Please upload a smaller file';
        break;
      case 'LIMIT_FILE_COUNT':
        message = 'Too many files: Please upload fewer files';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Unexpected file field: Please check your file upload';
        break;
    }
  } else if (err.code === 'LIMIT_FILE_COUNT') {
    message = 'Too many files';
    error = {
      type: 'file_count',
      details: 'Too many files were uploaded in a single request',
      suggestion: 'Reduce the number of files and try again',
    };
    statusCode = httpStatus.BAD_REQUEST;
  } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    message = 'Unexpected file field';
    error = {
      type: 'file_field',
      details: 'A file was uploaded with an unexpected field name',
      suggestion: 'Check the form field names for file uploads',
    };
    statusCode = httpStatus.BAD_REQUEST;
  }



  res.status(statusCode).json({
    success,
    message,
    error,
  });
};

// Enhanced field extraction for P2025 errors
function extractFieldFromP2025Error(err: any, req: Request): { field?: string; value?: string } {
  const { modelName, cause } = err.meta || {};

  // Try to extract from URL parameters (common for GET /users/:id)
  const urlParams = Object.keys(req.params);
  if (urlParams.length > 0) {
    const primaryKey =
      urlParams.find((param) => ['id', 'userId', 'productId', 'postId'].includes(param)) ||
      urlParams[0];

    return {
      field: primaryKey,
      value: req.params[primaryKey],
    };
  }

  // Try to extract from query parameters (common for GET /users?email=...)
  const queryParams = Object.keys(req.query);
  if (queryParams.length > 0) {
    return {
      field: queryParams[0],
      value: req.query[queryParams[0]] as string,
    };
  }

  // Fallback: try to parse from error message
  if (typeof cause === 'string') {
    // Look for common patterns in Prisma error messages
    const fieldMatch = cause.match(/for (\w+)/) || cause.match(/where.*?(\w+)/);
    if (fieldMatch) {
      return { field: fieldMatch[1] };
    }
  }

  // Ultimate fallback
  return { field: 'id' }; // Assume 'id' as default
}

// Helper to generate appropriate details for P2025
function getP2025Details(modelName?: string, field?: string): string {
  const model = modelName?.toLowerCase() || 'record';
  if (field) {
    return `No ${model} found with the specified ${field}`;
  }
  return `No ${model} found with the provided criteria`;
}

export default globalErrorHandler;
