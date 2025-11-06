// Central export for all API services
export { CartAPI } from '@/app/cart/api/cart-api';
export { OrdersAPI } from '@/app/orders/api/orders-api';
export { PaymentAPI } from '@/app/payment/api/payment-api';
export { SearchAPI } from '@/app/search/api/search-api';
export { CategoriesAPI } from '@/app/categories/api/categories-api';
export { AddressesAPI } from '@/app/user/api/addresses-api';
export { PaymentMethodsAPI } from '@/app/user/api/payment-methods-api';
export { CatalogAPI } from '@/app/catalog/api/catalog-api';
export { DeliveryAPI } from '@/app/delivery/api/delivery-api';

// Re-export types
export * from '@/shared/types/api.types';
