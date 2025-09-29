import { z } from 'zod';

export const orderSchema = z.object({
  id: z.string(),
  number: z.number(),
  status: z.enum(['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled', 'returned']),
  statusLabel: z.string(),
  statusColor: z.string(),
  date: z.string(),
  estimatedDelivery: z.string().optional(),
  deliveryAddress: z.string(),
  totalAmount: z.number(),
  currency: z.string().default('EUR'),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    quantity: z.number(),
    price: z.number(),
    image: z.string().optional(),
  })),
  proofOfDelivery: z.object({
    type: z.enum(['signature', 'photo']).optional(),
    image: z.string().optional(),
    signature: z.string().optional(),
    timestamp: z.string().optional(),
  }).optional(),
  tracking: z.object({
    driverName: z.string().optional(),
    driverPhone: z.string().optional(),
    currentLocation: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),
    estimatedArrival: z.string().optional(),
  }).optional(),
});

export type Order = z.infer<typeof orderSchema>;

export const orderStatusMap = {
  pending: { label: 'Commande en attente', color: 'bg-yellow-400' },
  confirmed: { label: 'Commande confirmée', color: 'bg-blue-400' },
  preparing: { label: 'Commande en préparation', color: 'bg-orange-400' },
  out_for_delivery: { label: 'En cours de livraison', color: 'bg-purple-400' },
  delivered: { label: 'Commande livrée', color: 'bg-green-400' },
  cancelled: { label: 'Commande annulée', color: 'bg-red-400' },
  returned: { label: 'Commande retournée', color: 'bg-gray-400' },
} as const;