import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { deliveryPollingLimiter, writeLimiter } from '../middleware/rate-limit';
import * as deliveryController from '../controllers/delivery.controller';

const router = Router();

// Apply rate limiting for polling endpoints
router.use(deliveryPollingLimiter);

// All routes require authentication
router.use(authenticate);

// Apply specific rate limiting to write operations
router.get('/:orderId/tracking', deliveryController.getOrderTracking);
router.get('/:orderId/status-updates', deliveryController.getStatusUpdates);
router.post('/:orderId/call-driver', writeLimiter, deliveryController.callDriver);
router.post('/:orderId/message', writeLimiter, deliveryController.sendMessage);
router.post('/:orderId/mark-received', writeLimiter, deliveryController.markAsReceived);

export default router;
