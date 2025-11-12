import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as paymentMethodsController from '../controllers/payment-methods.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', paymentMethodsController.getUserPaymentMethods);
router.post('/', paymentMethodsController.createPaymentMethod);
router.delete('/:paymentId', paymentMethodsController.deletePaymentMethod);
router.put('/:paymentId/default', paymentMethodsController.setDefaultPaymentMethod);

export default router;
