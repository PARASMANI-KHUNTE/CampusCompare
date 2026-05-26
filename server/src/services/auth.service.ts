import { prisma } from '../config/prisma';
import * as argon2 from 'argon2';
import { z } from 'zod';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { AppError } from '../utils/AppError';

type RegisterData = z.infer<typeof registerSchema>;
type LoginData = z.infer<typeof loginSchema>;

export const register = async (data: RegisterData) => {
  const { name, email, password } = data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError('Email already in use', 409);
  }

  const hashedPassword = await argon2.hash(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const login = async (data: LoginData) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isPasswordValid = await argon2.verify(user.password, password);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const updateProfile = async (userId: string, data: { name?: string }) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
  });
  
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const uploadAvatar = async (userId: string, avatarUrl: string) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { avatarUrl },
  });
  
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const deleteAccount = async (userId: string) => {
  await prisma.user.delete({
    where: { id: userId },
  });
};

