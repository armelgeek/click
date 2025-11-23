import { Clock, User, MapPin, RefreshCw, TrainTrackIcon } from "lucide-react";

interface OrderDeliveryStatusProps {
  eta: string;
  driverName?: string;
  destination?: string;
  lastUpdated?: string;
  totalDistance?: number;
  distanceTraveled?: number;
  className?: string;
}

export default function OrderDeliveryStatus({
  eta,
  driverName,
  destination,
  lastUpdated,
  totalDistance,
  distanceTraveled,
  className = ""
}: OrderDeliveryStatusProps) {

  const formatLastUpdated = (timestamp?: string) => {
    if (!timestamp) return '';

    const now = new Date();
    const updated = new Date(timestamp);
    const diffMinutes = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60));

    if (diffMinutes < 1) return 'À l\'instant';
    if (diffMinutes === 1) return 'Il y a 1 minute';
    return `Il y a ${diffMinutes} minutes`;
  };

  return (
    <div className={`bg-white rounded-2xl px-3 mt-3 py-6 flex flex-col gap-2 ${className}`}>
      <div className="text-xl font-semibold mb-2">Détail de livraison</div>

      <div className="flex items-center gap-2 text-gray-800 text-base">
        <Clock className="w-5 h-5 mr-1 text-vapo-purple-primary" />
        Date et heure d'arrivé : <span className="text-vapo-purple-primary font-medium">{eta}</span>
      </div>

      {/**driverName && (
        <div className="flex items-center gap-2 text-gray-800 text-base">
          <User className="w-5 h-5 mr-1 text-vapo-purple-primary" />
          Livreur : <span className="font-medium">{driverName}</span>
        </div>
      )**/}

      {destination && (
        <div className="flex items-center gap-2 text-gray-800">
          <MapPin className="w-5 h-5 mr-1 text-vapo-purple-primary" />
          Lieu de livraison : <span className="font-medium  text-sm text-vapo-purple-primary">{destination}</span>
        </div>
      )
      }


      {totalDistance !== undefined && distanceTraveled !== undefined && (
        <div className="flex items-center gap-2 text-gray-800">
          <TrainTrackIcon className="w-5 h-5 mr-1 text-vapo-purple-primary" />
          Distance parcourue : <span className="font-medium  text-sm text-vapo-purple-primary">{distanceTraveled} km</span>
        </div>
      )
      }

    </div >
  );
}