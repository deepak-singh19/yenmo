import express from 'express';
import { getMFHoldings } from '../controller/mfController';

const router = express.Router();

// Dynamic route with query parameters
router.get('/', getMFHoldings);

export default router;
