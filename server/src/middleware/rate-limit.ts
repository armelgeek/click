import rateLimit from 'express-rate-limit';

// General API rate limiter - 100 requests per 15 minutes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again later.',
});

// Stricter rate limiter for authentication endpoints - 5 requests per 15 minutes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Rate limiter for payment endpoints - 10 requests per 15 minutes
export const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many payment requests, please try again later.',
});

// Rate limiter for delivery tracking polling - 60 requests per minute
export const deliveryPollingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // Allow frequent polling for real-time updates
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many tracking requests, please slow down.',
});

// Rate limiter for write operations - 30 requests per 15 minutes
export const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many write requests, please try again later.',
});
