// src/routes/loanRoutes.ts

import express from 'express';
import { checkEligibility, getHistory } from '../controller/loanController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();


router.post('/check', protect, checkEligibility);


router.get('/history', protect, getHistory);

export default router;
