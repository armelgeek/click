import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { writeLimiter, apiLimiter } from '../middleware/rate-limit';
import * as addressesController from '../controllers/addresses.controller';

const router = Router();

// Apply general rate limiting to all routes
router.use(apiLimiter);

// All routes require authentication
router.use(authenticate);

// Apply specific rate limiting to write operations
router.get('/', addressesController.getUserAddresses);
router.post('/', writeLimiter, addressesController.createAddress);
router.put('/:addressId', writeLimiter, addressesController.updateAddress);
router.delete('/:addressId', writeLimiter, addressesController.deleteAddress);
router.put('/:addressId/default', writeLimiter, addressesController.setDefaultAddress);

export default router;
