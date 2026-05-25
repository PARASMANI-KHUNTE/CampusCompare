import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { errorHandler } from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes';
import collegeRoutes from './routes/college.routes';
import compareRoutes from './routes/compare.routes';
import savedRoutes from './routes/saved.routes';
import reviewRoutes from './routes/review.routes';
import adminRoutes from './routes/admin.routes';
import predictorRoutes from './routes/predictor.routes';
import discussionRoutes from './routes/discussion.routes';
import savedComparisonRoutes from './routes/saved-comparison.routes';

const app = express();

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { success: false, message: 'Too many requests, please try again later.' }
});

// Apply rate limiter to all API requests
app.use('/api', limiter);

app.use(cors({ origin: [env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:5174'], credentials: true }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'CampusCompare API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/saved-colleges', savedRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/predictor', predictorRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/saved-comparisons', savedComparisonRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler (cast needed due to Express 4 error handler type mismatch)
app.use(errorHandler as ErrorRequestHandler);

export default app;
