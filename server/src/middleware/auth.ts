import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Check for JWT token in Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
      req.userId = decoded.userId;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Authentication error' });
  }
};

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
        req.userId = decoded.userId;
      } catch (error) {
        // Invalid token, but continue without userId
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};
