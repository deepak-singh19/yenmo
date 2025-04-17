import { asyncHandler } from '../utils/asyncHandlre';
import { User } from '../models/User';
import { hashPassword, matchPassword } from '../utils/hash';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { faker } from '@faker-js/faker'; 
import { Holding } from '../models/Holding';

export const register = asyncHandler(async (req: Request, res: Response) => {
  // console.log(req);
  const { name, email, password, pan } = req.body;

  console.log("Name", name)

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('User already exists');
  }

  const hashed = await hashPassword(password);

  const user = await User.create({ name, email, password: hashed, pan });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

  const fakeHoldings = Array.from({ length: 5 }, () => ({
    userId: user._id,
    pan: pan.trim(),
    fundName: faker.company.name() + ' Growth Fund',
    category: faker.helpers.arrayElement(['Equity', 'Debt', 'Hybrid', 'Gold', 'Index']),
    currentValue: faker.number.float({ min: 10000, max: 100000, fractionDigits: 2 }),
    units: faker.number.float({ min: 10, max: 500, fractionDigits: 2 }),
    nav: faker.number.float({ min: 10, max: 500, fractionDigits: 2 })
  }));

  await Holding.insertMany(fakeHoldings);

  res.status(201).json({ 
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      pan: user.pan
    },
    token 
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await matchPassword(password, user.password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

  res.json({ 
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      pan: user.pan
    },
    token 
  });
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  
  if (!userId) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const user = await User.findById(userId).select('-password');
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({ user });
});
