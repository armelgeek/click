import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { paymentLimiter } from '../middleware/rate-limit';
import * as paymentController from '../controllers/payment.controller';

const router = Router();

// Apply strict rate limiting for payment endpoints
router.use(paymentLimiter);

// All routes require authentication
router.use(authenticate);

router.post('/intent', paymentController.createPaymentIntent);
router.post('/confirm', paymentController.confirmPayment);
router.post('/simulate-error', paymentController.simulatePaymentError);

export default router;
