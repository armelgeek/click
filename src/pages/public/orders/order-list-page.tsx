import { Clock } from 'lucide-react';

const orders = [
  { id: 1579, status: 'En cours de livraison', statusColor: 'bg-green-500', time: '11h30' },
  { id: 1580, status: 'En cours de livraison', statusColor: 'bg-green-500', time: '11h30' },
  { id: 1581, status: 'En cours de livraison', statusColor: 'bg-green-500', time: '11h30' },
  { id: 1582, status: 'En cours de livraison', statusColor: 'bg-green-500', time: '11h30' },
  { id: 1583, status: 'En cours de livraison', statusColor: 'bg-green-500', time: '11h30' },
];

export default function OrderListPage() {
  return (
    <div className="min-h-screen p-4">
      <div className="flex items-center gap-2 mb-4">
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-vapo-purple-primary"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        <span className="text-vapo-purple-primary text-xl font-semibold">Mes suivis de commande</span>
      </div>
      <div className="flex flex-col gap-4">
        {orders.map(order => (
          <div
            key={order.id}
            className="bg-vapo-purple-primary/90 rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:bg-vapo-purple-primary transition"
          >
            <div>
              <div className="text-white text-xl font-bold">Commande #{order.id}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full inline-block ${order.statusColor}`} />
                <span className="text-white text-base">{order.status}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-white w-5 h-5" />
              <span className="text-white text-base">à {order.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
