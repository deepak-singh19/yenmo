// src/middleware/authMiddleware.ts

import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandlre';
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';

interface JwtPayload {
  id: string;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      req.user = {
        id: decoded.id,
      };

      next();
    } catch (error) {
      throw new AppError('Not authorized, token failed', 401);
    }
  }

  if (!token) {
    throw new AppError('Not authorized, no token', 401);
  }
});
