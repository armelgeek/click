import { useParams, useNavigate } from 'react-router';
import { Clock, Phone, Package, XCircle, RotateCcw, CheckCircle, TimerIcon, MessageCircle } from 'lucide-react';
import type { Order } from '@/app/orders/types/order.schema';
import type { UseMutationResult } from '@tanstack/react-query';
import type { DeliveryConfirmationPayload } from '@/shared/types/api.types';
import { useConfirmDelivery } from '@/app/orders/hooks/use-confirm-delivery';
import { LoadingSpinner } from '@/components/atoms/loading-spinner';
import { Button } from '@/shared/components/ui/button';
import { useState } from 'react';
import SignaturePad from '@/components/atoms/signature-pad';
import { useSession } from '@/shared/config/auth.config';
import { useOrder } from '@/app/cart';
import OrderHeader from '@/components/organisms/order-header';
import { useDeliveryTracking } from '@/app/delivery';
import OrderDeliveryStatus from '@/components/organisms/order-delivery-status';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import OrderProofSection from '@/components/organisms/order-proof-section';
 function DeliveryProofSection({ order, confirmDelivery }: { order: Order, confirmDelivery: UseMutationResult<{ success: boolean; message: string }, unknown, { orderId: string; payload: DeliveryConfirmationPayload }, unknown> }) {
    const [showSignature, setShowSignature] = useState(false);
    const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    return (
      <div className="my-6 space-y-4">
        <div className="flex flex-col gap-2">
          <label className="block">
            <span className="text-sm font-medium">Ajouter une photo de livraison</span>
            <input
              type="file"
              accept="image/*"
              className="block mt-1"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onloadend = () => {
                  const photoUrl = reader.result as string;
                  setPhotoPreview(photoUrl as string);
                  confirmDelivery.mutate({
                    orderId: order.id,
                    payload: { photoUrl },
                  });
                };
                reader.readAsDataURL(file);
              }}
              disabled={confirmDelivery.isPending || confirmDelivery.isSuccess}
            />
          </label>
          {/* Prévisualisation de la photo */}
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Preuve de livraison (photo)"
              className="w-full max-w-xs rounded-lg border mx-auto my-2"
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Ou signer la réception</span>
          {!showSignature && !signaturePreview && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowSignature(true)}
              disabled={confirmDelivery.isPending || confirmDelivery.isSuccess}
            >
              Saisir une signature
            </Button>
          )}
          {showSignature && !signaturePreview && (
            <SignaturePad
              onSave={(dataUrl) => {
                setSignaturePreview(dataUrl);
                confirmDelivery.mutate({
                  orderId: order.id,
                  payload: { signature: dataUrl },
                });
                setShowSignature(false);
              }}
              onCancel={() => setShowSignature(false)}
            />
          )}
          {signaturePreview && (
            <img
              src={signaturePreview}
              alt="Signature de livraison"
              className="w-full max-w-xs rounded-lg border mx-auto my-2"
            />
          )}
        </div>
        <Button
          variant="vapo"
          className="w-full"
          disabled={confirmDelivery.isPending || confirmDelivery.isSuccess}
          onClick={() => {
            confirmDelivery.mutate({
              orderId: order.id,
              payload: {},
            });
          }}
        >
          {confirmDelivery.isSuccess ? 'Confirmation de livraison effectuée' : 'Confirmer la livraison sans preuve'}
        </Button>
        {confirmDelivery.isError && (
          <div className="text-red-500 text-center mt-2">Erreur lors de la confirmation</div>
        )}
      </div>
    );
  }
export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: session } = useSession();
  const navigate = useNavigate();
  const confirmDelivery = useConfirmDelivery();
  const { data: order, isLoading, error } = useOrder(orderId!, session?.user.id || '');
  const { data: trackingData, isLoading: isTrackingLoading } = useDeliveryTracking(orderId || '', session?.user.id || '');

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p>Commande non trouvée</p>
          <Button onClick={() => navigate('/orders/history')} className="mt-4">
            Retour à l'historique
          </Button>
        </div>
      </div>
    );
  }

  function formatEstimatedArrival(dateString?: string) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    let formatted = format(date, "dd MMMM yyyy 'à' HH'h'mm", { locale: fr });
    const parts = formatted.split(' ');
    if (parts.length >= 2) {
      parts[1] = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
      formatted = parts.join(' ');
    }
    return formatted;
  }

  const orderStatus = 'delivered';
  const tracking = trackingData?.tracking;

  // Déterminer quel contenu afficher selon le statut
  const showOnPending = orderStatus === 'pending';
  const showOnConfirmed = orderStatus === 'confirmed';
  const showOnPreparing = orderStatus === 'preparing';
  const showOnOutForDelivery = orderStatus === 'out_for_delivery';
  const showOnDelivered = orderStatus === 'delivered';
  const showOnCancelled = orderStatus === 'cancelled';
  const showOnReturned = orderStatus === 'returned';

  return (
    <div className="min-h-screen p-4">
      <OrderHeader
        orderId={order.order.id}
        status={order.order.status}
        statusColor={order.order.statusColor}
      />

      {/* Statut: En attente */}
      {showOnPending && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-6 h-6 text-yellow-600" />
            <h3 className="text-lg font-semibold text-yellow-900">Commande en attente</h3>
          </div>
          <p className="text-yellow-800">
            Votre commande est en attente de confirmation par le magasin.
          </p>
        </div>
      )}

      {/* Statut: Confirmée */}
      {showOnConfirmed && (
        <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">Commande confirmée</h3>
          </div>
          <p className="text-blue-800">
            Votre commande a été confirmée par le magasin et sera bientôt préparée.
          </p>
        </div>
      )}

      {/* Statut: En préparation */}
      {showOnPreparing && (
        <div className="mt-2 bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <Package className="w-6 h-6 text-orange-600" />
            <h3 className="text-lg font-semibold text-orange-900">Commande en préparation</h3>
          </div>
          <p className="text-orange-800">
            Le magasin prépare votre commande avec soin. Elle sera bientôt prête pour la livraison.
          </p>
        </div>
      )}

      {/* Statut: En cours de livraison */}
      {showOnDelivered && tracking && (
        <div className="flex flex-col gap-3">
          <OrderDeliveryStatus
            eta={formatEstimatedArrival(tracking.estimatedArrival)}
            driverName={tracking.driver ? tracking.driver.name : 'Livreur non affecté'}
            totalDistance={tracking.totalDistance || 4}
            distanceTraveled={tracking.distanceTraveled || 2}
            destination={tracking.destination ? tracking.destination.address : 'Destination non disponible'}
            lastUpdated={tracking.lastUpdated}
          />
           <DeliveryProofSection order={order.order} confirmDelivery={confirmDelivery}/>
        </div>
      )}

      {showOnOutForDelivery && (
        <>
          <div className="mt-6 bg-white border border-white rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-lg font-semibold">Suivi de livraison</h3>
            </div>
            <div className="flex items-center gap-2 text-gray-800">
              <TimerIcon className="w-5 h-5 mr-1 text-vapo-purple-primary" />
              Estimation de livraison : <span className="font-medium  text-sm text-vapo-purple-primary">{tracking?.estimatedTimeMinutes} minutes</span>
            </div>
          </div>
          <img src="/map.svg" alt="Tracking Map" className="w-full h-auto mt-4" />


          <div className="space-y-3">
            <div className="flex items-center justify-between mt-2 gap-4">
              <Button
                variant="vapo-secondary"
                className="flex-1">
                <Phone className="w-4 h-4" />
                Appeler
              </Button>
              <Button
                variant="vapo-secondary"
                className="flex-1"
              >
                <MessageCircle className="w-4 h-4" />
                Message
              </Button>
            </div>
          </div>

          <OrderProofSection  />
        </>
      )}

      {/* Statut: Annulée */}
      {showOnCancelled && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <XCircle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-red-900">Commande annulée</h3>
          </div>
          <p className="text-red-800">
            Cette commande a été annulée. Si vous avez des questions, n'hésitez pas à nous contacter.
          </p>
        </div>
      )}

      {/* Statut: Retournée */}
      {showOnReturned && (
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <RotateCcw className="w-6 h-6 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Commande retournée</h3>
          </div>
          <p className="text-gray-800">
            Cette commande a été retournée. Un remboursement sera traité dans les prochains jours.
          </p>
        </div>
      )}
    </div>
  );
}