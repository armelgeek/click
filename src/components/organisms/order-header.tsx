import { PackageSearch } from "lucide-react";

interface OrderHeaderProps {
  orderId: number | string;
  status: string;
  statusColor?: string;
  className?: string;
}

export default function OrderHeader({ orderId, status, statusColor = "bg-green-500", className = "" }: OrderHeaderProps) {
  return (
    <div className={`bg-vapo-purple-primary rounded-2xl p-5 flex items-center justify-between ${className}`}>
      <div>
        <div className="text-white text-2xl font-bold">Commande #{orderId}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className={`w-2 h-2 rounded-full inline-block ${statusColor}`} />
          <span className="text-white text-base">{status}</span>
        </div>
      </div>
      <PackageSearch className="text-white w-8 h-8" />
    </div>
  );
}
