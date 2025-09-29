
export const cartKeys = {
  all: ['cart'] as const,
  lists: () => [...cartKeys.all, 'list'] as const,
  list: (filters?: string) => [...cartKeys.lists(), { filters }] as const,
  details: () => [...cartKeys.all, 'detail'] as const,
  detail: (id: string) => [...cartKeys.details(), id] as const,
  cart: () => [...cartKeys.all, 'current'] as const,
};

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters?: string) => [...orderKeys.lists(), { filters }] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};


export const CART_STALE_TIME = {
  CART: 1000 * 60 * 5, // 5 minutes
  ORDERS: 1000 * 60 * 10, // 10 minutes
} as const;


export const CART_CACHE_TIME = {
  CART: 1000 * 60 * 30, // 30 minutes
  ORDERS: 1000 * 60 * 60, // 1 hour
} as const;