import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/database';

export const getUserPaymentMethods = async (req: AuthRequest, res: Response) => {
  try {
    const paymentMethods = await prisma.paymentMethod.findMany({
      where: { userId: req.userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    res.json({ paymentMethods });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ error: 'Failed to retrieve payment methods' });
  }
};

export const createPaymentMethod = async (req: AuthRequest, res: Response) => {
  try {
    const {
      type,
      provider,
      token,
      last4,
      cardBrand,
      expiryMonth,
      expiryYear,
    } = req.body;

    // Validation
    if (!type || !provider || !token) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate type
    if (!['card', 'paypal', 'other'].includes(type)) {
      return res.status(400).json({ error: 'Invalid payment method type' });
    }

    // Check if this is the first payment method for the user
    const methodCount = await prisma.paymentMethod.count({
      where: { userId: req.userId! },
    });

    const isFirstMethod = methodCount === 0;

    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        userId: req.userId!,
        type,
        provider,
        token,
        last4,
        cardBrand,
        expiryMonth,
        expiryYear,
        isDefault: isFirstMethod, // First method is default
      },
    });

    res.status(201).json({ paymentMethod });
  } catch (error) {
    console.error('Create payment method error:', error);
    res.status(500).json({ error: 'Failed to create payment method' });
  }
};

export const deletePaymentMethod = async (req: AuthRequest, res: Response) => {
  try {
    const { paymentId } = req.params;

    // Verify ownership
    const existingMethod = await prisma.paymentMethod.findFirst({
      where: { id: paymentId, userId: req.userId },
    });

    if (!existingMethod) {
      return res.status(404).json({ error: 'Payment method not found' });
    }

    // If deleting default method, set another as default
    if (existingMethod.isDefault) {
      const nextMethod = await prisma.paymentMethod.findFirst({
        where: {
          userId: req.userId!,
          id: { not: paymentId },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (nextMethod) {
        await prisma.paymentMethod.update({
          where: { id: nextMethod.id },
          data: { isDefault: true },
        });
      }
    }

    await prisma.paymentMethod.delete({
      where: { id: paymentId },
    });

    res.json({ success: true, message: 'Payment method deleted' });
  } catch (error) {
    console.error('Delete payment method error:', error);
    res.status(500).json({ error: 'Failed to delete payment method' });
  }
};

export const setDefaultPaymentMethod = async (req: AuthRequest, res: Response) => {
  try {
    const { paymentId } = req.params;

    // Verify ownership
    const existingMethod = await prisma.paymentMethod.findFirst({
      where: { id: paymentId, userId: req.userId },
    });

    if (!existingMethod) {
      return res.status(404).json({ error: 'Payment method not found' });
    }

    // Remove default from all user payment methods
    await prisma.paymentMethod.updateMany({
      where: { userId: req.userId! },
      data: { isDefault: false },
    });

    // Set new default
    await prisma.paymentMethod.update({
      where: { id: paymentId },
      data: { isDefault: true },
    });

    res.json({ success: true, message: 'Default payment method updated' });
  } catch (error) {
    console.error('Set default payment method error:', error);
    res.status(500).json({ error: 'Failed to set default payment method' });
  }
};
