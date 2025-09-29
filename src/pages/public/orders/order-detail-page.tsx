import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Clock, MapPin, Phone, User } from 'lucide-react';
import { useOrder } from '@/app/orders';
import { LoadingSpinner } from '@/components/atoms/loading-spinner';
import { Button } from '@/shared/components/ui/button';

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useOrder(orderId!);

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

  return (
    <div className="min-h-screen p-4">
      <div className="flex items-center gap-2 mb-6">
        <button 
          onClick={() => navigate('/orders/history')}
          className="text-vapo-purple-primary hover:text-vapo-purple-primary/80"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-vapo-purple-primary text-xl font-semibold">
          Commande #{order.number}
        </span>
      </div>

      <div className="space-y-6">
        <div className="bg-vapo-purple-primary/90 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className={`w-3 h-3 rounded-full ${order.statusColor}`} />
            <span className="text-white text-lg font-semibold">{order.statusLabel}</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Clock className="w-4 h-4" />
            <span>Commandé le {order.date}</span>
          </div>
          {order.estimatedDelivery && (
            <div className="flex items-center gap-2 text-white/80 mt-1">
              <MapPin className="w-4 h-4" />
              <span>Livraison prévue: {order.estimatedDelivery}</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Articles commandés</h3>
          <div className="space-y-3">
            {order.items.map(item => (
              <div key={item.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-500 text-sm">Quantité: {item.quantity}</p>
                </div>
                <p className="font-semibold">{item.price.toFixed(2)} {order.currency}</p>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total</span>
              <span>{order.totalAmount.toFixed(2)} {order.currency}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Adresse de livraison</h3>
          <p className="text-gray-700">{order.deliveryAddress}</p>
        </div>

        {order.tracking && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Suivi de livraison</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-vapo-purple-primary" />
                <span>Livreur: {order.tracking.driverName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-vapo-purple-primary" />
                <span>{order.tracking.driverPhone}</span>
              </div>
              {order.tracking.estimatedArrival && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-vapo-purple-primary" />
                  <span>Arrivée estimée: {order.tracking.estimatedArrival}</span>
                </div>
              )}
            </div>
            <div className="mt-4 space-y-2">
              <Button 
                variant="vapo" 
                className="w-full"
                onClick={() => navigate(`/orders/${order.id}/tracking`)}
              >
                Suivre en temps réel
              </Button>
            </div>
          </div>
        )}

        {order.proofOfDelivery && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Preuve de livraison</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Type: {order.proofOfDelivery.type === 'photo' ? 'Photo' : 'Signature'}
              </p>
              {order.proofOfDelivery.timestamp && (
                <p className="text-sm text-gray-600">
                  Livré le: {order.proofOfDelivery.timestamp}
                </p>
              )}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate(`/orders/${order.id}/proof`)}
              >
                Voir la preuve de livraison
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}