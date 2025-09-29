import ShopProductsPage from '@/pages/public/catalog/shop-products-page';
import ShopListPage from '@/pages/public/catalog/shop-list-page';

export const shopRoutes = [
  {
    path: '/shops',
    element: <ShopListPage />,
  },
  {
    path: '/shop/:shopId',
    element: <ShopProductsPage />, 
  },
];
