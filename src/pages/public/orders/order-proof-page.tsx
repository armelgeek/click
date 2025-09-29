import OrderHeader from '@/components/organisms/order-header';
import OrderProofSection from '@/components/organisms/order-proof-section';
import { Button } from '@/shared/components/ui/button';
import { Clock, MapPin, Activity } from 'lucide-react';

export default function OrderProofPage() {
  const orderId = 1579;
  const proofPhotos = [
    '/proofs/proof-1.svg',
    '/proofs/proof-2.svg',
    '/proofs/proof-3.svg',
  ];

  return (
    <div className="min-h-screen flex flex-col gap-6 p-4">
      <OrderHeader orderId={orderId} status="Votre commande a été livrée" statusColor="bg-blue-400" />

      {/* Détail de la livraison */}
      <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
        <div className="text-xl font-semibold mb-2">Détail de la livraison</div>
        <div className="flex flex-col gap-2 text-gray-800 text-base">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Date et heure d’arrivée : <span className="text-vapo-purple-primary font-medium">26 Juin 2024 à 11h30</span>
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

      {/* Preuves de livraison */}
      <OrderProofSection proofs={proofPhotos} type="photos" />

      {/* Bouton d'évaluation */}
      <Button variant='vapo-secondary' className="mt-2 w-full">
        <span className="mr-2">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline-block align-middle"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8a9 9 0 100-18 9 9 0 000 18zm0 0v-2a2 2 0 012-2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2a2 2 0 01-2-2V7" /></svg>
        </span>
        Evaluer cette livraison
      </Button>
    </div>
  );
}
