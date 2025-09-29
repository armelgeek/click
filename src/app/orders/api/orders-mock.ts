import { Order, orderStatusMap } from '../types/order.schema';

const mockOrders: Order[] = [
  {
    id: '1579',
    number: 1579,
    status: 'delivered',
    statusLabel: orderStatusMap.delivered.label,
    statusColor: orderStatusMap.delivered.color,
    date: '25/06/2024 - 11h30',
    estimatedDelivery: '25/06/2024 - 12h00',
    deliveryAddress: '123 Rue de la Paix, 75001 Paris',
    totalAmount: 89.99,
    currency: 'EUR',
    items: [
      {
        id: '1',
        name: 'Kit de démarrage Vape Pro',
        quantity: 1,
        price: 59.99,
        image: '/images/vape-kit.jpg'
      },
      {
        id: '2',
        name: 'E-liquide Menthe 10ml',
        quantity: 3,
        price: 10.00,
        image: '/images/e-liquid.jpg'
      }
    ],
    proofOfDelivery: {
      type: 'photo',
      image: '/images/delivery-proof-1579.jpg',
      timestamp: '25/06/2024 - 11h35'
    }
  },
  {
    id: '1580',
    number: 1580,
    status: 'delivered',
    statusLabel: orderStatusMap.delivered.label,
    statusColor: orderStatusMap.delivered.color,
    date: '26/06/2024 - 11h30',
    estimatedDelivery: '26/06/2024 - 12h15',
    deliveryAddress: '456 Avenue des Champs, 75008 Paris',
    totalAmount: 149.50,
    currency: 'EUR',
    items: [
      {
        id: '3',
        name: 'Cigarette électronique Premium',
        quantity: 1,
        price: 119.99,
        image: '/images/premium-vape.jpg'
      },
      {
        id: '4',
        name: 'Kit de recharge',
        quantity: 1,
        price: 29.51,
        image: '/images/refill-kit.jpg'
      }
    ],
    proofOfDelivery: {
      type: 'signature',
      signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      timestamp: '26/06/2024 - 11h45'
    }
  },
  {
    id: '1581',
    number: 1581,
    status: 'out_for_delivery',
    statusLabel: orderStatusMap.out_for_delivery.label,
    statusColor: orderStatusMap.out_for_delivery.color,
    date: '27/06/2024 - 10h15',
    estimatedDelivery: '27/06/2024 - 12h30',
    deliveryAddress: '789 Boulevard Saint-Germain, 75006 Paris',
    totalAmount: 74.99,
    currency: 'EUR',
    items: [
      {
        id: '5',
        name: 'Pack découverte saveurs',
        quantity: 1,
        price: 74.99,
        image: '/images/flavor-pack.jpg'
      }
    ],
    tracking: {
      driverName: 'Pierre Martin',
      driverPhone: '+33 6 12 34 56 78',
      currentLocation: {
        lat: 48.8566,
        lng: 2.3522
      },
      estimatedArrival: '27/06/2024 - 12h15'
    }
  },
  {
    id: '1582',
    number: 1582,
    status: 'preparing',
    statusLabel: orderStatusMap.preparing.label,
    statusColor: orderStatusMap.preparing.color,
    date: '27/06/2024 - 14h00',
    estimatedDelivery: '27/06/2024 - 16h00',
    deliveryAddress: '321 Rue de Rivoli, 75001 Paris',
    totalAmount: 199.99,
    currency: 'EUR',
    items: [
      {
        id: '6',
        name: 'Vape Advanced Edition',
        quantity: 1,
        price: 159.99,
        image: '/images/advanced-vape.jpg'
      },
      {
        id: '7',
        name: 'Accessoires premium',
        quantity: 1,
        price: 40.00,
        image: '/images/accessories.jpg'
      }
    ]
  },
  {
    id: '1583',
    number: 1583,
    status: 'returned',
    statusLabel: orderStatusMap.returned.label,
    statusColor: orderStatusMap.returned.color,
    date: '24/06/2024 - 09h00',
    estimatedDelivery: '24/06/2024 - 11h00',
    deliveryAddress: '654 Rue du Faubourg, 75010 Paris',
    totalAmount: 39.99,
    currency: 'EUR',
    items: [
      {
        id: '8',
        name: 'E-liquide bio 20ml',
        quantity: 2,
        price: 19.99,
        image: '/images/bio-liquid.jpg'
      }
    ]
  }
];

export class OrdersMockService {
  static async getOrders(): Promise<Order[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockOrders;
  }

  static async getOrderById(id: string): Promise<Order | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockOrders.find(order => order.id === id) || null;
  }

  static async getOrdersByStatus(status: Order['status']): Promise<Order[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockOrders.filter(order => order.status === status);
  }
}