import { ShopsResponse, CategoriesResponse, ProductsResponse } from '../types';
import { mockShops, mockCategories, mockProducts } from '../data/mock-data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class CatalogAPI {
 
  static async getShops(): Promise<ShopsResponse> {
    await delay(300); 
    return {
      shops: mockShops
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
  ): Promise<ProductsResponse> {
    await delay(250);
    
    let products = mockProducts.filter(product => product.shopId === shopId);
    
    if (categoryId) {
      products = products.filter(product => product.categoryId === categoryId);
    }
    
    return {
      products
    };
  }

 
  static async getShopById(shopId: string) {
    await delay(150);
    return mockShops.find(shop => shop.id === shopId) || null;
  }
}