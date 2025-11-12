import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as addressesController from '../controllers/addresses.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', addressesController.getUserAddresses);
router.post('/', addressesController.createAddress);
router.put('/:addressId', addressesController.updateAddress);
router.delete('/:addressId', addressesController.deleteAddress);
router.put('/:addressId/default', addressesController.setDefaultAddress);

export default router;
