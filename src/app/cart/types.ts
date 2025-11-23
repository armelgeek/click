import { z } from 'zod';
import { createOrderSchema } from './schema';

export const cartItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  name: z.string(),
  price: z.number(),
  image: z.string(),
  quantity: z.number().min(1),
  selected: z.boolean().default(true),
});

export const cartSchema = z.object({
  id: z.string(),
  items: z.array(cartItemSchema),
  total: z.number(),
  itemCount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const addToCartSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(1).default(1),
});
 
export const updateCartItemSchema = z.object({
  quantity: z.number().min(1).optional(),
  selected: z.boolean().optional(),
});



export const orderSchema = z.object({
  id: z.string(),
  cartId: z.string(),
  items: z.array(cartItemSchema),
  total: z.number(),
  status: z.enum(['pending', 'confirmed', 'preparing', 'in_delivery', 'delivered', 'cancelled']),
  deliveryAddress: z.string(),
  paymentMethod: z.string(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const cartResponseSchema = z.object({
  cart: cartSchema,
});

export const orderResponseSchema = z.object({
  order: orderSchema,
});

export const stockValidationItemSchema = z.object({
  productId: z.string(),
  requestedQuantity: z.number(),
  availableQuantity: z.number(),
  isAvailable: z.boolean(),
});

export const stockValidationResponseSchema = z.object({
  valid: z.boolean(),
  items: z.array(stockValidationItemSchema),
  message: z.string().optional(),
});

export type CartItem = z.infer<typeof cartItemSchema>;
export type Cart = z.infer<typeof cartSchema>;
export type AddToCartPayload = z.infer<typeof addToCartSchema>;
export type UpdateCartItemPayload = z.infer<typeof updateCartItemSchema>;
export type CreateOrderPayload = z.infer<typeof createOrderSchema>;
export type Order = z.infer<typeof orderSchema>;
export type CartResponse = z.infer<typeof cartResponseSchema>;
export type OrderResponse = z.infer<typeof orderResponseSchema>;
export type StockValidationItem = z.infer<typeof stockValidationItemSchema>;
export type StockValidationResponse = z.infer<typeof stockValidationResponseSchema>;