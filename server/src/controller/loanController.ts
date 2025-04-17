// src/controller/loanController.ts

import { asyncHandler } from '../utils/asyncHandlre';
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Holding } from '../models/Holding';
import { table } from 'console';
import { EligibilityCheck } from '../models/EligibilityCheck';

export const checkEligibility = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { pan } = req.body;
  const userId = req.user?.id;

  if (!pan) {
    res.status(400);
    throw new Error('PAN is required to check loan eligibility');
  }

  const holdings = await Holding.find({ 
    pan: pan 
  });

  const totalValue = holdings.reduce((acc, holding) => acc + (holding.currentValue || 0), 0);

    const loanEligibility = 0.5 * totalValue; 

    const isEligible = loanEligibility > 0; 

    const check = new EligibilityCheck({
      userId: userId,
      date: new Date(),
      eligibleAmount: loanEligibility
    });
  
    await check.save();



  const response = {
    pan,
    eligible: isEligible,
    amount:totalValue,
    loan_amount: isEligible ? loanEligibility : 0,
    message: isEligible
      ? 'Congratulations! You are eligible for a loan.'
      : 'Sorry, you are not eligible for a loan at this time.',
  };

  res.status(200).json(response);
});

export const getHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id; // Assuming you attach user to req inside `protect` middleware
  const pan = req.query.pan as string;
  if (!userId) {
    res.status(401);
    throw new Error('Unauthorized access');
  }
// const oldHistory= await EligibilityCheck.find()
// console.log("Old ",oldHistory)
  const history = await EligibilityCheck.find({userId:userId}) as any[];

  res.status(200).json({
    userId,
    history: history.map(his=>({
      date:his.date,
      amount:his.eligibleAmount*2,
      loan_amount:his.eligibleAmount
    })),
  });
});
