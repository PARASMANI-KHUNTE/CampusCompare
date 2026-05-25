import { Router } from 'express';
import { compareColleges } from '../controllers/compare.controller';
import { validate } from '../middlewares/validate.middleware';
import { compareQuerySchema } from '../validators/compare.validator';

const router = Router();

router.get('/', validate(compareQuerySchema, 'query'), compareColleges);

export default router;
