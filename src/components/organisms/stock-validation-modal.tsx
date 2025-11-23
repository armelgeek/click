import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { useNavigate } from 'react-router';
import { useCartStore } from '@/app/cart';
import { AlertTriangle } from 'lucide-react';

export default function StockValidationModal() {
  const navigate = useNavigate();
  const { stockModalOpen, closeStockModal, stockValidation, items: cartItems } = useCartStore();

  if (!stockModalOpen || !stockValidation) return null;

  return (
    <Dialog open={!!stockModalOpen} onOpenChange={(open) => { if (!open) closeStockModal(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-500" /> Problème de stock</div>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-4">
          {stockValidation.items.map(item => {
            const cartItem = cartItems.find(ci => ci.productId === item.productId);
            return (
            <div key={item.productId} className="p-3 border rounded bg-red-50">
              <div className="font-medium">{cartItem?.name || item.productId}</div>
              <div className="text-sm text-gray-700">Quantité demandée: {item.requestedQuantity} — Disponible: {item.availableQuantity}</div>
            </div>
            )
          })}
        </div>
        <DialogFooter>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { closeStockModal(); navigate('/cart'); }}>
              Mettre à jour mon panier
            </Button>
            <Button variant="vapo" onClick={() => closeStockModal()}>
              Fermer
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
