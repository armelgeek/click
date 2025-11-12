import { DeliveryTrackingResponse, DeliveryStatusUpdateResponse, DeliveryTracking, DeliveryTimelineItem, DeliveryStatus } from '../types';
import { mockDeliveryTracking, mockDrivers, mockLocations } from '../data/mock-data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Storage for dynamic delivery trackings
const deliveryTrackings = new Map<string, DeliveryTracking>(
  Object.entries(mockDeliveryTracking)
);

// Storage for order creation times to simulate progression
const orderCreationTimes = new Map<string, number>();

// Helper to create timeline based on status
const createTimelineForStatus = (orderId: string, status: string): DeliveryTimelineItem[] => {
  const now = Date.now();
  const baseTimeline: DeliveryTimelineItem[] = [
    {
      id: `${orderId}-timeline-1`,
      status: 'preparing',
      timestamp: new Date(now - 10 * 60 * 1000).toISOString(),
      description: 'Commande reçue et en cours de préparation',
      location: 'ClickNVape Store'
    }
  ];

  if (status === 'preparing') return baseTimeline;

  baseTimeline.push({
    id: `${orderId}-timeline-2`,
    status: 'ready',
    timestamp: new Date(now - 8 * 60 * 1000).toISOString(),
    description: 'Commande prête pour le ramassage',
    location: 'ClickNVape Store'
  });

  if (status === 'ready') return baseTimeline;

  baseTimeline.push({
    id: `${orderId}-timeline-3`,
    status: 'picked_up',
    timestamp: new Date(now - 6 * 60 * 1000).toISOString(),
    description: 'Commande récupérée par le livreur',
    location: 'ClickNVape Store'
  });

  if (status === 'picked_up') return baseTimeline;

  baseTimeline.push({
    id: `${orderId}-timeline-4`,
    status: 'on_the_way',
    timestamp: new Date(now - 3 * 60 * 1000).toISOString(),
    description: 'En route vers votre adresse',
    location: 'En transit'
  });

  if (status === 'on_the_way') return baseTimeline;

  if (status === 'delivered') {
    baseTimeline.push({
      id: `${orderId}-timeline-5`,
      status: 'delivered',
      timestamp: new Date(now).toISOString(),
      description: 'Commande livrée avec succès',
      location: 'Adresse de livraison'
    });
  }

  return baseTimeline;
};

// Simulate delivery status progression based on time elapsed
const getDeliveryStatus = (orderId: string): { status: DeliveryStatus; estimatedMinutes: number; canCall: boolean; canMessage: boolean } => {
  const creationTime = orderCreationTimes.get(orderId) || Date.now();
  const elapsedMinutes = (Date.now() - creationTime) / (60 * 1000);

  // Simulate progression: preparing (0-2min) -> ready (2-3min) -> picked_up (3-4min) -> on_the_way (4-8min) -> delivered (8min+)
  if (elapsedMinutes < 2) {
    return { status: 'preparing', estimatedMinutes: 23, canCall: false, canMessage: false };
  } else if (elapsedMinutes < 3) {
    return { status: 'ready', estimatedMinutes: 20, canCall: false, canMessage: false };
  } else if (elapsedMinutes < 4) {
    return { status: 'picked_up', estimatedMinutes: 15, canCall: true, canMessage: true };
  } else if (elapsedMinutes < 8) {
    const remaining = Math.max(1, Math.floor(12 - elapsedMinutes));
    return { status: 'on_the_way', estimatedMinutes: remaining, canCall: true, canMessage: true };
  } else {
    return { status: 'delivered', estimatedMinutes: 0, canCall: false, canMessage: false };
  }
};

// Auto-generate delivery tracking for new orders
const getOrCreateDeliveryTracking = (orderId: string): DeliveryTracking => {
  // Initialize creation time if this is a new order
  if (!orderCreationTimes.has(orderId)) {
    orderCreationTimes.set(orderId, Date.now());
  }

  const statusInfo = getDeliveryStatus(orderId);
  
  // Check if we have existing tracking
  if (deliveryTrackings.has(orderId)) {
    const existing = deliveryTrackings.get(orderId)!;
    // Update with current simulated status
    existing.status = statusInfo.status;
    existing.estimatedTimeMinutes = statusInfo.estimatedMinutes;
    existing.canCall = statusInfo.canCall;
    existing.canMessage = statusInfo.canMessage;
    existing.timeline = createTimelineForStatus(orderId, statusInfo.status);
    existing.lastUpdated = new Date().toISOString();
    
    // Update location based on status
    if (statusInfo.status === 'on_the_way') {
      existing.currentLocation = mockLocations.currentPosition;
    } else if (statusInfo.status === 'delivered') {
      existing.currentLocation = mockLocations.destination;
    }
    
    return existing;
  }

  // Create new delivery tracking for this order
  const randomDriver = mockDrivers[Math.floor(Math.random() * mockDrivers.length)];
  const newTracking: DeliveryTracking = {
    id: `delivery-${orderId}`,
    orderId,
    status: statusInfo.status,
    estimatedTimeMinutes: statusInfo.estimatedMinutes,
    driver: randomDriver,
    currentLocation: mockLocations.shop,
    destination: mockLocations.destination,
    shopLocation: mockLocations.shop,
    timeline: createTimelineForStatus(orderId, statusInfo.status),
    canCall: statusInfo.canCall,
    canMessage: statusInfo.canMessage,
    lastUpdated: new Date().toISOString()
  };

  deliveryTrackings.set(orderId, newTracking);
  return newTracking;
};

export class DeliveryAPI {

  static async getOrderTracking(orderId: string): Promise<DeliveryTrackingResponse> {
    await delay(300);
    const tracking = getOrCreateDeliveryTracking(orderId);
    return { tracking };
  }

  static async getStatusUpdates(orderId: string): Promise<DeliveryStatusUpdateResponse> {
    await delay(150);
    const tracking = getOrCreateDeliveryTracking(orderId);
    
    return {
      success: true,
      data: {
        orderId: tracking.orderId,
        status: tracking.status,
        estimatedTimeMinutes: tracking.estimatedTimeMinutes,
        currentLocation: tracking.currentLocation,
        lastUpdated: tracking.lastUpdated
      }
    };
  }

  static async callDriver(_orderId: string): Promise<{ success: boolean; message: string }> {
    await delay(500);
    return {
      success: true,
      message: 'Appel en cours vers le livreur...'
    };
  }

  static async sendMessage(_orderId: string, _message: string): Promise<{ success: boolean; response: string }> {
    await delay(800);
    return {
      success: true,
      response: 'Message reçu, je serai là dans quelques minutes !'
    };
  }

  static async markAsReceived(orderId: string): Promise<{ success: boolean; message: string }> {
    await delay(400);
    
    // Update tracking status to delivered
    const tracking = getOrCreateDeliveryTracking(orderId);
    tracking.status = 'delivered';
    tracking.estimatedTimeMinutes = 0;
    tracking.timeline = createTimelineForStatus(orderId, 'delivered');
    tracking.lastUpdated = new Date().toISOString();
    deliveryTrackings.set(orderId, tracking);
    
    return {
      success: true,
      message: 'Commande marquée comme reçue avec succès'
    };
  }
}