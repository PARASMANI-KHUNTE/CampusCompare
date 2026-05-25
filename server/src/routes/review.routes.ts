import { Router } from 'express';
import { createReview, getReviews } from '../controllers/review.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { createReviewSchema } from '../validators/review.validator';

const router = Router();

router.get('/:collegeId', getReviews);
router.post('/:collegeId', authenticate, validate(createReviewSchema, 'body'), createReview as any);

export default router;
