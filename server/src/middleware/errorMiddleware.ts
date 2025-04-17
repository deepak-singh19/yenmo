import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import AppError from '../utils/AppError';

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
    return;
  }

  // For unhandled errors
  console.error('ERROR ', err);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  });
};

export default errorMiddleware; 