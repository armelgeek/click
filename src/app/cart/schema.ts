import { z } from 'zod';


export const createOrderSchema = z.object({
  userId: z.string(),
  storeId: z.string().min(1, 'storeId is required'),
  addressId: z.string().min(1, 'addressId should not be empty'),
  notes: z.string().optional(),
  mode: z.enum(['express', 'planified']),
  planifiedDate: z.string().optional(),
  planifiedHour: z.string().optional(),
});

export type CreateOrderPayload = z.infer<typeof createOrderSchema>;
