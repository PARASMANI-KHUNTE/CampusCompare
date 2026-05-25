import { Router } from 'express';
import { getPredictions } from '../controllers/predictor.controller';

const router = Router();

router.get('/', getPredictions);

export default router;
