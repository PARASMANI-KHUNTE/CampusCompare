import { Router } from 'express';
import { saveCollege, getSavedColleges, removeSavedCollege } from '../controllers/saved.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { saveCollegeSchema } from '../validators/saved.validator';

const router = Router();

router.use(authenticate);

router.post('/', validate(saveCollegeSchema, 'body'), saveCollege as any);
router.get('/', getSavedColleges as any);
router.delete('/:collegeId', removeSavedCollege as any);

export default router;
