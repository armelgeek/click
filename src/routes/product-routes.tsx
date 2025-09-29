import ProductDetailPage from '@/pages/public/catalog/product-detail-page';

export const productRoutes = [
  {
    path: '/product/:productId',
    element: <ProductDetailPage />,
  },
];
