import { Router } from 'express';
import { saveComparison, getSavedComparisons, deleteSavedComparison } from '../controllers/saved-comparison.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', saveComparison);
router.get('/', getSavedComparisons);
router.delete('/:id', deleteSavedComparison);

export default router;
