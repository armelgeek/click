import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { MapPin, AlertTriangle, Clock, Phone, MessageCircle, Navigation } from 'lucide-react';

interface DeliveryDegradedModeProps {
  orderId: string;
  estimatedTime?: string;
  driverName?: string;
  driverPhone?: string;
  deliveryAddress?: string;
  onAddressSubmit?: (address: string) => void;
  onRequestPermission?: () => void;
  onCallDriver?: () => void;
  onMessageDriver?: () => void;
}

export default function DeliveryDegradedMode({
  orderId,
  estimatedTime = "15-20 min",
  driverName = "Jean D.",
  driverPhone = "+33 6 12 34 56 78",
  deliveryAddress,
  onAddressSubmit,
  onRequestPermission,
  onCallDriver,
  onMessageDriver
}: DeliveryDegradedModeProps) {
  const [manualAddress, setManualAddress] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(!deliveryAddress);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualAddress.trim() && onAddressSubmit) {
      onAddressSubmit(manualAddress.trim());
      setShowAddressForm(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* Header with degraded mode warning */}
      <div className="flex items-center gap-3 mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
        <AlertTriangle className="text-orange-500 w-6 h-6 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-orange-800 font-semibold text-sm mb-1">Mode de suivi limité</h3>
          <p className="text-orange-700 text-xs leading-relaxed">
            La géolocalisation n'est pas activée. Le suivi en temps réel sur carte n'est pas disponible.
          </p>
        </div>
      </div>

      {/* Enable location prompt */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Navigation className="text-blue-500 w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-blue-800 font-medium text-sm mb-2">
              Activer la géolocalisation pour un meilleur suivi
            </h4>
            <p className="text-blue-700 text-xs mb-3">
              Autorisez l'accès à votre position pour voir le livreur sur la carte et obtenir un suivi en temps réel.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={onRequestPermission}
              className="text-blue-600 border-blue-300 hover:bg-blue-100"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Activer la géolocalisation
            </Button>
          </div>
        </div>
      </div>

      {/* Order information */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm">Commande</span>
          <span className="font-semibold text-vapo-purple-primary">#{orderId}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm">Livreur</span>
          <span className="font-medium">{driverName}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 text-sm">Temps estimé</span>
          </div>
          <span className="font-semibold text-green-600">{estimatedTime}</span>
        </div>
      </div>

      {/* Address section */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-vapo-purple-primary" />
          Adresse de livraison
        </h4>
        
        {deliveryAddress && !showAddressForm ? (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{deliveryAddress}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddressForm(true)}
              className="mt-2 text-vapo-purple-primary"
            >
              Modifier l'adresse
            </Button>
          </div>
        ) : (
          <form onSubmit={handleAddressSubmit} className="space-y-3">
            <Input
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              placeholder="Saisissez votre adresse complète"
              className="w-full"
            />
            <div className="flex gap-2">
              <Button type="submit" variant="vapo" size="sm" className="flex-1">
                Confirmer l'adresse
              </Button>
              {deliveryAddress && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowAddressForm(false)}
                >
                  Annuler
                </Button>
              )}
            </div>
          </form>
        )}
      </div>

      {/* Contact actions */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 mb-3">Contacter le livreur</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={onCallDriver}
            className="flex items-center justify-center gap-2 text-green-600 border-green-300 hover:bg-green-50"
          >
            <Phone className="w-4 h-4" />
            Appeler
          </Button>
          
          <Button
            variant="outline"
            onClick={onMessageDriver}
            className="flex items-center justify-center gap-2 text-blue-600 border-blue-300 hover:bg-blue-50"
          >
            <MessageCircle className="w-4 h-4" />
            Message
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-3">
          Numéro du livreur : {driverPhone}
        </p>
      </div>

      {/* Status updates */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Mises à jour</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">14:30 - Commande confirmée et en préparation</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">14:45 - Commande récupérée par le livreur</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <span className="text-gray-900 font-medium">15:10 - En route vers votre adresse</span>
          </div>
        </div>
      </div>
    </div>
  );
}