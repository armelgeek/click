import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { writeLimiter, apiLimiter } from '../middleware/rate-limit';
import * as paymentMethodsController from '../controllers/payment-methods.controller';

const router = Router();

// Apply general rate limiting to all routes
router.use(apiLimiter);

// All routes require authentication
router.use(authenticate);

// Apply specific rate limiting to write operations
router.get('/', paymentMethodsController.getUserPaymentMethods);
router.post('/', writeLimiter, paymentMethodsController.createPaymentMethod);
router.delete('/:paymentId', writeLimiter, paymentMethodsController.deletePaymentMethod);
router.put('/:paymentId/default', writeLimiter, paymentMethodsController.setDefaultPaymentMethod);

export default router;
