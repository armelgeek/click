import { 
  CartItem, 
  AddToCartPayload, 
  UpdateCartItemPayload, 
  CreateOrderPayload, 
  Order,
  CartResponse,
  OrderResponse
} from '../types';
import { mockCart, mockOrders, calculateCartTotal, calculateItemCount } from '../data/mock-data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const currentCart = { ...mockCart };
const currentOrders = [...mockOrders];

export class CartAPI {

  static async getCart(): Promise<CartResponse> {
    await delay(200);
    
    currentCart.total = calculateCartTotal(currentCart.items);
    currentCart.itemCount = calculateItemCount(currentCart.items);
    currentCart.updatedAt = new Date().toISOString();
    
    return {
      cart: currentCart
    };
  }

  static async addToCart(payload: AddToCartPayload): Promise<CartResponse> {
    await delay(300);
    
    const existingItemIndex = currentCart.items.findIndex(
      item => item.productId === payload.productId
    );

    if (existingItemIndex >= 0) {
      currentCart.items[existingItemIndex].quantity += payload.quantity;
    } else {
      const newItem: CartItem = {
        id: `item-${Date.now()}`,
        productId: payload.productId,
        name: 'Blue Devil By Avap 50ml', 
        price: 25.90,
        image: '/icons/product.png',
        quantity: payload.quantity,
        selected: true,
      };
      currentCart.items.push(newItem);
    }

    currentCart.total = calculateCartTotal(currentCart.items);
    currentCart.itemCount = calculateItemCount(currentCart.items);
    currentCart.updatedAt = new Date().toISOString();

    return {
      cart: currentCart
    };
  }

  static async updateCartItem(
    itemId: string, 
    payload: UpdateCartItemPayload
  ): Promise<CartResponse> {
    await delay(200);
    
    const itemIndex = currentCart.items.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      throw new Error('Item not found in cart');
    }

    if (payload.quantity !== undefined) {
      currentCart.items[itemIndex].quantity = payload.quantity;
    }
    if (payload.selected !== undefined) {
      currentCart.items[itemIndex].selected = payload.selected;
    }

    currentCart.total = calculateCartTotal(currentCart.items);
    currentCart.itemCount = calculateItemCount(currentCart.items);
    currentCart.updatedAt = new Date().toISOString();

    return {
      cart: currentCart
    };
  }

  static async removeFromCart(itemId: string): Promise<CartResponse> {
    await delay(200);
    
    currentCart.items = currentCart.items.filter(item => item.id !== itemId);

    currentCart.total = calculateCartTotal(currentCart.items);
    currentCart.itemCount = calculateItemCount(currentCart.items);
    currentCart.updatedAt = new Date().toISOString();

    return {
      cart: currentCart
    };
  }

  static async clearCart(): Promise<CartResponse> {
    await delay(150);
    
    currentCart.items = [];
    currentCart.total = 0;
    currentCart.itemCount = 0;
    currentCart.updatedAt = new Date().toISOString();

    return {
      cart: currentCart
    };
  }


  static async selectAllItems(selected: boolean): Promise<CartResponse> {
    await delay(150);
    
    currentCart.items = currentCart.items.map(item => ({
      ...item,
      selected
    }));

    currentCart.total = calculateCartTotal(currentCart.items);
    currentCart.itemCount = calculateItemCount(currentCart.items);
    currentCart.updatedAt = new Date().toISOString();

    return {
      cart: currentCart
    };
  }

  static async createOrder(payload: CreateOrderPayload): Promise<OrderResponse> {
    await delay(400);
    
    const selectedItems = currentCart.items.filter(item => item.selected);
    
    if (selectedItems.length === 0) {
      throw new Error('No items selected for order');
    }

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      cartId: payload.cartId,
      items: selectedItems,
      total: calculateCartTotal(selectedItems),
      status: 'pending',
      deliveryAddress: payload.deliveryAddress,
      paymentMethod: payload.paymentMethod,
      notes: payload.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    currentOrders.push(newOrder);

    currentCart.items = currentCart.items.filter(item => !item.selected);
    currentCart.total = calculateCartTotal(currentCart.items);
    currentCart.itemCount = calculateItemCount(currentCart.items);
    currentCart.updatedAt = new Date().toISOString();

    return {
      order: newOrder
    };
  }

  static async getOrder(orderId: string): Promise<OrderResponse> {
    await delay(200);
    
    const order = currentOrders.find(o => o.id === orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }

    return {
      order
    };
  }

  static async getOrders(): Promise<{ orders: Order[] }> {
    await delay(250);
    
    return {
      orders: currentOrders.slice().reverse()
    };
  }
}