import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      details: err.errors,
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: err.message || 'Authentication required',
    });
  }

  if (err.code === 'P2002') {
    return res.status(409).json({
      error: 'Conflict',
      message: 'A record with this data already exists',
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Not Found',
      message: 'The requested resource was not found',
    });
  }

  res.status(err.statusCode || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'Something went wrong',
  });
};

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
  });
};
