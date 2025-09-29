import { DeliveryTracking, DeliveryDriver, DeliveryLocation, DeliveryTimelineItem } from '../types';

// Mock delivery drivers
export const mockDrivers: DeliveryDriver[] = [
  {
    id: 'driver-001',
    name: 'Pierre Martin',
    phone: '+33 6 12 34 56 78',
    photo: '/images/driver-avatar.png',
    vehicleType: 'bike',
    rating: 4.8
  },
  {
    id: 'driver-002',
    name: 'Sophie Dubois',
    phone: '+33 6 98 76 54 32',
    photo: '/images/driver-avatar.png',
    vehicleType: 'scooter',
    rating: 4.9
  },
  {
    id: 'driver-003',
    name: 'Malik Benzema',
    phone: '+33 6 55 44 33 22',
    photo: '/images/driver-avatar.png',
    vehicleType: 'car',
    rating: 4.7
  }
];

// Mock locations in Paris area
export const mockLocations: Record<string, DeliveryLocation> = {
  shop: {
    coordinates: { latitude: 48.8566, longitude: 2.3522 },
    address: '15 Rue de la Paix, 75001 Paris',
    landmark: 'ClickNVape Store Gare du Nord'
  },
  destination: {
    coordinates: { latitude: 48.8606, longitude: 2.3376 },
    address: '42 Avenue des Champs-Élysées, 75008 Paris',
    landmark: 'Près de l\'Arc de Triomphe'
  },
  currentPosition: {
    coordinates: { latitude: 48.8584, longitude: 2.3449 },
    address: '10 Rue de Rivoli, 75001 Paris',
    landmark: 'En face du Louvre'
  }
};

// Mock timeline items
const createTimeline = (orderId: string): DeliveryTimelineItem[] => [
  {
    id: `${orderId}-timeline-1`,
    status: 'preparing',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
    description: 'Commande reçue et en cours de préparation',
    location: 'ClickNVape Store Gare du Nord'
  },
  {
    id: `${orderId}-timeline-2`,
    status: 'ready',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 minutes ago
    description: 'Commande prête pour le ramassage',
    location: 'ClickNVape Store Gare du Nord'
  },
  {
    id: `${orderId}-timeline-3`,
    status: 'picked_up',
    timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20 minutes ago
    description: 'Commande récupérée par le livreur',
    location: 'ClickNVape Store Gare du Nord'
  },
  {
    id: `${orderId}-timeline-4`,
    status: 'on_the_way',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    description: 'En route vers votre adresse',
    location: 'Rue de Rivoli, Paris'
  }
];

// Mock delivery tracking data
export const mockDeliveryTracking: Record<string, DeliveryTracking> = {
  '1578': {
    id: 'delivery-001',
    orderId: '1578',
    status: 'on_the_way',
    estimatedTimeMinutes: 12,
    driver: mockDrivers[0],
    currentLocation: mockLocations.currentPosition,
    destination: mockLocations.destination,
    shopLocation: mockLocations.shop,
    timeline: createTimeline('1578'),
    canCall: true,
    canMessage: true,
    lastUpdated: new Date().toISOString()
  },
  '1579': {
    id: 'delivery-002',
    orderId: '1579',
    status: 'preparing',
    estimatedTimeMinutes: 35,
    driver: mockDrivers[1],
    currentLocation: mockLocations.shop,
    destination: mockLocations.destination,
    shopLocation: mockLocations.shop,
    timeline: createTimeline('1579').slice(0, 1), // Only first timeline item
    canCall: false,
    canMessage: false,
    lastUpdated: new Date().toISOString()
  },
  '1580': {
    id: 'delivery-003',
    orderId: '1580',
    status: 'delivered',
    estimatedTimeMinutes: 0,
    driver: mockDrivers[2],
    currentLocation: mockLocations.destination,
    destination: mockLocations.destination,
    shopLocation: mockLocations.shop,
    timeline: [
      ...createTimeline('1580'),
      {
        id: '1580-timeline-5',
        status: 'delivered',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
        description: 'Commande livrée avec succès',
        location: 'Avenue des Champs-Élysées, Paris'
      }
    ],
    canCall: false,
    canMessage: false,
    lastUpdated: new Date().toISOString()
  }
};

// Helper function to get status display info
export const getStatusDisplayInfo = (status: string) => {
  switch (status) {
    case 'preparing':
      return { label: 'En préparation', color: 'bg-yellow-500' };
    case 'ready':
      return { label: 'Prêt pour ramassage', color: 'bg-blue-500' };
    case 'picked_up':
      return { label: 'Récupéré', color: 'bg-indigo-500' };
    case 'on_the_way':
      return { label: 'En cours de livraison', color: 'bg-green-500' };
    case 'nearby':
      return { label: 'À proximité', color: 'bg-green-600' };
    case 'delivered':
      return { label: 'Livré', color: 'bg-green-700' };
    case 'failed':
      return { label: 'Échec de livraison', color: 'bg-red-500' };
    case 'returned':
      return { label: 'Retourné au magasin', color: 'bg-orange-500' };
    default:
      return { label: 'Statut inconnu', color: 'bg-gray-500' };
  }
};