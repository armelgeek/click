

import { useParams } from 'react-router';
import OrderHeader from '@/components/organisms/order-header';
import OrderDeliveryStatus from '@/components/organisms/order-delivery-status';
import OrderMapTracking from '@/components/organisms/order-map-tracking';
import OrderProofSection from '@/components/organisms/order-proof-section';
import DeliveryDegradedMode from '@/components/organisms/delivery-degraded-mode';
import { useDeliveryTracking, useDeliveryActions, getStatusDisplayInfo } from '@/app/delivery';
import { useGeolocation } from '@/app/location/hooks/use-geolocation';
import ResponsiveContainer from '@/components/atoms/responsive-container';
import { useSession } from '@/shared/config/auth.config';

export default function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: session } = useSession();
  const { data: trackingData, isLoading, error } = useDeliveryTracking(orderId || '', session?.user.id || '');
  const {
    markAsReceived,
    isMarkingAsReceived,
    callDriver,
    isCallingDriver,
    sendMessage,
    isSendingMessage
  } = useDeliveryActions(orderId || '');

  const {
    shouldShowDegradedMode,
    requestPermission
  } = useGeolocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vapo-purple-primary mx-auto mb-2"></div>
          <p className="text-gray-600">Chargement du suivi de livraison...</p>
        </div>
      </div>
    );
  }

  if (error || !trackingData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 mb-2">Impossible de charger le suivi de livraison</p>
          <p className="text-gray-600">Veuillez vérifier votre connexion et réessayer</p>
        </div>
      </div>
    );
  }

  const { tracking } = trackingData;
  const statusInfo = getStatusDisplayInfo(tracking.status);
  const isDelivered = tracking.status === 'delivered';

  const handleMarkAsReceived = () => {
    markAsReceived();
  };

  const handleCallDriver = () => {
    callDriver();
    alert(`Appel vers ${tracking.driver.name} (${tracking.driver.phone})`);
  };

  const handleSendMessage = () => {
    const message = "Bonjour, j'aimerais savoir où vous en êtes avec ma livraison. Merci !";
    sendMessage(message);
    alert('Message envoyé au livreur !');
  };

  const handleAddressSubmit = (address: string) => {
    console.log('Address updated:', address);
  };

  return (
    <ResponsiveContainer maxWidth="mobile" centerOnDesktop>
      <div className="min-h-screen flex flex-col gap-6 py-4">
        <OrderHeader
          orderId={tracking.orderId}
          status={statusInfo.label}
          statusColor={statusInfo.color}
        />

        <OrderDeliveryStatus
          eta={tracking.estimatedTimeMinutes > 0
            ? `${tracking.estimatedTimeMinutes} minutes`
            : tracking.status === 'delivered'
              ? 'Livré'
              : 'Bientôt disponible'
          }
          driverName={tracking.driver.name}
          currentLocation={tracking.currentLocation.address}
          lastUpdated={tracking.lastUpdated}
        />

        {shouldShowDegradedMode ? (
          <DeliveryDegradedMode
            orderId={tracking.orderId}
            estimatedTime={tracking.estimatedTimeMinutes > 0 ? `${tracking.estimatedTimeMinutes} min` : '15-20 min'}
            driverName={tracking.driver.name}
            driverPhone={tracking.driver.phone}
            deliveryAddress={tracking.destination.address}
            onAddressSubmit={handleAddressSubmit}
            onRequestPermission={requestPermission}
            onCallDriver={handleCallDriver}
            onMessageDriver={handleSendMessage}
          />
        ) : (
          <OrderMapTracking
            callDisabled={!tracking.canCall}
            messageDisabled={!tracking.canMessage}
            markerLabel={`${tracking.driver.name} est ici !`}
            onCallDriver={handleCallDriver}
            onSendMessage={handleSendMessage}
            isCallingDriver={isCallingDriver}
            isSendingMessage={isSendingMessage}
          />
        )}

        <OrderProofSection />

        {!isDelivered && (
          <button
            className="w-full bg-vapo-purple-primary text-vapo-purple-light-1 rounded-2xl py-4 mt-2 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-vapo-purple-primary/50 transition disabled:opacity-60"
            onClick={handleMarkAsReceived}
            disabled={isMarkingAsReceived}
          >
            {isMarkingAsReceived ? 'Confirmation...' : 'Marquer comme reçu'}
          </button>
        )}

        {isDelivered && (
          <div className="w-full bg-green-500 text-white rounded-2xl py-4 mt-2 text-lg font-medium text-center">
            ✅ Livraison confirmée !
          </div>
        )}
      </div>
    </ResponsiveContainer>
  );
}
