import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/database';

export const getOrderTracking = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;

    // Verify order belongs to user
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: req.userId,
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const delivery = await prisma.delivery.findUnique({
      where: { orderId },
      include: {
        timeline: {
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery tracking not found' });
    }

    res.json({
      tracking: {
        id: delivery.id,
        orderId: delivery.orderId,
        status: delivery.status,
        estimatedTimeMinutes: delivery.estimatedTimeMinutes,
        driver: {
          id: delivery.driverId || 'driver-1',
          name: delivery.driverName || 'Unknown',
          phone: delivery.driverPhone || '',
          photo: delivery.driverPhoto,
          vehicleType: delivery.driverVehicleType || 'bike',
          rating: delivery.driverRating || 4.5,
        },
        currentLocation: {
          coordinates: {
            latitude: delivery.currentLatitude || 0,
            longitude: delivery.currentLongitude || 0,
          },
          address: delivery.currentAddress || '',
        },
        destination: {
          coordinates: {
            latitude: delivery.destinationLatitude || 0,
            longitude: delivery.destinationLongitude || 0,
          },
          address: delivery.destinationAddress || '',
        },
        shopLocation: {
          coordinates: {
            latitude: delivery.shopLatitude || 0,
            longitude: delivery.shopLongitude || 0,
          },
          address: delivery.shopAddress || '',
        },
        timeline: delivery.timeline.map(item => ({
          id: item.id,
          status: item.status,
          timestamp: item.timestamp.toISOString(),
          description: item.description,
          location: item.location,
        })),
        canCall: delivery.canCall,
        canMessage: delivery.canMessage,
        lastUpdated: delivery.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Get order tracking error:', error);
    res.status(500).json({ error: 'Failed to retrieve tracking information' });
  }
};

export const getStatusUpdates = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;

    // Verify order belongs to user
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: req.userId,
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const delivery = await prisma.delivery.findUnique({
      where: { orderId },
    });

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery tracking not found' });
    }

    res.json({
      success: true,
      data: {
        orderId: delivery.orderId,
        status: delivery.status,
        estimatedTimeMinutes: delivery.estimatedTimeMinutes,
        currentLocation: {
          coordinates: {
            latitude: delivery.currentLatitude || 0,
            longitude: delivery.currentLongitude || 0,
          },
          address: delivery.currentAddress || '',
        },
        lastUpdated: delivery.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Get status updates error:', error);
    res.status(500).json({ error: 'Failed to retrieve status updates' });
  }
};

export const callDriver = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;

    // Verify order belongs to user
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: req.userId,
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const delivery = await prisma.delivery.findUnique({
      where: { orderId },
    });

    if (!delivery || !delivery.canCall) {
      return res.status(400).json({ error: 'Cannot call driver at this time' });
    }

    // In production, integrate with telephony API
    res.json({
      success: true,
      message: 'Call initiated to driver',
    });
  } catch (error) {
    console.error('Call driver error:', error);
    res.status(500).json({ error: 'Failed to initiate call' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Verify order belongs to user
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: req.userId,
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const delivery = await prisma.delivery.findUnique({
      where: { orderId },
    });

    if (!delivery || !delivery.canMessage) {
      return res.status(400).json({ error: 'Cannot message driver at this time' });
    }

    // Store message
    const autoResponse = "Message received, I'll be there soon!";
    
    await prisma.deliveryMessage.create({
      data: {
        deliveryId: delivery.id,
        message,
        response: autoResponse,
      },
    });

    // In production, send actual message to driver
    res.json({
      success: true,
      response: autoResponse,
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

export const markAsReceived = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;

    // Verify order belongs to user
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: req.userId,
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update delivery status
    const delivery = await prisma.delivery.findUnique({
      where: { orderId },
    });

    if (delivery) {
      await prisma.delivery.update({
        where: { orderId },
        data: {
          status: 'delivered',
          estimatedTimeMinutes: 0,
        },
      });

      // Add timeline entry
      await prisma.deliveryTimeline.create({
        data: {
          deliveryId: delivery.id,
          status: 'delivered',
          description: 'Order delivered and marked as received',
          location: delivery.destinationAddress || '',
        },
      });
    }

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'delivered' },
    });

    res.json({
      success: true,
      message: 'Order marked as received',
    });
  } catch (error) {
    console.error('Mark as received error:', error);
    res.status(500).json({ error: 'Failed to mark order as received' });
  }
};
