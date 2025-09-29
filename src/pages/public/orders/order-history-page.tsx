import { Clock } from 'lucide-react';
import { useOrders } from '@/app/orders';
import { useNavigate } from 'react-router';
import { LoadingSpinner } from '@/components/atoms/loading-spinner';

export default function OrderHistoryPage() {
  const { data: orders, isLoading, error } = useOrders();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p>Erreur lors du chargement des commandes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="flex items-center gap-2 mb-4">
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-vapo-purple-primary">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span className="text-vapo-purple-primary text-xl font-semibold">Historique des commandes</span>
      </div>
      <div className="flex flex-col gap-4">
        {orders?.map(order => (
          <div
            key={order.id}
            className="bg-vapo-purple-primary/90 rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:bg-vapo-purple-primary transition"
            onClick={() => navigate(`/orders/${order.id}`)}
          >
            <div>
              <div className="text-white text-xl font-bold">Commande #{order.number}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full inline-block ${order.statusColor}`} />
                <span className="text-white text-base">{order.statusLabel}</span>
              </div>
              <div className="text-white/80 text-sm mt-1">
                {order.totalAmount.toFixed(2)} {order.currency}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-white w-5 h-5" />
              <span className="text-white text-base">{order.date}</span>
            </div>
          </div>
        ))}
        {orders?.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Aucune commande trouvée
          </div>
        )}
      </div>
    </div>
  );
}
