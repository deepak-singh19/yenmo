import express from 'express';
import { getMFHoldings } from '../controller/mfController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/holdings',protect, getMFHoldings);

export default router;
