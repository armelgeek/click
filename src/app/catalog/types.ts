export interface Store {
  id: string;
  name: string;
  logoUrl?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  phoneNumber?: string;
  openingHours?: {
    [day: string]: string;
  };
  status: "ACTIVATED" | "DISABLED";
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  category: string;
  image?: string;
  images?: string[];
  owner?: string;
  priceHT: number;
  priceTTC: number;
  vat: string;
  status: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export type StoresResponse = PaginatedResponse<Store>;
export type ProductsResponse = PaginatedResponse<Product>;

// Legacy types for backward compatibility with existing UI
export interface Shop {
  id: string;
  name: string;
  address?: string;
  image?: string;
  isNearby?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  shopId: string;
}

export interface LegacyProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  shopId: string;
  categoryId: string;
}

export interface ShopsResponse {
  shops: Shop[];
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface LegacyProductsResponse {
  products: LegacyProduct[];
}
