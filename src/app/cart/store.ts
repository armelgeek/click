import { create } from 'zustand';
import { CartItem, Cart } from './types';
import { persist } from 'zustand/middleware';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setCartData: (cart: Cart) => void;
  stockValidation?: { valid: boolean; items: { productId: string; requestedQuantity: number; availableQuantity: number; isAvailable: boolean }[] } | null;
  setStockValidation: (sv: { valid: boolean; items: { productId: string; requestedQuantity: number; availableQuantity: number; isAvailable: boolean }[] } | null) => void;
  stockModalOpen?: boolean;
  openStockModal: () => void;
  closeStockModal: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      total: 0,
      itemCount: 0,
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      addItem: (item) =>
        set((state) => {
          console.log('Adding item to cart:', item);
          const existingItem = state.items.find((i) => i.productId === item.productId);
          if (existingItem) {
            console.log('Item exists, updating quantity');
            const updatedItems = state.items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                : i
            );
            return {
              items: updatedItems,
              total: calculateTotal(updatedItems),
              itemCount: calculateItemCount(updatedItems),
            };
          }
          console.log('New item, adding to cart');
          const newItems = [...state.items, item];
          return {
            items: newItems,
            total: calculateTotal(newItems),
            itemCount: calculateItemCount(newItems),
          };
        }),
      removeItem: (itemId) =>
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== itemId);
          return {
            items: newItems,
            total: calculateTotal(newItems),
            itemCount: calculateItemCount(newItems),
          };
        }),
      updateItemQuantity: (itemId, quantity) =>
        set((state) => {
          const newItems = state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          );
          return {
            items: newItems,
            total: calculateTotal(newItems),
            itemCount: calculateItemCount(newItems),
          };
        }),
      clearCart: () =>
        set({
          items: [],
          total: 0,
          itemCount: 0,
        }),
      setCartData: (cart) =>
        set({
          items: cart.items,
          total: cart.total,
          itemCount: cart.itemCount,
        }),
  stockValidation: null,
  setStockValidation: (sv) => set({ stockValidation: sv }),
  stockModalOpen: false,
  openStockModal: () => set({ stockModalOpen: true }),
  closeStockModal: () => set({ stockModalOpen: false }),
    }),
    {
      name: 'vapo-cart', // nouvelle clé localStorage pour le panier
    }
  )
);

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((acc, item) => acc + item.quantity, 0);
};