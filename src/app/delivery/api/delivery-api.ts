import { DeliveryTrackingResponse, DeliveryStatusUpdateResponse } from '../types';
import { mockDeliveryTracking } from '../data/mock-data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class DeliveryAPI {

  static async getOrderTracking(orderId: string): Promise<DeliveryTrackingResponse> {
    await delay(250); 
    
    const tracking = mockDeliveryTracking[orderId];
    
    if (!tracking) {
      throw new Error(`Order ${orderId} not found`);
    }

    const now = new Date();
    const updatedTracking = {
      ...tracking,
      lastUpdated: now.toISOString(),
      estimatedTimeMinutes: tracking.status === 'on_the_way' && tracking.estimatedTimeMinutes > 0
        ? Math.max(0, tracking.estimatedTimeMinutes - Math.floor(Math.random() * 2))
        : tracking.estimatedTimeMinutes
    };

    return {
      tracking: updatedTracking
    };
  }

  static async getStatusUpdates(orderId: string): Promise<DeliveryStatusUpdateResponse> {
    await delay(100);
    
    const tracking = mockDeliveryTracking[orderId];
    
    if (!tracking) {
      throw new Error(`Order ${orderId} not found`);
    }

    const baseCoords = tracking.currentLocation.coordinates;
    const randomOffset = () => (Math.random() - 0.5) * 0.001;
    
    return {
      success: true,
      data: {
        orderId,
        status: tracking.status,
        estimatedTimeMinutes: Math.max(0, tracking.estimatedTimeMinutes - 1), 
        currentLocation: {
          ...tracking.currentLocation,
          coordinates: {
            latitude: baseCoords.latitude + randomOffset(),
            longitude: baseCoords.longitude + randomOffset()
          }
        },
        lastUpdated: new Date().toISOString()
      }
    };
  }

  
  static async callDriver(orderId: string): Promise<{ success: boolean; message: string }> {
    await delay(500);
    
    const tracking = mockDeliveryTracking[orderId];
    if (!tracking || !tracking.canCall) {
      return {
        success: false,
        message: 'Impossible d\'appeler le livreur pour le moment'
      };
    }

    return {
      success: true,
      message: `Appel vers ${tracking.driver.name} (${tracking.driver.phone})`
    };
  }


  static async sendMessage(orderId: string, message: string): Promise<{ success: boolean; response: string }> {
    await delay(800);
    
    const tracking = mockDeliveryTracking[orderId];
    if (!tracking || !tracking.canMessage) {
      return {
        success: false,
        response: 'Impossible d\'envoyer un message pour le moment'
      };
    }

    console.log(`Message sent to driver for order ${orderId}:`, message);

    const responses = [
      'Message reçu, j\'arrive dans quelques minutes !',
      'Je suis en route, merci pour votre patience.',
      'Presque arrivé, je vous contacte dès que je suis en bas.',
      'Message bien reçu, à bientôt !'
    ];

    return {
      success: true,
      response: responses[Math.floor(Math.random() * responses.length)]
    };
  }

  static async markAsReceived(orderId: string): Promise<{ success: boolean; message: string }> {
    await delay(300);
    
    const tracking = mockDeliveryTracking[orderId];
    if (!tracking) {
      return {
        success: false,
        message: 'Commande non trouvée'
      };
    }

    if (tracking.status === 'delivered') {
      return {
        success: false,
        message: 'Commande déjà marquée comme livrée'
      };
    }

    mockDeliveryTracking[orderId] = {
      ...tracking,
      status: 'delivered',
      estimatedTimeMinutes: 0,
      currentLocation: tracking.destination,
      lastUpdated: new Date().toISOString()
    };

    return {
      success: true,
      message: 'Livraison confirmée avec succès'
    };
  }
}