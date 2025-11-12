import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as paymentController from '../controllers/payment.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/intent', paymentController.createPaymentIntent);
router.post('/confirm', paymentController.confirmPayment);
router.post('/simulate-error', paymentController.simulatePaymentError);

export default router;
