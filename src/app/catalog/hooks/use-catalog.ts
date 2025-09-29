import { useState, useEffect } from 'react';
import { CatalogAPI } from '../api/catalog-api';
import { Shop, Category, Product } from '../types';

export function useShops() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchShops = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await CatalogAPI.getShops();
        if (mounted) {
          setShops(response.shops);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch shops');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchShops();

    return () => {
      mounted = false;
    };
  }, []);

  return { shops, loading, error };
}

export function useShopCategories(shopId?: string) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shopId) {
      setCategories([]);
      setLoading(false);
      return;
    }

    let mounted = true;

    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await CatalogAPI.getCategoriesByShop(shopId);
        if (mounted) {
          setCategories(response.categories);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch categories');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      mounted = false;
    };
  }, [shopId]);

  return { categories, loading, error };
}

export function useShopProducts(shopId?: string, categoryId?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shopId) {
      setProducts([]);
      setLoading(false);
      return;
    }

    let mounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await CatalogAPI.getProductsByShopAndCategory(shopId, categoryId);
        if (mounted) {
          setProducts(response.products);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch products');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, [shopId, categoryId]);

  return { products, loading, error };
}

export function useShop(shopId?: string) {
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shopId) {
      setShop(null);
      setLoading(false);
      return;
    }

    let mounted = true;

    const fetchShop = async () => {
      try {
        setLoading(true);
        setError(null);
        const shopData = await CatalogAPI.getShopById(shopId);
        if (mounted) {
          setShop(shopData);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch shop');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchShop();

    return () => {
      mounted = false;
    };
  }, [shopId]);

  return { shop, loading, error };
}