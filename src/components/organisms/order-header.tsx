import { PackageSearch } from "lucide-react";

interface OrderHeaderProps {
  orderId: number | string;
  status: string;
  statusColor?: string;
  className?: string;
}
const trimOrderId = (id: string, maxLength: number = 8): string => {
  if (!id) return '';
  return id.length > maxLength ? `${id.slice(0, maxLength)}` : id;
};

function getStatusLabel(status?: string): string {
  switch (status) {
    case 'pending': return 'En attente';
    case 'confirmed': return 'Confirmée';
    case 'preparing': return 'En préparation';
    case 'in_delivery': return 'En livraison';
    case 'delivered': return 'Livrée';
    case 'cancelled': return 'Annulée';
    default: return 'Inconnu';
  }
}
export default function OrderHeader({ orderId, status, statusColor = "bg-green-500", className = "" }: OrderHeaderProps) {

  return (
    <div className={`bg-vapo-purple-primary rounded-2xl p-5 flex items-center justify-between ${className}`}>
      <div>
        <div className="text-white text-2xl font-bold">Commande #{trimOrderId(orderId.toString())}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className={`w-2 h-2 rounded-full inline-block ${statusColor}`} />
          <span className="text-white text-base">{getStatusLabel(status)}</span>
        </div>
      </div>
      <PackageSearch className="text-white w-8 h-8" />
    </div>
  );
}
