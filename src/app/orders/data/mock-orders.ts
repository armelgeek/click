import { Order as CartOrder } from '@/app/cart/types';

// Mock orders storage - uses cart Order type internally
const mockOrders: CartOrder[] = [];

// Function to add an order (called from CartAPI)
export const addMockOrder = (order: CartOrder) => {
  mockOrders.unshift(order); // Add to beginning of array (most recent first)
};

// Function to get all orders - convert to OrdersOrder type
export const getMockOrders = (): CartOrder[] => {
  return mockOrders;
};

// Function to get order by ID
export const getMockOrderById = (orderId: string): CartOrder | undefined => {
  return mockOrders.find(o => o.id === orderId);
};

