import { Shop, Category, Product } from '../types';

export const mockShops: Shop[] = [
  { id: 'gare-du-nord', name: 'Gare du Nord', isNearby: true },
  { id: 'plaisance', name: 'Plaisance', isNearby: true },
  { id: 'la-fayette', name: 'La Fayette', isNearby: true },
  { id: 'agneaux', name: 'Agneaux', isNearby: false },
  { id: 'avranches', name: 'Avranches', isNearby: false },
  { id: 'dieppe', name: 'Dieppe', isNearby: false },
  { id: 'casablanca', name: 'Casablanca', isNearby: false },
  { id: 'bordeaux', name: 'Bordeaux', isNearby: false },
  { id: 'buxerolles', name: 'Buxerolles', isNearby: false },
  { id: 'pessac', name: 'Pessac', isNearby: false },
  { id: 'royan', name: 'Royan', isNearby: false },
  { id: 'le-bouscat', name: 'Le Bouscat', isNearby: false },
];

export const mockCategories: Category[] = [
  { id: 'e-liquides', name: 'E-liquides', shopId: 'gare-du-nord' },
  { id: 'diy', name: 'DIY', shopId: 'gare-du-nord' },
  { id: 'e-cig', name: 'E-cig', shopId: 'gare-du-nord' },
  { id: 'accessoires', name: 'Accessoires', shopId: 'gare-du-nord' },
  ...mockShops.slice(1).flatMap(shop => [
    { id: `e-liquides-${shop.id}`, name: 'E-liquides', shopId: shop.id },
    { id: `diy-${shop.id}`, name: 'DIY', shopId: shop.id },
    { id: `e-cig-${shop.id}`, name: 'E-cig', shopId: shop.id },
    { id: `accessoires-${shop.id}`, name: 'Accessoires', shopId: shop.id },
  ])
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Blue Devil By Avap 50ml',
    price: 25.90,
    image: '/icons/product.png',
    shopId: 'gare-du-nord',
    categoryId: 'e-liquides'
  },
  {
    id: '2',
    name: 'Red Storm Premium 50ml',
    price: 29.90,
    image: '/icons/product.png',
    shopId: 'gare-du-nord',
    categoryId: 'e-liquides'
  },
  {
    id: '3',
    name: 'Green Mint Fresh 50ml',
    price: 22.90,
    image: '/icons/product.png',
    shopId: 'gare-du-nord',
    categoryId: 'e-liquides'
  },
  {
    id: '4',
    name: 'Base DIY 50/50 100ml',
    price: 8.90,
    image: '/icons/product.png',
    shopId: 'gare-du-nord',
    categoryId: 'diy'
  },
  {
    id: '5',
    name: 'Arôme Vanille 10ml',
    price: 5.90,
    image: '/icons/product.png',
    shopId: 'gare-du-nord',
    categoryId: 'diy'
  },
  {
    id: '6',
    name: 'Pod Starter Kit',
    price: 45.90,
    image: '/icons/product.png',
    shopId: 'gare-du-nord',
    categoryId: 'e-cig'
  },
  {
    id: '7',
    name: 'Box Mod Advanced',
    price: 89.90,
    image: '/icons/product.png',
    shopId: 'gare-du-nord',
    categoryId: 'e-cig'
  },
  {
    id: '8',
    name: 'Résistances Pack x5',
    price: 12.90,
    image: '/icons/product.png',
    shopId: 'gare-du-nord',
    categoryId: 'accessoires'
  },
];

mockShops.slice(1).forEach((shop, shopIndex) => {
  const baseProducts = [
    {
      name: 'Local E-liquid 50ml',
      price: 24.90,
      categoryId: `e-liquides-${shop.id}`
    },
    {
      name: 'Premium Flavor 50ml',
      price: 27.90,
      categoryId: `e-liquides-${shop.id}`
    },
    {
      name: 'DIY Base 100ml',
      price: 9.90,
      categoryId: `diy-${shop.id}`
    },
    {
      name: 'Pod Device',
      price: 42.90,
      categoryId: `e-cig-${shop.id}`
    },
    {
      name: 'Coil Pack',
      price: 11.90,
      categoryId: `accessoires-${shop.id}`
    }
  ];

  baseProducts.forEach((product, productIndex) => {
    mockProducts.push({
      id: `${shopIndex + 2}-${productIndex + 1}`,
      name: product.name,
      price: product.price,
      image: '/icons/product.png',
      shopId: shop.id,
      categoryId: product.categoryId
    });
  });
});