import { Cart, CartItem, Order } from '../types';

export const mockCartItems: CartItem[] = [
  {
    id: 'item-1',
    productId: 'prod-1',
    name: 'Blue Devil By Avap 50ml',
    price: 25.90,
    image: '/icons/product.png',
    quantity: 1,
    selected: true,
  },
  {
    id: 'item-2',
    productId: 'prod-2',
    name: 'Red Dragon By Avap 30ml',
    price: 19.90,
    image: '/icons/product.png',
    quantity: 2,
    selected: true,
  },
  {
    id: 'item-3',
    productId: 'prod-3',
    name: 'Green Mint By Avap 60ml',
    price: 29.90,
    image: '/icons/product.png',
    quantity: 1,
    selected: false,
  },
];

export const mockCart: Cart = {
  id: 'cart-1',
  items: mockCartItems,
  total: mockCartItems
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.price * item.quantity, 0),
  itemCount: mockCartItems
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.quantity, 0),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockOrders: Order[] = [
  {
    id: 'order-1',
    cartId: 'cart-1',
    items: mockCartItems.filter(item => item.selected),
    total: 65.80,
    status: 'pending',
    deliveryAddress: '123 Rue de la Paix, 75001 Paris',
    paymentMethod: 'card',
    notes: 'Livraison rapide svp',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const calculateCartTotal = (items: CartItem[]): number => {
  return items
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export const calculateItemCount = (items: CartItem[]): number => {
  return items
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.quantity, 0);
};