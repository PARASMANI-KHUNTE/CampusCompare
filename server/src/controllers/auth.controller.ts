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
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('token', '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'strict',
    expires: new Date(0),
  });
  return successResponse(res, 'Logged out successfully');
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await authService.updateProfile(req.user!.id, {
    name: req.body.name,
  });
  return successResponse(res, 'Profile updated successfully', { user });
});

export const uploadAvatar = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image provided' });
  }
  const user = await authService.uploadAvatar(req.user!.id, req.file.path);
  return successResponse(res, 'Avatar updated successfully', { user });
});

export const deleteAccount = asyncHandler(async (req: AuthRequest, res: Response) => {
  await authService.deleteAccount(req.user!.id);
  
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('token', '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'strict',
    expires: new Date(0),
  });
  
  return successResponse(res, 'Account deleted successfully');
});

