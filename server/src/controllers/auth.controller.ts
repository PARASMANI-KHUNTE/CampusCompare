import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/apiResponse';
import { generateTokenAndSetCookie } from '../utils/generateToken';
import * as authService from '../services/auth.service';
import { AuthRequest } from '../types';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.register(req.body);
  generateTokenAndSetCookie(user.id, res);
  return successResponse(res, 'User registered successfully', { user }, 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.login(req.body);
  generateTokenAndSetCookie(user.id, res);
  return successResponse(res, 'Logged in successfully', { user });
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await authService.getMe(req.user!.id);
  return successResponse(res, 'User fetched successfully', { user });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  return successResponse(res, 'Logged out successfully');
});
