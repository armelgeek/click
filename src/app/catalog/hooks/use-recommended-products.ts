import { useQuery } from '@tanstack/react-query';
import { CatalogAPI } from '../api/catalog-api';
import { Product } from '../types';

export function useRecommendedProducts(productId?: string, enabled: boolean = true) {
  return useQuery<Product[]>({
    queryKey: ['recommendedProducts', productId],
    queryFn: () => CatalogAPI.getSimilarProducts(productId || ''),
    enabled: enabled && !!productId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: [],
  });
}