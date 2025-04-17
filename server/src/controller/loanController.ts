// src/controller/loanController.ts

import { asyncHandler } from '../utils/asyncHandlre';
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';

export const checkEligibility = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { pan } = req.body;

  if (!pan) {
    res.status(400);
    throw new Error('PAN is required to check loan eligibility');
  }

  // Mock eligibility logic
  const isEligible = pan.startsWith('A') || pan.startsWith('B');

  const response = {
    pan,
    eligible: isEligible,
    maxLoanAmount: isEligible ? 500000 : 0,
    message: isEligible
      ? 'Congratulations! You are eligible for a loan.'
      : 'Sorry, you are not eligible for a loan at this time.',
  };

  res.status(200).json(response);
});

export const getHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id; // Assuming you attach user to req inside `protect` middleware

  if (!userId) {
    res.status(401);
    throw new Error('Unauthorized access');
  }

  // Mock loan history
  const history = [
    {
      loanId: 'L123456',
      amount: 250000,
      status: 'Paid',
      createdAt: new Date('2022-01-15'),
      closedAt: new Date('2023-01-15')
    },
    {
      loanId: 'L789012',
      amount: 400000,
      status: 'Ongoing',
      createdAt: new Date('2024-05-10'),
    },
  ];

  res.status(200).json({
    userId,
    history,
  });
});
