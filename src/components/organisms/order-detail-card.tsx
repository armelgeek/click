import { Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Order } from '@/app/orders/types/order.schema';

interface OrderDetailCardProps {
  order: Order;
  nextDeliveryDate?: string;
  nextDeliveryAddress?: string;
  distanceKm?: number;
  statusNote?: string;
}

export function OrderDetailCard({ order, nextDeliveryDate, nextDeliveryAddress, distanceKm, statusNote }: OrderDetailCardProps) {
  function formatOrderDate(dateString?: string) {
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

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="rounded-t-2xl rounded-b-lg bg-vapo-purple-primary p-4 flex items-center justify-between">
        <div>
          <div className="text-white text-xl font-bold">Commande #{order.number}</div>
          {statusNote && (
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
              <span className="text-white text-sm font-medium">{statusNote}</span>
            </div>
          )}
        </div>
        <div>
          {/* Icon placeholder */}
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
      </div>

      {/* Livraison actuelle */}
      <div className="bg-white rounded-2xl shadow p-4 mt-3">
        <div className="font-semibold text-gray-800 mb-2">Détail de la livraison (Non reçu)</div>
        <div className="flex items-center gap-2 text-gray-700 mb-1">
          <Clock className="w-4 h-4" />
          <span>Date et heure d’arrivée du livreur :</span>
          <span className="text-vapo-purple-primary font-semibold">{formatOrderDate(order.estimatedDelivery)}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700 mb-1">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-vapo-purple-primary"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 12.414a4 4 0 10-1.414 1.414l4.243 4.243a1 1 0 001.414-1.414z" /></svg>
          <span>Lieu de la livraison :</span>
          <span className="text-vapo-purple-primary font-semibold">{order.deliveryAddress}</span>
        </div>
        {distanceKm !== undefined && (
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-lg">🏃‍♂️</span>
            <span>Distance parcourue :</span>
            <span className="text-vapo-purple-primary font-semibold">{distanceKm} km</span>
          </div>
        )}
      </div>

      {/* Prochaine livraison */}
      {nextDeliveryDate && (
        <div className="bg-white rounded-2xl shadow p-4 mt-3">
          <div className="font-semibold text-gray-800 mb-2">Prochaine livraison</div>
          <div className="flex items-center gap-2 text-gray-700 mb-1">
            <Clock className="w-4 h-4" />
            <span>Date et heure :</span>
            <span className="text-vapo-purple-primary font-semibold">{formatOrderDate(nextDeliveryDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 mb-1">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-vapo-purple-primary"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 12.414a4 4 0 10-1.414 1.414l4.243 4.243a1 1 0 001.414-1.414z" /></svg>
            <span>Lieu de la livraison :</span>
            <span className="text-vapo-purple-primary font-semibold">{nextDeliveryAddress || order.deliveryAddress}</span>
          </div>
        </div>
      )}
    </div>
  );
}
