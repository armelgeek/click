import OrderHeader from '@/components/organisms/order-header';
import { Clock, MapPin, Activity } from 'lucide-react';

export default function OrderReturnPage() {
  const orderId = 1580;

  return (
    <div className="min-h-screen flex flex-col gap-6 p-4 ">
      <OrderHeader orderId={orderId} status="Retour au point de vente" statusColor="bg-red-500" />

      {/* Détail de la livraison (Non reçu) */}
      <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
        <div className="text-xl font-semibold mb-2">Détail de la livraison <span className="font-normal">(Non reçu)</span></div>
        <div className="flex flex-col gap-2 text-gray-800 text-base">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Date et heure d’arrivée du livreur : <span className="text-vapo-purple-primary font-medium">26 Juin 2024 à 11h30</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Lieu de la livraison : <span className="text-vapo-purple-primary font-medium">2405 Gare Paris</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Distance parcourue : <span className="text-vapo-purple-primary font-medium">12 km</span>
          </div>
        </div>
      </div>

      {/* Prochaine livraison */}
      <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
        <div className="text-xl font-semibold mb-2">Prochaine livraison</div>
        <div className="flex flex-col gap-2 text-gray-800 text-base">
          <div className="flex items-center text-md gap-2">
            <Clock className="w-5 h-5" />
            Date et heure : <span className="text-vapo-purple-primary font-medium">27 Juin 2024 à 09h00</span>
          </div>
          <div className="flex items-center gap-2 text-md">
            <MapPin className="w-5 h-5" />
            Lieu de la livraison : <span className="text-vapo-purple-primary font-medium">2405 Gare Paris</span>
          </div>
        </div>
      </div>
    </div>
  );
}
