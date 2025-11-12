import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/database';

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { addressId, paymentMethodId, notes, items, totalAmount } = req.body;

    // Validation
    if (!addressId || !paymentMethodId || !items || !totalAmount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify address belongs to user
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId: req.userId },
    });

    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // Verify payment method belongs to user
    const paymentMethod = await prisma.paymentMethod.findFirst({
      where: { id: paymentMethodId, userId: req.userId },
    });

    if (!paymentMethod) {
      return res.status(404).json({ error: 'Payment method not found' });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: req.userId!,
        addressId,
        paymentMethodId,
        totalAmount,
        currency: 'EUR',
        status: 'pending',
        notes,
        items: {
          create: items.map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image,
          })),
        },
      },
      include: {
        items: true,
        address: true,
      },
    });

    res.status(201).json({
      order: {
        id: order.id,
        status: order.status,
        date: order.createdAt.toISOString(),
        deliveryAddress: `${order.address.streetAddress}, ${order.address.city}`,
        totalAmount: order.totalAmount,
        currency: order.currency,
        items: order.items,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: req.userId },
        include: {
          items: true,
          address: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({
        where: { userId: req.userId },
      }),
    ]);

    const formattedOrders = orders.map(order => ({
      id: order.id,
      status: order.status,
      date: order.createdAt.toISOString(),
      deliveryAddress: `${order.address.streetAddress}, ${order.address.city}`,
      totalAmount: order.totalAmount,
      currency: order.currency,
      items: order.items,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    }));

    res.json({
      data: formattedOrders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: req.userId,
      },
      include: {
        items: true,
        address: true,
        payment: true,
        delivery: true,
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      id: order.id,
      status: order.status,
      date: order.createdAt.toISOString(),
      deliveryAddress: `${order.address.streetAddress}, ${order.address.city}`,
      totalAmount: order.totalAmount,
      currency: order.currency,
      items: order.items,
      payment: order.payment,
      delivery: order.delivery,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({ error: 'Failed to retrieve order' });
  }
};

export const getOrderStatistics = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId },
      select: { totalAmount: true },
    });

    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

    res.json({
      totalOrders,
      totalSpent,
      averageOrderValue,
    });
  } catch (error) {
    console.error('Get order statistics error:', error);
    res.status(500).json({ error: 'Failed to retrieve statistics' });
  }
};

export const cancelOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: req.userId,
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if order can be cancelled
    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ error: 'Order cannot be cancelled' });
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'cancelled', notes: reason },
    });

    res.json({ success: true, message: 'Order cancelled successfully' });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
};

export const requestReturn = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    const { reason, items } = req.body;

    if (!reason) {
      return res.status(400).json({ error: 'Reason is required' });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: req.userId,
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({ error: 'Only delivered orders can be returned' });
    }

    await prisma.orderReturn.create({
      data: {
        orderId,
        reason,
        items: items || [],
        status: 'pending',
      },
    });

    res.json({ success: true, message: 'Return request submitted' });
  } catch (error) {
    console.error('Request return error:', error);
    res.status(500).json({ error: 'Failed to submit return request' });
  }
};

export const getReturnStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;

    const returnRequest = await prisma.orderReturn.findUnique({
      where: { orderId },
    });

    if (!returnRequest) {
      return res.status(404).json({ error: 'Return request not found' });
    }

    res.json({
      orderId: returnRequest.orderId,
      status: returnRequest.status,
      reason: returnRequest.reason,
      createdAt: returnRequest.createdAt.toISOString(),
      updatedAt: returnRequest.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Get return status error:', error);
    res.status(500).json({ error: 'Failed to retrieve return status' });
  }
};

export const rateOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: req.userId,
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await prisma.orderRating.upsert({
      where: { orderId },
      create: {
        orderId,
        rating,
        comment,
      },
      update: {
        rating,
        comment,
      },
    });

    res.json({ success: true, message: 'Thank you for your rating!' });
  } catch (error) {
    console.error('Rate order error:', error);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
};

export const getOrderInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: req.userId,
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // In production, generate actual PDF invoice
    res.json({ url: `/invoices/${orderId}.pdf` });
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ error: 'Failed to retrieve invoice' });
  }
};

export const confirmDelivery = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    const { photoUrl, signature, notes } = req.body;

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: req.userId,
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'delivered' },
    });

    // Update delivery status
    await prisma.delivery.updateMany({
      where: { orderId },
      data: { status: 'delivered' },
    });

    res.json({ success: true, message: 'Delivery confirmed' });
  } catch (error) {
    console.error('Confirm delivery error:', error);
    res.status(500).json({ error: 'Failed to confirm delivery' });
  }
};
