import { 
  Store, 
  Product, 
  StoresResponse, 
  ShopsResponse, 
  CategoriesResponse, 
  LegacyProductsResponse,
  Shop
} from '../types';
// Typage paginé pour les produits (infinite scroll)
export interface PaginatedProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Backend API response structure with meta
interface BackendPaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

import { apiClient, API_ENDPOINTS } from '@/shared/config/api.config';

export interface StoresQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  region?: string;
}

export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export class CatalogAPI {
  
  static async getStores(params: StoresQueryParams = {}): Promise<StoresResponse> {
  
    const response = await apiClient.get<StoresResponse>(API_ENDPOINTS.stores.list, {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        search: params.search,
        region: params.region,
      },
    });
    return response.data;
  }

  static async getStoreById(storeId: string): Promise<Store> {
   
    const response = await apiClient.get<Store>(API_ENDPOINTS.stores.detail(storeId));
    return response.data;
  }

  static async getStoreProducts(
    storeId: string, 
    params: ProductsQueryParams = {}
  ): Promise<PaginatedProductsResponse> {
    const response = await apiClient.get<BackendPaginatedResponse<Product>>(
      API_ENDPOINTS.stores.products(storeId),
      {
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          search: params.search,
        },
      }
    );
    // On suppose que la réponse backend contient { data, meta }
    const { data = [], meta } = response.data;
    return {
      data: data.map((item: Product) => ({
          ...item,
          image: '/icons/product.png',
          price: item.priceTTC ?? 0,
      })),
      total: meta?.total ?? data.length,
      page: meta?.page ?? 1,
      limit: meta?.limit ?? 20,
      totalPages: meta?.totalPages ?? 1,
    };
  }

  static async getAllProducts(params: ProductsQueryParams = {}): Promise<PaginatedProductsResponse> {
    const response = await apiClient.get<BackendPaginatedResponse<Product>>(API_ENDPOINTS.products.list, {
      params: {
        page: params.page || 1,
        limit: params.limit || 20,
        search: params.search,
      },
    });
    const { data = [], meta } = response.data;
    return {
      data,
      total: meta?.total ?? data.length,
      page: meta?.page ?? 1,
      limit: meta?.limit ?? 20,
      totalPages: meta?.totalPages ?? 1,
    };
  }

  static async getProductById(productId: string): Promise<Product> {

    const response = await apiClient.get<Product>(API_ENDPOINTS.products.detail(productId));
    return response.data;
  }

  static async getSimilarProducts(productId: string): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(API_ENDPOINTS.products.similar(productId));
    return response.data;
  }

  static async getShops(): Promise<ShopsResponse> {
    const response = await apiClient.get(API_ENDPOINTS.stores.list);
    if(response.data && Array.isArray(response.data.data)) {
      return {
        shops: response.data.data.map((store: Store) => ({
          id: store.id,
          name: store.name,
          address: store.address,
          image: store.logoUrl,
        })),
      };
    }
    return {
      shops:  []
    };
  }

  static async getCategoriesByShop(shopId: string): Promise<CategoriesResponse> {
    const response = await apiClient.get(API_ENDPOINTS.categories.list, {
      params: { shopId }
    });
    return {
      categories: response.data || null
    };
  }

  static async getProductsByShopAndCategory(
    shopId: string, 
    categoryId?: string
  ): Promise<LegacyProductsResponse> {

   const response = await apiClient.get(API_ENDPOINTS.stores.by(shopId, categoryId || ''));
    if(response.data && Array.isArray(response.data.data)) {
      return {
        products: response.data.data.map((prod: Product) => ({
          id: prod.id,
          name: prod.name,
          price: prod.priceTTC,
          image: prod.image || '',
          description: '',
          shopId: prod.storeId,
          categoryId: categoryId || '',
        })),
      };
    }
    return {
      products: []
    };
  }

  static async getShopById(shopId: string): Promise<Shop | null> {
    const response = await apiClient.get(API_ENDPOINTS.stores.detail(shopId));
    return response.data || null;
  }

  static async getProductStock(productId: string): Promise<{
    productId: string;
    storeId: string;
    quantity: number;
    inStock: boolean;
    status: string;
  }> {
    const response = await apiClient.get(API_ENDPOINTS.products.stock(productId));
    return response.data;
  }
}
