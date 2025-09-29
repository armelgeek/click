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

export interface Product {
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

export interface ProductsResponse {
  products: Product[];
}