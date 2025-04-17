import mongoose from 'mongoose'; // at top
import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandlre';
import { Holding } from '../models/Holding';
import { AuthRequest } from '../middleware/authMiddleware';

export const getMFHoldings = asyncHandler(async (req: AuthRequest, res: Response) => {
  const pan = req.query.pan as string;
  const userId = req.user?.id;

  console.log("Userid:", userId, "PAN:", pan);

  if (!userId) {
    res.status(401);
    throw new Error('Unauthorized access');
  }

  if (!pan) {
    res.status(400);
    throw new Error('PAN is required');
  }

  const holdings = await Holding.find({ 
    pan: pan 
  });

  if (!holdings || holdings.length === 0) {
    res.status(404);
    throw new Error('No holdings found for the provided PAN');
  }

  const totalValue = holdings.reduce((acc, holding) => acc + (holding.currentValue || 0), 0);

  const data = {
    pan,
    holdings: holdings.map(holding => ({
      fund_name: holding.fundName,
      category: holding.category,
      current_value: holding.currentValue,
      units: holding.units,
      nav: holding.nav
    })),
    total_value: totalValue,
    last_updated: new Date().toISOString()
  };

  res.status(200).json(data);
});
