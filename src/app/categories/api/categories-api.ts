import { apiClient, API_ENDPOINTS } from '@/shared/config/api.config';
import { Category, PaginationParams, PaginatedResponse } from '@/shared/types/api.types';

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
  ): Promise<PaginatedResponse<{ id: string; name: string; price: number; image?: string }>> {
    const response = await apiClient.get<PaginatedResponse<{
      priceTTC: number; id: string; name: string; price?: number; image?: string 
    }>>(
      API_ENDPOINTS.categories.products(categoryId),
      { params }
    );

    const { data: items = [], total, page, limit, totalPages } = response.data;

    const formattedData = items.map(item => ({
      id: item.id,
      name: item.name,
      image: item.image,
      price: (item.priceTTC ?? item.price ?? 0) as number
    }));

    return {
      data: formattedData,
      total,
      page,
      limit,
      totalPages
    };
  }
}
