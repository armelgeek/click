import { MapPin, Phone, MessageCircle } from "lucide-react";
import { Button } from '@/shared/components/ui/button';

interface OrderMapTrackingProps {
  mapImageUrl?: string;
  markerLabel?: string;
  callDisabled?: boolean;
  messageDisabled?: boolean;
  onCallDriver?: () => void;
  onSendMessage?: () => void;
  isCallingDriver?: boolean;
  isSendingMessage?: boolean;
  className?: string;
}

export default function OrderMapTracking({
  mapImageUrl = "/images/map-demo.png",
  markerLabel = "Votre livreur est ici !",
  callDisabled = true,
  messageDisabled = true,
  onCallDriver,
  onSendMessage,
  isCallingDriver = false,
  isSendingMessage = false,
  className = ""
}: OrderMapTrackingProps) {
  
  const handleCallDriver = () => {
    if (!callDisabled && onCallDriver) {
      onCallDriver();
    }
  };

  const handleSendMessage = () => {
    if (!messageDisabled && onSendMessage) {
      onSendMessage();
    }
  };

  return (
    <div className={`bg-white rounded-2xl overflow-hidden flex flex-col items-center ${className}`}>
      <div className="w-full h-80 relative">
        <img src={mapImageUrl} alt="Carte livraison" className="object-cover w-full h-full" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="bg-vapo-purple-primary rounded-full p-2 shadow-lg animate-pulse">
            <MapPin className="text-white w-8 h-8" />
          </div>
          <div className="mt-2 bg-vapo-purple-primary text-white text-base rounded-lg px-4 py-2 shadow">{markerLabel}</div>
        </div>
      </div>
      <div className="flex w-full gap-2 mt-4 px-4 pb-4">
        <Button 
          variant="vapo" 
          className={`flex-1 flex items-center justify-center gap-2 ${callDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
          disabled={callDisabled || isCallingDriver}
          onClick={handleCallDriver}
        >
          <Phone className="w-4 h-4" />
          {isCallingDriver ? 'Connexion...' : 'Appeler'}
        </Button>
        <Button 
          variant="vapo" 
          className={`flex-1 flex items-center justify-center gap-2 ${messageDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
          disabled={messageDisabled || isSendingMessage}
          onClick={handleSendMessage}
        >
          <MessageCircle className="w-4 h-4" />
          {isSendingMessage ? 'Envoi...' : 'Message'}
        </Button>
      </div>
    </div>
  );
}
