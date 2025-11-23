import { useState } from 'react';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';
import { useSession } from '@/shared/config/auth.config';
import { useNavigate } from 'react-router';
import { usePaginatedOrders } from '@/app/orders/hooks/use-paginated-orders';
import { LoadingSpinner } from '@/components/atoms/loading-spinner';
import type { PaginatedResponse } from '@/shared/types/api.types';
import type { Order } from '@/app/orders/types/order.schema';

export default function OrderListPage() {
  const { data: session } = useSession();
  const navigate = useNavigate();
  const userId = session?.user?.id ?? '';

  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data: paginated,
    isLoading,
    error,
  } = usePaginatedOrders({ userId, page, limit });

  const paginatedTyped = paginated as PaginatedResponse<Order> | undefined;
  const orders = paginatedTyped?.data ?? [];
  const totalPages = paginatedTyped?.totalPages ?? 1;

  // Format date as 'DD/MM/YYYY - HH[h]mm'
  function formatOrderDate(dateString: string) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return format(date, "dd/MM/yyyy - HH'h'mm");
  }

  // Helper to trim long order IDs for display
  const trimOrderId = (id: string, maxLength: number = 8): string => {
    if (!id) return '';
    return id.length > maxLength ? `${id.slice(0, maxLength)}` : id;
  };

  return (
    <div className="min-h-screen p-4">
      <div className="flex items-center gap-2 mb-4">
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-vapo-purple-primary"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        <span className="text-vapo-purple-primary text-xl font-semibold">Historique des commandes</span>
      </div>

      {!userId ? (
        <div className="text-center text-gray-600">Connectez-vous pour voir vos commandes.</div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-red-500">Une erreur est survenue lors du chargement des commandes.</div>
      ) : orders.length === 0 ? (
        <div className="text-gray-600">Aucune commande trouvée.</div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {orders.map((order: Order) => (
              <div
                key={order.id}
                className="bg-vapo-purple-primary/90 rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:bg-vapo-purple-primary transition"
                onClick={() => navigate(`/orders/${order.id}`)}
                tabIndex={0}
                role="button"
                aria-label={`Voir le détail de la commande #${trimOrderId(order.id)}`}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigate(`/orders/${order.id}`);
                  }
                }}
              >
                <div>
                  <div className="text-white text-xl font-bold">Commande #{trimOrderId(order.id)}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-2 h-2 rounded-full inline-block ${order.statusColor}`} />
                    <span className="text-white text-base">{order.statusLabel || order.status}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-white w-5 h-5" />
                  <span className="text-white text-base">à {formatOrderDate(order.date)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">Total: {paginatedTyped?.total ?? orders.length}</div>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 rounded bg-white/10 text-white disabled:opacity-40"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Précédent
              </button>
              <div className="text-white">{page} / {totalPages}</div>
              <button
                className="px-3 py-1 rounded bg-white/10 text-white disabled:opacity-40"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Suivant
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
