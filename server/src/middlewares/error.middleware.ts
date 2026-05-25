import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { errorResponse } from '../utils/apiResponse';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (env.NODE_ENV !== 'production') {
    console.error(err);
  }

  if (err instanceof AppError) {
    return errorResponse(res, err.message, err.statusCode);
  }

  if (err instanceof ZodError) {
    const errors = err.errors.map((e: any) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return errorResponse(res, 'Validation Error', 400, errors);
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return errorResponse(res, 'Duplicate record found', 409);
    }
    if (err.code === 'P2025') {
      return errorResponse(res, 'Record not found', 404);
    }
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Invalid or expired token', 401);
  }

  const message = env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message || 'Internal Server Error';
  return errorResponse(res, message, 500);
};
