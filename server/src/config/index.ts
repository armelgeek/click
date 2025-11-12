import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiration: process.env.JWT_EXPIRATION || '7d',
  },
  payment: {
    secretKey: process.env.PAYMENT_GATEWAY_SECRET_KEY || '',
    publishableKey: process.env.PAYMENT_GATEWAY_PUBLISHABLE_KEY || '',
  },
  session: {
    secret: process.env.SESSION_SECRET || 'your-session-secret',
  },
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
};

export const isDevelopment = config.nodeEnv === 'development';
export const isProduction = config.nodeEnv === 'production';
