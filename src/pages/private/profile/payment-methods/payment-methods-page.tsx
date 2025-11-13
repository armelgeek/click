import { useState } from 'react';
import { CreditCard, Plus, Trash2, Star } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { usePaymentMethods, usePaymentMethodsMutations } from '@/app/user/hooks/use-payment-methods';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/components/ui/dialog';
import { PaymentMethodForm } from './payment-method-form';

export default function PaymentMethodsPage() {
  const { paymentMethods, isLoading } = usePaymentMethods();
  const { deletePaymentMethod, setDefaultPaymentMethod } = usePaymentMethodsMutations();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState<string | null>(null);

  const handleAdd = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleDelete = (methodId: string) => {
    setMethodToDelete(methodId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (methodToDelete) {
      deletePaymentMethod.mutate(methodToDelete);
    }
    setDeleteModalOpen(false);
    setMethodToDelete(null);
  };

  const handleSetDefault = (methodId: string) => {
    setDefaultPaymentMethod.mutate(methodId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="text-center">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CreditCard className="text-vapo-purple-primary w-6 h-6" />
            <h1 className="text-2xl font-bold text-gray-900">Mes moyens de paiement</h1>
          </div>
          <Button variant="vapo" onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un moyen de paiement
          </Button>
        </div>

        {paymentMethods.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-4">Vous n'avez aucun moyen de paiement enregistré</p>
            <Button variant="vapo" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter votre premier moyen de paiement
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-vapo-purple-primary transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-vapo-purple-primary to-purple-600 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg text-gray-900">{method.provider}</h3>
                        {method.isDefault && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-vapo-purple-primary text-white text-xs rounded">
                            <Star className="w-3 h-3" />
                            Par défaut
                          </span>
                        )}
                      </div>
                      {method.last4 && (
                        <div className="text-sm text-gray-600">
                          •••• •••• •••• {method.last4}
                        </div>
                      )}
                      {method.expiryMonth && method.expiryYear && (
                        <div className="text-xs text-gray-500 mt-1">
                          Expire le {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                        </div>
                      )}
                      {method.type === 'paypal' && (
                        <div className="text-sm text-gray-600">Compte PayPal</div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!method.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(method.id)}
                        disabled={setDefaultPaymentMethod.isPending}
                      >
                        <Star className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(method.id)}
                      disabled={deletePaymentMethod.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Method Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter un moyen de paiement</DialogTitle>
          </DialogHeader>
          <PaymentMethodForm
            onSuccess={handleCloseForm}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le moyen de paiement ?</DialogTitle>
          </DialogHeader>
          <div className="py-2 text-gray-700">
            Êtes-vous sûr de vouloir supprimer ce moyen de paiement ? Cette action est irréversible.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
