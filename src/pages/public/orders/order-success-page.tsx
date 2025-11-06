import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useOrder } from '@/app/cart';

export default function OrderSuccessPage() {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const { order, isLoading, error } = useOrder(orderId);

    useEffect(() => {
        if (!orderId) {
            navigate('/cart');
        }
    }, [orderId, navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Chargement de la commande...</div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500">Commande non trouvée</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex  justify-center p-4">
            <div className="p-8 max-w-md w-full bg-white  flex flex-col items-center">
                <img src="/icons/delivery.svg" alt="Commande succès" className="w-56 mb-6" />
                <div className="text-2xl font-bold text-vapo-purple-primary text-center mb-2">Commande fait avec succès</div>
                <div className="text-center text-gray-800 mb-2">
                    Votre commande numéro <span className="font-bold">{order.id}</span> a été effectuée avec succès.<br />
                    Total: <span className="font-bold">{order.totalAmount?.toFixed(2) ?? '0.00'} €</span><br />
                    Vous pouvez suivre votre commande en cliquant sur <a href={`/orders/${order.id}`} className="text-vapo-purple-primary underline">ce lien</a>.
                </div>
                <div className="text-center text-gray-700 mb-6">Vapostore vous remercie ! À la prochaine.</div>
                <Link to="/" className="flex items-center gap-2 text-vapo-purple-primary font-medium">
                    <span className="text-xl">&#x2039;</span> Retourner aux magasins
                </Link>
            </div>
        </div>
    );
}
