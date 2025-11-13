import { Cart, CartItem } from '../types';

const GUEST_CART_KEY = 'guest-cart';

export class GuestCartService {
  static getCart(): Cart | null {
    try {
      const cartData = localStorage.getItem(GUEST_CART_KEY);
      if (!cartData) return null;
      return JSON.parse(cartData);
    } catch (error) {
      console.error('Error loading guest cart:', error);
      return null;
    }
  }

  static saveCart(cart: Cart): void {
    try {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving guest cart:', error);
    }
  }

  static createEmptyCart(): Cart {
    return {
      id: `guest-${Date.now()}`,
      items: [],
      total: 0,
      itemCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  static addItem(productId: string, quantity: number, name: string, price: number, image: string): Cart {
    let cart = this.getCart() || this.createEmptyCart();
    
    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(item => item.productId === productId);
    
    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      const newItem: CartItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        productId,
        name,
        price,
        image,
        quantity,
        selected: true,
      };
      cart.items.push(newItem);
    }

    cart = this.recalculateCart(cart);
    this.saveCart(cart);
    return cart;
  }

  static updateItem(itemId: string, updates: { quantity?: number; selected?: boolean }): Cart {
    let cart = this.getCart() || this.createEmptyCart();
    
    const itemIndex = cart.items.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
      if (updates.quantity !== undefined) {
        cart.items[itemIndex].quantity = updates.quantity;
      }
      if (updates.selected !== undefined) {
        cart.items[itemIndex].selected = updates.selected;
      }
    }

    cart = this.recalculateCart(cart);
    this.saveCart(cart);
    return cart;
  }

  static removeItem(itemId: string): Cart {
    let cart = this.getCart() || this.createEmptyCart();
    cart.items = cart.items.filter(item => item.id !== itemId);
    cart = this.recalculateCart(cart);
    this.saveCart(cart);
    return cart;
  }

  static clearCart(): Cart {
    const emptyCart = this.createEmptyCart();
    this.saveCart(emptyCart);
    return emptyCart;
  }

  static selectAllItems(selected: boolean): Cart {
    let cart = this.getCart() || this.createEmptyCart();
    cart.items = cart.items.map(item => ({ ...item, selected }));
    cart = this.recalculateCart(cart);
    this.saveCart(cart);
    return cart;
  }

  private static recalculateCart(cart: Cart): Cart {
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.updatedAt = new Date().toISOString();
    return cart;
  }

  static deleteGuestCart(): void {
    try {
      localStorage.removeItem(GUEST_CART_KEY);
    } catch (error) {
      console.error('Error deleting guest cart:', error);
    }
  }
}
