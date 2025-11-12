import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as ordersController from '../controllers/orders.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', ordersController.createOrder);
router.get('/', ordersController.getOrders);
router.get('/statistics', ordersController.getOrderStatistics);
router.get('/:orderId', ordersController.getOrderById);
router.put('/:orderId/cancel', ordersController.cancelOrder);
router.post('/:orderId/return', ordersController.requestReturn);
router.get('/:orderId/return-status', ordersController.getReturnStatus);
router.post('/:orderId/rating', ordersController.rateOrder);
router.get('/:orderId/invoice', ordersController.getOrderInvoice);
router.post('/:orderId/confirm-delivery', ordersController.confirmDelivery);

export default router;
