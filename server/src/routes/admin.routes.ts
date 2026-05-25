import { Router } from 'express';
import { 
  getAllColleges,
  getAllCourses,
  createCollege, 
  updateCollege, 
  deleteCollege, 
  createCourse, 
  updateCourse, 
  deleteCourse,
  uploadCollegeImage,
  createNotice,
  deleteNotice,
  bulkImportColleges
} from '../controllers/admin.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { upload, uploadNotice } from '../middlewares/upload.middleware';
import { createCollegeSchema, updateCollegeSchema, createCourseSchema, updateCourseSchema } from '../validators/admin.validator';

const router = Router();

router.use(authenticate);
router.use(requireRole(['ADMIN']) as any);

router.get('/colleges', getAllColleges);
router.post('/colleges', validate(createCollegeSchema, 'body'), createCollege);
router.post('/colleges/bulk', bulkImportColleges);
router.put('/colleges/:id', validate(updateCollegeSchema, 'body'), updateCollege);
router.post('/colleges/:id/image', upload.single('image'), uploadCollegeImage);
router.delete('/colleges/:id', deleteCollege);

router.get('/courses', getAllCourses);
router.post('/courses', validate(createCourseSchema, 'body'), createCourse);
router.put('/courses/:id', validate(updateCourseSchema, 'body'), updateCourse);
router.delete('/courses/:id', deleteCourse);

router.post('/colleges/:collegeId/notices', uploadNotice.single('attachment'), createNotice);
router.delete('/notices/:id', deleteNotice);

export default router;
