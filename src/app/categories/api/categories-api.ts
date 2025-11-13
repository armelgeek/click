
import { apiClient, API_ENDPOINTS } from '@/shared/config/api.config';
import { Category, PaginationParams, PaginatedResponse } from '@/shared/types/api.types';

// Typage strict pour le produit tel que renvoyé par l'API
interface CategoryProductApi {
  id: string;
  name: string;
  priceTTC?: number;
  price?: number;
  image?: string;
}

// Typage pour le front (produit formaté)
export interface CategoryProduct {
  id: string;
  name: string;
  price: number;
  image?: string;
}

export class CategoriesAPI {
  
  static async getAllCategories(): Promise<{ categories: Category[] }> {
    const response = await apiClient.get<{ categories: Category[] }>(
      API_ENDPOINTS.categories.list
    );
    return response.data;
  }

  static async getCategoryById(categoryId: string): Promise<Category> {
    const response = await apiClient.get<Category>(
      API_ENDPOINTS.categories.detail(categoryId)
    );
    return response.data;
  }

  static async getProductsByCategory(
    categoryId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<CategoryProduct>> {
    const response = await apiClient.get<PaginatedResponse<CategoryProductApi>>(
      API_ENDPOINTS.categories.products(categoryId),
      { params }
    );

    const { data: items = [], total, page, limit, totalPages } = response.data;

    const formattedData: CategoryProduct[] = items.map((item) => ({
      id: item.id,
      name: item.name,
      image: item.image,
      price: typeof item.priceTTC === 'number' ? item.priceTTC : (item.price ?? 0),
    }));

    return {
      data: formattedData,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
