import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { writeLimiter, apiLimiter } from '../middleware/rate-limit';
import * as ordersController from '../controllers/orders.controller';

const router = Router();

// Apply general rate limiting to all routes
router.use(apiLimiter);

// All routes require authentication
router.use(authenticate);

// Apply specific rate limiting to write operations
router.post('/', writeLimiter, ordersController.createOrder);
router.get('/', ordersController.getOrders);
router.get('/statistics', ordersController.getOrderStatistics);
router.get('/:orderId', ordersController.getOrderById);
router.put('/:orderId/cancel', writeLimiter, ordersController.cancelOrder);
router.post('/:orderId/return', writeLimiter, ordersController.requestReturn);
router.get('/:orderId/return-status', ordersController.getReturnStatus);
router.post('/:orderId/rating', writeLimiter, ordersController.rateOrder);
router.get('/:orderId/invoice', ordersController.getOrderInvoice);
router.post('/:orderId/confirm-delivery', writeLimiter, ordersController.confirmDelivery);

export default router;
