import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/shared/components/ui/button';
import { RadioGroup } from '@/shared/components/ui/radio-group';
import { useCart, useCartMutations } from '@/app/cart';
import { useCheckoutAddresses, useCheckoutPaymentMethods } from '@/app/checkout/hooks/use-checkout';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, MapPin, CreditCard, PackageCheck, AlertTriangle } from 'lucide-react';
import { simulatePayment } from '@/app/checkout/data/mock-checkout-data';
import { Address, PaymentMethod } from '@/shared/types/api.types';
import { AddressForm, AddressFormHandle } from '@/pages/private/profile/addresses/address-form';
import { PaymentMethodForm } from '@/pages/private/profile/payment-methods/payment-method-form';
import { CartAPI } from '@/app/cart/api/cart-api';
import { StockValidationResponse } from '@/app/cart/types';

type CheckoutStep = 'address' | 'payment' | 'review' | 'processing';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, isLoading: isLoadingCart } = useCart();
  const { addresses, isLoading: isLoadingAddresses, refetch: refetchAddresses } = useCheckoutAddresses();
  const { paymentMethods, isLoading: isLoadingPaymentMethods, refetch: refetchPaymentMethods } = useCheckoutPaymentMethods();
  const { createOrder } = useCartMutations();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address');
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [stockValidation, setStockValidation] = useState<StockValidationResponse | null>(null);
  const [isValidatingStock, setIsValidatingStock] = useState(false);
  const addressFormRef = useRef<AddressFormHandle>(null);

  // Redirect if cart is empty
  if (!isLoadingCart && (!cart || cart.items.length === 0)) {
    navigate('/cart');
    return null;
  }

  const calculateSubtotal = () => {
    if (!cart) return 0;
    return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateShippingFee = () => {
    return 4.99;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShippingFee();
  };

  const handleNextStep = async () => {
    if (currentStep === 'address') {
      // If showing address form, validate and submit it
      if (showAddressForm && addressFormRef.current) {
        const isValid = await addressFormRef.current.isValid();
        if (!isValid) {
          alert('Veuillez remplir tous les champs requis de l\'adresse');
          return;
        }
        await addressFormRef.current.submit();
        // onSuccess callback will handle refetch and form hiding
        // After refetch, user should select the new address
        return;
      }
      
      // Otherwise, check if an address is selected
      if (!selectedAddressId) {
        alert('Veuillez sélectionner une adresse de livraison');
        return;
      }
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      if (!selectedPaymentId) {
        alert('Veuillez sélectionner un moyen de paiement');
        return;
      }
      setCurrentStep('review');
    } else if (currentStep === 'review') {
      handlePlaceOrder();
    }
  };

  const handlePlaceOrder = async () => {
    if (!cart || !selectedAddressId || !selectedPaymentId) return;

    setCurrentStep('processing');
    setIsProcessingPayment(true);
    setPaymentError(null);
    setStockValidation(null);

    try {
      // Step 1: Validate stock availability
      setIsValidatingStock(true);
      const stockResult = await CartAPI.validateStock();
      setIsValidatingStock(false);

      if (!stockResult.valid) {
        // Stock validation failed - show error and go back to review
        setStockValidation(stockResult);
        setPaymentError('Certains produits ne sont plus disponibles en quantité suffisante. Veuillez mettre à jour votre panier.');
        setIsProcessingPayment(false);
        setCurrentStep('review');
        return;
      }

      // Step 2: Process payment
      const paymentResult = await simulatePayment();

      if (!paymentResult.success) {
        setPaymentError(paymentResult.error || 'Payment failed');
        setIsProcessingPayment(false);
        setCurrentStep('review');
        return;
      }

      // Step 3: Create order after successful payment and stock validation
      const selectedAddress = addresses.find(a => a.id === selectedAddressId);
      const selectedPayment = paymentMethods.find(p => p.id === selectedPaymentId);

      createOrder.mutate(
        {
          cartId: cart.id,
          deliveryAddress: `${selectedAddress?.label} - ${selectedAddress?.streetAddress}, ${selectedAddress?.postalCode} ${selectedAddress?.city}`,
          paymentMethod: `${selectedPayment?.provider} ${selectedPayment?.last4 ? `****${selectedPayment.last4}` : ''}`,
          notes: 'Commande passée via le checkout',
        },
        {
          onSuccess: (response: { order: { id: string } }) => {
            navigate(`/order-success/${response.order.id}`);
          },
          onError: (error) => {
            console.error('Order creation failed:', error);
            setPaymentError('Failed to create order. Please try again.');
            setIsProcessingPayment(false);
            setCurrentStep('review');
          },
        }
      );
    } catch (error) {
      console.error('Payment processing error:', error);
      setPaymentError('An error occurred during payment processing');
      setIsProcessingPayment(false);
      setCurrentStep('review');
    }
  };

  const renderAddressStep = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="text-vapo-purple-primary w-6 h-6" />
        <h2 className="text-xl font-semibold">Adresse de livraison</h2>
      </div>

      {isLoadingAddresses ? (
        <div className="text-gray-500">Chargement des adresses...</div>
      ) : addresses.length === 0 || showAddressForm ? (
        <div>
          <p className="text-gray-600 mb-4">
            {addresses.length === 0 
              ? "Vous n'avez pas encore d'adresse enregistrée. Veuillez en ajouter une pour continuer."
              : "Ajouter une nouvelle adresse"}
          </p>
          <AddressForm
            ref={addressFormRef}
            address={null}
            onSuccess={async () => {
              setShowAddressForm(false);
              const result = await refetchAddresses();
              // Auto-select the newly created address (it will be the last one or the one with highest ID)
              if (result.data?.addresses && result.data.addresses.length > 0) {
                const newAddress = result.data.addresses[result.data.addresses.length - 1];
                setSelectedAddressId(newAddress.id);
              }
            }}
            hideButtons={true}
          />
          {addresses.length > 0 && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setShowAddressForm(false)}
            >
              Retour à la liste
            </Button>
          )}
        </div>
      ) : (
        <>
          <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId}>
            <div className="space-y-3">
              {addresses.map((address: Address) => (
                <label
                  key={address.id}
                  className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedAddressId === address.id
                      ? 'border-vapo-purple-primary bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    value={address.id}
                    checked={selectedAddressId === address.id}
                    onChange={() => setSelectedAddressId(address.id)}
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{address.label}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {address.streetAddress}<br />
                      {address.postalCode} {address.city}<br />
                      {address.country}
                    </div>
                    {address.isDefault && (
                      <span className="inline-block mt-2 text-xs bg-vapo-purple-primary text-white px-2 py-1 rounded">
                        Par défaut
                      </span>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </RadioGroup>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setShowAddressForm(true)}
          >
            Ajouter une nouvelle adresse
          </Button>
        </>
      )}
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="text-vapo-purple-primary w-6 h-6" />
        <h2 className="text-xl font-semibold">Moyen de paiement</h2>
      </div>

      {isLoadingPaymentMethods ? (
        <div className="text-gray-500">Chargement des moyens de paiement...</div>
      ) : paymentMethods.length === 0 || showPaymentForm ? (
        <div>
          <p className="text-gray-600 mb-4">
            {paymentMethods.length === 0
              ? "Vous n'avez pas encore de moyen de paiement enregistré. Veuillez en ajouter un pour continuer."
              : "Ajouter un nouveau moyen de paiement"}
          </p>
          <PaymentMethodForm
            onSuccess={() => {
              setShowPaymentForm(false);
              refetchPaymentMethods();
            }}
            onCancel={() => setShowPaymentForm(false)}
          />
        </div>
      ) : (
        <>
          <RadioGroup value={selectedPaymentId} onValueChange={setSelectedPaymentId}>
            <div className="space-y-3">
              {paymentMethods.map((method: PaymentMethod) => (
                <label
                  key={method.id}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPaymentId === method.id
                      ? 'border-vapo-purple-primary bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={selectedPaymentId === method.id}
                    onChange={() => setSelectedPaymentId(method.id)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{method.provider}</div>
                    {method.last4 && (
                      <div className="text-sm text-gray-600 mt-1">
                        **** **** **** {method.last4}
                        {method.expiryMonth && method.expiryYear && (
                          <span className="ml-2">
                            Exp: {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                          </span>
                        )}
                      </div>
                    )}
                    {method.isDefault && (
                      <span className="inline-block mt-2 text-xs bg-vapo-purple-primary text-white px-2 py-1 rounded">
                        Par défaut
                      </span>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </RadioGroup>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setShowPaymentForm(true)}
          >
            Ajouter un nouveau moyen de paiement
          </Button>
        </>
      )}
    </div>
  );

  const renderReviewStep = () => {
    const selectedAddress = addresses.find(a => a.id === selectedAddressId);
    const selectedPayment = paymentMethods.find(p => p.id === selectedPaymentId);

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <PackageCheck className="text-vapo-purple-primary w-6 h-6" />
          <h2 className="text-xl font-semibold">Vérifier votre commande</h2>
        </div>

        {paymentError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold mb-1">{paymentError}</p>
                {stockValidation && !stockValidation.valid && (
                  <div className="mt-3 space-y-2">
                    {stockValidation.items
                      .filter(item => !item.isAvailable)
                      .map((item) => {
                        const cartItem = cart?.items.find(ci => ci.productId === item.productId);
                        return (
                          <div key={item.productId} className="text-sm bg-white p-3 rounded border border-red-200">
                            <p className="font-medium text-gray-900">{cartItem?.name || 'Produit'}</p>
                            <p className="text-gray-600 mt-1">
                              Quantité demandée: {item.requestedQuantity} - 
                              Disponible: {item.availableQuantity}
                            </p>
                          </div>
                        );
                      })}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/cart')}
                      className="mt-2"
                    >
                      Retour au panier
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Adresse de livraison</h3>
          <div className="text-sm text-gray-700">
            <div>{selectedAddress?.label}</div>
            <div>{selectedAddress?.streetAddress}</div>
            <div>{selectedAddress?.postalCode} {selectedAddress?.city}</div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Moyen de paiement</h3>
          <div className="text-sm text-gray-700">
            {selectedPayment?.provider}
            {selectedPayment?.last4 && ` - **** ${selectedPayment.last4}`}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">Articles commandés</h3>
          <div className="space-y-2">
            {cart?.items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name} x {item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Sous-total</span>
            <span>{formatPrice(calculateSubtotal())}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Frais de livraison</span>
            <span>{formatPrice(calculateShippingFee())}</span>
          </div>
          <div className="flex justify-between items-center font-bold text-lg pt-2 border-t">
            <span>Total</span>
            <span className="text-2xl text-vapo-purple-primary">{formatPrice(calculateTotal())}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderProcessingStep = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-16 h-16 border-4 border-vapo-purple-primary border-t-transparent rounded-full animate-spin mb-4" />
      {isValidatingStock ? (
        <>
          <h2 className="text-xl font-semibold mb-2">Vérification du stock...</h2>
          <p className="text-gray-600 text-center">
            Nous vérifions la disponibilité des produits
          </p>
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-2">Traitement du paiement...</h2>
          <p className="text-gray-600 text-center">
            Veuillez patienter pendant que nous traitons votre paiement
          </p>
        </>
      )}
    </div>
  );

  if (isLoadingCart || isLoadingAddresses || isLoadingPaymentMethods) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <ShoppingCart className="text-vapo-purple-primary w-6 h-6" />
          <h1 className="text-2xl font-bold text-gray-900">Finaliser la commande</h1>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-8">
          <div className={`flex-1 text-center ${currentStep === 'address' ? 'text-vapo-purple-primary font-semibold' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${currentStep === 'address' ? 'bg-vapo-purple-primary text-white' : 'bg-gray-200'}`}>1</div>
            <div className="text-xs">Adresse</div>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 mx-2" />
          <div className={`flex-1 text-center ${currentStep === 'payment' ? 'text-vapo-purple-primary font-semibold' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${currentStep === 'payment' || currentStep === 'review' || currentStep === 'processing' ? 'bg-vapo-purple-primary text-white' : 'bg-gray-200'}`}>2</div>
            <div className="text-xs">Paiement</div>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 mx-2" />
          <div className={`flex-1 text-center ${currentStep === 'review' || currentStep === 'processing' ? 'text-vapo-purple-primary font-semibold' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${currentStep === 'review' || currentStep === 'processing' ? 'bg-vapo-purple-primary text-white' : 'bg-gray-200'}`}>3</div>
            <div className="text-xs">Vérifier</div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-6 mb-6">
          {currentStep === 'address' && renderAddressStep()}
          {currentStep === 'payment' && renderPaymentStep()}
          {currentStep === 'review' && renderReviewStep()}
          {currentStep === 'processing' && renderProcessingStep()}
        </div>

        {/* Actions */}
        {currentStep !== 'processing' && (
          <div className="flex gap-4">
            {currentStep !== 'address' && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  if (currentStep === 'payment') setCurrentStep('address');
                  if (currentStep === 'review') setCurrentStep('payment');
                }}
              >
                Retour
              </Button>
            )}
            <Button
              variant="vapo"
              className="flex-1"
              onClick={handleNextStep}
              disabled={isProcessingPayment}
            >
              {currentStep === 'review' ? 'Payer maintenant' : 'Continuer'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
