export interface DeliveryCoordinate {
  latitude: number;
  longitude: number;
}

export interface DeliveryDriver {
  id: string;
  name: string;
  phone: string;
  photo?: string;
  vehicleType: 'bike' | 'scooter' | 'car';
  rating: number;
}

export interface DeliveryLocation {
  coordinates: DeliveryCoordinate;
  address: string;
  landmark?: string;
}

export type DeliveryStatus = 
  | 'preparing' 
  | 'ready' 
  | 'picked_up' 
  | 'on_the_way' 
  | 'nearby' 
  | 'delivered' 
  | 'failed' 
  | 'returned';

export interface DeliveryTracking {
  id: string;
  orderId: string;
  status: DeliveryStatus;
  estimatedTimeMinutes: number;
  driver: DeliveryDriver;
  currentLocation: DeliveryLocation;
  destination: DeliveryLocation;
  shopLocation: DeliveryLocation;
  timeline: DeliveryTimelineItem[];
  canCall: boolean;
  canMessage: boolean;
  lastUpdated: string;
}

export interface DeliveryTimelineItem {
  id: string;
  status: DeliveryStatus;
  timestamp: string;
  description: string;
  location?: string;
}

export interface DeliveryTrackingResponse {
  tracking: DeliveryTracking;
}

export interface DeliveryStatusUpdate {
  orderId: string;
  status: DeliveryStatus;
  estimatedTimeMinutes: number;
  currentLocation: DeliveryLocation;
  lastUpdated: string;
}

export interface DeliveryStatusUpdateResponse {
  success: boolean;
  data: DeliveryStatusUpdate;
}