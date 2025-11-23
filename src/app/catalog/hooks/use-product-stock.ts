import { useQuery } from '@tanstack/react-query';
import { CatalogAPI } from '../api/catalog-api';
// no explicit Product typing needed here

export function useProductStock(productId?: string) {
  return useQuery({
    queryKey: ['product-stock', productId],
    queryFn: () => CatalogAPI.getProductStock(productId!),
    enabled: !!productId,
    staleTime: 30 * 1000, // 30s
    refetchOnWindowFocus: false,
  });
}
