import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/database';

export const getUserAddresses = async (req: AuthRequest, res: Response) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    res.json({ addresses });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ error: 'Failed to retrieve addresses' });
  }
};

export const createAddress = async (req: AuthRequest, res: Response) => {
  try {
    const {
      label,
      streetAddress,
      city,
      state,
      postalCode,
      country,
      latitude,
      longitude,
    } = req.body;

    // Validation
    if (!label || !streetAddress || !city || !state || !postalCode || !country) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if this is the first address for the user
    const addressCount = await prisma.address.count({
      where: { userId: req.userId! },
    });

    const isFirstAddress = addressCount === 0;

    const address = await prisma.address.create({
      data: {
        userId: req.userId!,
        label,
        streetAddress,
        city,
        state,
        postalCode,
        country,
        latitude,
        longitude,
        isDefault: isFirstAddress, // First address is default
      },
    });

    res.status(201).json({ address });
  } catch (error) {
    console.error('Create address error:', error);
    res.status(500).json({ error: 'Failed to create address' });
  }
};

export const updateAddress = async (req: AuthRequest, res: Response) => {
  try {
    const { addressId } = req.params;
    const updateData = req.body;

    // Verify ownership
    const existingAddress = await prisma.address.findFirst({
      where: { id: addressId, userId: req.userId },
    });

    if (!existingAddress) {
      return res.status(404).json({ error: 'Address not found' });
    }

    const address = await prisma.address.update({
      where: { id: addressId },
      data: updateData,
    });

    res.json({ address });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ error: 'Failed to update address' });
  }
};

export const deleteAddress = async (req: AuthRequest, res: Response) => {
  try {
    const { addressId } = req.params;

    // Verify ownership
    const existingAddress = await prisma.address.findFirst({
      where: { id: addressId, userId: req.userId },
    });

    if (!existingAddress) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // If deleting default address, set another as default
    if (existingAddress.isDefault) {
      const nextAddress = await prisma.address.findFirst({
        where: {
          userId: req.userId!,
          id: { not: addressId },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (nextAddress) {
        await prisma.address.update({
          where: { id: nextAddress.id },
          data: { isDefault: true },
        });
      }
    }

    await prisma.address.delete({
      where: { id: addressId },
    });

    res.json({ success: true, message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ error: 'Failed to delete address' });
  }
};

export const setDefaultAddress = async (req: AuthRequest, res: Response) => {
  try {
    const { addressId } = req.params;

    // Verify ownership
    const existingAddress = await prisma.address.findFirst({
      where: { id: addressId, userId: req.userId },
    });

    if (!existingAddress) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // Remove default from all user addresses
    await prisma.address.updateMany({
      where: { userId: req.userId! },
      data: { isDefault: false },
    });

    // Set new default
    await prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });

    res.json({ success: true, message: 'Default address updated' });
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({ error: 'Failed to set default address' });
  }
};
