import { Router, Request, Response, NextFunction } from 'express';
import { register, login, getMe, logout } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { registerSchema, loginSchema } from '../validators/auth.validator';

const router = Router();

// Prevent browser from caching auth responses
const noCache = (_req: Request, res: Response, next: NextFunction) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
};

router.post('/register', validate(registerSchema, 'body'), register);
router.post('/login', validate(loginSchema, 'body'), login);
router.get('/me', noCache, authenticate, getMe as any);
router.post('/logout', logout);

export default router;
