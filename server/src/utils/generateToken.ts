import jwt, { SignOptions } from 'jsonwebtoken';
import { Response } from 'express';
import { env } from '../config/env';

export const generateTokenAndSetCookie = (userId: string, res: Response) => {
  const token = jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });

  const isProduction = env.NODE_ENV === 'production';

  res.cookie('token', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'strict',
  });

  return token;
};
