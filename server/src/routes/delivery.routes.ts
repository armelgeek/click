import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as deliveryController from '../controllers/delivery.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/:orderId/tracking', deliveryController.getOrderTracking);
router.get('/:orderId/status-updates', deliveryController.getStatusUpdates);
router.post('/:orderId/call-driver', deliveryController.callDriver);
router.post('/:orderId/message', deliveryController.sendMessage);
router.post('/:orderId/mark-received', deliveryController.markAsReceived);

export default router;
