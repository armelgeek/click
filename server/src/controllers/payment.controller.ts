import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/database';
import crypto from 'crypto';

export const createPaymentIntent = async (req: AuthRequest, res: Response) => {
  try {
    const { amount, currency, orderId } = req.body;

    // Validation
    if (!amount || !currency || !orderId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Verify order exists and belongs to user
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: req.userId,
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if payment already exists for this order
    const existingPayment = await prisma.payment.findUnique({
      where: { orderId },
    });

    if (existingPayment) {
      return res.json({
        paymentIntentId: existingPayment.paymentIntentId,
        clientSecret: existingPayment.clientSecret,
        status: existingPayment.status,
        amount: existingPayment.amount,
        currency: existingPayment.currency,
      });
    }

    // Generate unique payment intent ID
    const paymentIntentId = `pi_${crypto.randomBytes(16).toString('hex')}`;
    const clientSecret = `${paymentIntentId}_secret_${crypto.randomBytes(16).toString('hex')}`;

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        orderId,
        paymentIntentId,
        clientSecret,
        status: 'pending',
        amount,
        currency,
      },
    });

    res.json({
      paymentIntentId: payment.paymentIntentId,
      clientSecret: payment.clientSecret,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
};

export const confirmPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { paymentIntentId, paymentMethodToken } = req.body;

    // Validation
    if (!paymentIntentId || !paymentMethodToken) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Find payment
    const payment = await prisma.payment.findUnique({
      where: { paymentIntentId },
      include: {
        order: true,
      },
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment intent not found' });
    }

    // Verify order belongs to user
    if (payment.order.userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Simulate payment processing (10% failure rate for testing)
    const shouldFail = Math.random() < 0.1;

    if (shouldFail) {
      // Update payment status to failed
      await prisma.payment.update({
        where: { paymentIntentId },
        data: { status: 'failed' },
      });

      return res.json({
        success: false,
        status: 'failed',
        message: 'Payment declined. Please try again or use a different payment method.',
      });
    }

    // Generate transaction ID
    const transactionId = `txn_${crypto.randomBytes(16).toString('hex')}`;

    // Update payment status to succeeded
    await prisma.payment.update({
      where: { paymentIntentId },
      data: {
        status: 'succeeded',
        transactionId,
      },
    });

    // Update order status to confirmed
    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: 'confirmed' },
    });

    // Create delivery tracking
    await createDeliveryTracking(payment.orderId);

    res.json({
      success: true,
      status: 'succeeded',
      message: 'Payment successful',
      transactionId,
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
};

export const simulatePaymentError = async (req: AuthRequest, res: Response) => {
  try {
    const { type } = req.body;

    const errorMessages: Record<string, string> = {
      declined: 'Your card was declined. Please try a different card.',
      insufficient_funds: 'Insufficient funds. Please use a different payment method.',
      network_error: 'Network error occurred. Please try again.',
      authentication_required: 'Additional authentication required. Please verify your payment method.',
    };

    const message = errorMessages[type] || 'An unknown error occurred';

    res.json({
      error: type,
      message,
    });
  } catch (error) {
    console.error('Simulate payment error:', error);
    res.status(500).json({ error: 'Failed to simulate error' });
  }
};

// Helper function to create delivery tracking
async function createDeliveryTracking(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { address: true },
  });

  if (!order) return;

  // Mock driver data
  const drivers = [
    {
      name: 'Jean Dupont',
      phone: '+33 6 12 34 56 78',
      vehicleType: 'scooter',
      rating: 4.8,
    },
    {
      name: 'Marie Martin',
      phone: '+33 6 23 45 67 89',
      vehicleType: 'bike',
      rating: 4.9,
    },
    {
      name: 'Pierre Durand',
      phone: '+33 6 34 56 78 90',
      vehicleType: 'car',
      rating: 4.7,
    },
  ];

  const randomDriver = drivers[Math.floor(Math.random() * drivers.length)];

  // Create delivery record
  const delivery = await prisma.delivery.create({
    data: {
      orderId,
      status: 'preparing',
      estimatedTimeMinutes: 25,
      driverName: randomDriver.name,
      driverPhone: randomDriver.phone,
      driverVehicleType: randomDriver.vehicleType,
      driverRating: randomDriver.rating,
      destinationLatitude: order.address.latitude,
      destinationLongitude: order.address.longitude,
      destinationAddress: `${order.address.streetAddress}, ${order.address.city}`,
      shopLatitude: 48.8566,
      shopLongitude: 2.3522,
      shopAddress: 'ClickNVape Store, Paris',
      currentLatitude: 48.8566,
      currentLongitude: 2.3522,
      currentAddress: 'ClickNVape Store',
    },
  });

  // Create initial timeline entry
  await prisma.deliveryTimeline.create({
    data: {
      deliveryId: delivery.id,
      status: 'preparing',
      description: 'Order received and being prepared',
      location: 'ClickNVape Store',
    },
  });
}
