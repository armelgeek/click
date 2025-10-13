import { useState, useEffect, useCallback } from 'react';
import { CatalogAPI, StoresQueryParams, ProductsQueryParams } from '../api/catalog-api';
import { Store, Product, PaginationMeta, LegacyProduct } from '../types';

export function useStores(params: StoresQueryParams = {}) {
  const [stores, setStores] = useState<Store[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { page, limit, search, region } = params;

  const fetchStores = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await CatalogAPI.getStores({ page, limit, search, region });
      setStores(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, region]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  return { stores, meta, loading, error, refetch: fetchStores };
}

export function useStore(storeId?: string) {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storeId) {
      setStore(null);
      setLoading(false);
      return;
    }

    let mounted = true;

    const fetchStore = async () => {
      try {
        setLoading(true);
        setError(null);
        const storeData = await CatalogAPI.getStoreById(storeId);
        if (mounted) {
          setStore(storeData);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch store');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchStore();

    return () => {
      mounted = false;
    };
  }, [storeId]);

  return { store, loading, error };
}

export function useStoreProducts(storeId?: string, params: ProductsQueryParams = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { page, limit, search } = params;

  const fetchProducts = useCallback(async () => {
    if (!storeId) {
      setProducts([]);
      setMeta(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await CatalogAPI.getStoreProducts(storeId, { page, limit, search });
      setProducts(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [storeId, page, limit, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, meta, loading, error, refetch: fetchProducts };
}

export function useProducts(params: ProductsQueryParams = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { page, limit, search } = params;

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await CatalogAPI.getAllProducts({ page, limit, search });
      setProducts(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, meta, loading, error, refetch: fetchProducts };
}

export function useProduct(productId?: string) {
  const [product, setProduct] = useState<LegacyProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      setLoading(false);
      return;
    }

    let mounted = true;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const productData = await CatalogAPI.getProductById(productId);
        if (mounted) {
          const api = productData as Product & { shopId?: string; shop_id?: string; categoryId?: string; category_id?: string };
          const shopId: string =
            api.shopId ?? api.storeId ?? api.shop_id ?? '';
          const categoryId: string =
            api.categoryId ?? api.category_id ?? '';

          setProduct({
            id: productData.id,
            name: productData.name,
            description: '',
            price: productData.priceTTC,
            image: productData.image ?? '',
            shopId,
            categoryId,
          });
         }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch product');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      mounted = false;
    };
  }, [productId]);

  return { product, loading, error };
}

export function useSimilarProducts(productId?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setProducts([]);
      return;
    }

    const fetchSimilarProducts = async () => {
      try {
        setLoading(true);
        const similarProducts = await CatalogAPI.getSimilarProducts(productId);
        setProducts(similarProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch similar products');
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [productId]);

  return { products, loading, error };
}
