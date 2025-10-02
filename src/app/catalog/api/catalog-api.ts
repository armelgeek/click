import { 
  Store, 
  Product, 
  StoresResponse, 
  ProductsResponse,
  ShopsResponse, 
  CategoriesResponse, 
  LegacyProductsResponse,
  Shop
} from '../types';
import { apiClient, API_ENDPOINTS } from '@/shared/config/api.config';
import { mockShops, mockCategories } from '../data/mock-data';


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
  ): Promise<ProductsResponse> {
    const response = await apiClient.get<ProductsResponse>(
      API_ENDPOINTS.stores.products(storeId),
      {
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          search: params.search,
        },
      }
    );
    return response.data;
  }

  static async getAllProducts(params: ProductsQueryParams = {}): Promise<ProductsResponse> {


    const response = await apiClient.get<ProductsResponse>(API_ENDPOINTS.products.list, {
      params: {
        page: params.page || 1,
        limit: params.limit || 20,
        search: params.search,
      },
    });
    return response.data;
  }

  static async getProductById(productId: string): Promise<Product> {

    const response = await apiClient.get<Product>(API_ENDPOINTS.products.detail(productId));
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
    await delay(200);
    const categories = mockCategories.filter(cat => cat.shopId === shopId);
    return {
      categories
    };
  }

  static async getProductsByShopAndCategory(
    shopId: string, 
    categoryId?: string
  ): Promise<LegacyProductsResponse> {
    await delay(250);

   
    return {
      products: []
    };
  }

  static async getShopById(shopId: string): Promise<Shop | null> {
    await delay(150);
    return mockShops.find(shop => shop.id === shopId) || null;
  }
}
