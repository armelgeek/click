import { Clock, User, MapPin, RefreshCw } from "lucide-react";

interface OrderDeliveryStatusProps {
  eta: string;
  driverName?: string;
  currentLocation?: string;
  lastUpdated?: string;
  className?: string;
}

export default function OrderDeliveryStatus({ 
  eta, 
  driverName,
  currentLocation,
  lastUpdated,
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
    <div className={`bg-white rounded-2xl p-6 flex flex-col gap-4 ${className}`}>
      <div className="text-xl font-semibold mb-2">Suivi de livraison</div>
      
      <div className="flex items-center gap-2 text-gray-800 text-base">
        <Clock className="w-5 h-5 mr-1 text-vapo-purple-primary" />
        Temps estimé d'arrivée : <span className="text-vapo-purple-primary font-medium">{eta}</span>
      </div>

      {driverName && (
        <div className="flex items-center gap-2 text-gray-800 text-base">
          <User className="w-5 h-5 mr-1 text-vapo-purple-primary" />
          Livreur : <span className="font-medium">{driverName}</span>
        </div>
      )}

      {currentLocation && (
        <div className="flex items-center gap-2 text-gray-800 text-base">
          <MapPin className="w-5 h-5 mr-1 text-vapo-purple-primary" />
          Position : <span className="font-medium">{currentLocation}</span>
        </div>
      )}

      {lastUpdated && (
        <div className="flex items-center gap-2 text-gray-600 text-sm border-t pt-3 mt-1">
          <RefreshCw className="w-4 h-4 mr-1" />
          Dernière mise à jour : <span className="font-medium">{formatLastUpdated(lastUpdated)}</span>
        </div>
      )}
    </div>
  );
}