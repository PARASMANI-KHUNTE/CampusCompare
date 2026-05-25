import { Router } from 'express';
import { getColleges, getCollegeBySlug, getRelatedColleges } from '../controllers/college.controller';
import { validate } from '../middlewares/validate.middleware';
import { collegeQuerySchema } from '../validators/college.validator';

const router = Router();

router.get('/', validate(collegeQuerySchema, 'query'), getColleges);
router.get('/:slug/related', getRelatedColleges);
router.get('/:slug', getCollegeBySlug);

export default router;
