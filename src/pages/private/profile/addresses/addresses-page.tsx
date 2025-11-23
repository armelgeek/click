import { useState } from 'react';
import { MapPin, Plus, Pencil, Trash2, Star } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useAddresses, useAddressesMutations } from '@/app/user/hooks/use-addresses';
import { useSession } from '@/shared/config/auth.config';
import { Address } from '@/shared/types/api.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/components/ui/dialog';
import { AddressForm } from './address-form';

export default function AddressesPage() {
  const { data: session } = useSession();
  const { addresses, isLoading } = useAddresses(session?.user?.id || '');
  const { deleteAddress, setDefaultAddress } = useAddressesMutations();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingAddress(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingAddress(null);
  };

  const handleDelete = (addressId: string) => {
    setAddressToDelete(addressId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (addressToDelete) {
      deleteAddress.mutate(addressToDelete);
    }
    setDeleteModalOpen(false);
    setAddressToDelete(null);
  };

  const handleSetDefault = (addressId: string) => {
    setDefaultAddress.mutate(addressId);
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
            <MapPin className="text-vapo-purple-primary w-6 h-6" />
            <h1 className="text-2xl font-bold text-gray-900">Mes adresses</h1>
          </div>
          <Button variant="vapo" onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une adresse
          </Button>
        </div>

        {addresses.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-4">Vous n'avez aucune adresse enregistrée</p>
            <Button variant="vapo" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter votre première adresse
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-vapo-purple-primary transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">{address.label}</h3>
                      {address.isDefault && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-vapo-purple-primary text-white text-xs rounded">
                          <Star className="w-3 h-3" />
                          Par défaut
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{address.streetAddress}</p>
                      <p>
                        {address.postalCode} {address.city}
                      </p>
                      <p>{address.country}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!address.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(address.id)}
                        disabled={setDefaultAddress.isPending}
                      >
                        <Star className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(address)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(address.id)}
                      disabled={deleteAddress.isPending}
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

      {/* Address Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? 'Modifier l\'adresse' : 'Ajouter une adresse'}
            </DialogTitle>
          </DialogHeader>
          <AddressForm
            address={editingAddress}
            onSuccess={handleCloseForm}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l'adresse ?</DialogTitle>
          </DialogHeader>
          <div className="py-2 text-gray-700">
            Êtes-vous sûr de vouloir supprimer cette adresse ? Cette action est irréversible.
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
