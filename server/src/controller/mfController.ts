import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandlre';

export const getMFHoldings = asyncHandler(async (req: Request, res: Response) => {
  const { pan } = req.query;

  if (!pan) {
    res.status(400);
    throw new Error('PAN is required');
  }

  // Mock response for the example
  const data = {
    pan,
    holdings: [
      {
        fund_name: 'Axis Bluechip Fund',
        category: 'Equity - Large Cap',
        current_value: 150000,
        units: 120.5,
        nav: 1245.80
      },
      {
        fund_name: 'HDFC Short Term Debt Fund',
        category: 'Debt - Short Duration',
        current_value: 50000,
        units: 300.75,
        nav: 166.20
      },
      {
        fund_name: 'Mirae Asset Emerging Bluechip',
        category: 'Equity - Mid Cap',
        current_value: 200000,
        units: 250.25,
        nav: 799.30
      }
    ],
    total_value: 400000,
    last_updated: new Date()
  };

  res.json(data);
});
