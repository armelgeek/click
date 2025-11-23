import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/components/ui/dialog';
import { LoadingSpinner } from '@/components/atoms/loading-spinner';
import { useState, useRef, useEffect } from 'react';
import { useAddresses, useAddressesMutations } from '@/app/user/hooks/use-addresses';
import { Address } from '@/shared/types/api.types';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Button } from '@/shared/components/ui/button';
import { Truck, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router';
import { useCart, useCartMutations } from '@/app/cart';
import { CartAPI } from '@/app/cart/api/cart-api';
import type { StockValidationResponse } from '@/app/cart/types';
import { CatalogAPI } from '@/app/catalog/api/catalog-api';
import { formatPrice } from '@/lib/utils';
import { useSession } from '@/shared/config/auth.config';

const deliveryModes = [
    { label: 'Livraison express', value: 'express' },
    { label: 'Livraison express avec Happy Hour', value: 'express_happy_hour', description: 'Livraison ultra-rapide pendant les heures de pointe' },
    { label: 'Livraison planifiée', value: 'planified' },
];

const deliveryConfirmationTypes = [
    { label: 'Confirmation simple', value: 'simple', description: 'Confirmation de réception sans preuve' },
    { label: 'Avec signature', value: 'signature', description: 'Signature numérique requise à la livraison' },
    { label: 'Avec photo', value: 'photo', description: 'Photo de la livraison requise' },
    { label: 'Retour magasin si absent', value: 'return_store', description: 'Retour au magasin si vous êtes absent' },
];

const availableHours = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
];

const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export default function DeliveryPage() {
    const navigate = useNavigate();
    const { error: showErrorToast } = useToast();
    const { data: session } = useSession();
    const { cart, isLoading: isLoadingCart } = useCart(session?.user?.id || '');
    const { createOrder } = useCartMutations();
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [stockValidation, setStockValidation] = useState<StockValidationResponse | null>(null);
    const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);
    const [mode, setMode] = useState<'express' | 'express_happy_hour' | 'planified'>('express');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedHour, setSelectedHour] = useState('');
    const [confirmationType, setConfirmationType] = useState<'simple' | 'signature' | 'photo' | 'return_store'>('simple');
    const [form, setForm] = useState({
        name: '',
        phone: '',
        street: '',
        city: '',
        zip: '',
        country: '',
    });
    const formContainerRef = useRef<HTMLDivElement | null>(null);
    const { addresses, isLoading: isLoadingAddresses } = useAddresses(session?.user?.id || '');
    const { createAddress } = useAddressesMutations();
    const [selectedAddressId, setSelectedAddressId] = useState('');

    // Sélection automatique de l'adresse par défaut si elle existe
    useEffect(() => {
        if (addresses.length > 0 && !selectedAddressId) {
            const defaultAddr = addresses.find(a => a.isDefault);
            if (defaultAddr) {
                setSelectedAddressId(defaultAddr.id);
            }
        }
    }, [addresses, selectedAddressId]);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [geoModal, setGeoModal] = useState(false);
    const [geoError, setGeoError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [multiStoreWarning, setMultiStoreWarning] = useState<string | null>(null);

    // Helper function to extract store IDs from cart items
    const extractStoreIds = (items: typeof cart.items): Set<string> => {
        const storeIds = new Set<string>();
        if (!items) return storeIds;
        
        items.forEach(item => {
            const itemStoreId = (item as { storeId?: string })?.storeId;
            if (itemStoreId) {
                storeIds.add(itemStoreId);
            }
        });
        return storeIds;
    };

    // Validate that all cart items come from the same store
    useEffect(() => {
        if (!cart?.items || cart.items.length === 0) {
            setMultiStoreWarning(null);
            return;
        }

        const storeIds = extractStoreIds(cart.items);

        if (storeIds.size > 1) {
            setMultiStoreWarning(
                `Attention : Votre panier contient des articles de ${storeIds.size} magasins différents. Seuls les articles du premier magasin seront commandés.`
            );
        } else {
            setMultiStoreWarning(null);
        }
    }, [cart?.items]);

    const calculateSubtotal = () => {
        if (!cart) return 0;
        return cart.items.reduce((total, item) => {
            const price = Number(item.price) || 0;
            const quantity = Number(item.quantity) || 0;
            return total + price * quantity;
        }, 0);
    };

    const calculateShippingFee = () => {
        // Happy Hour express delivery has a premium
        if (mode === 'express_happy_hour') {
            return 7.99;
        }
        return 4.99;
    };

    const calculateTotal = () => {
        return Number(calculateSubtotal()) + Number(calculateShippingFee());
    };


    const validateOrderInputs = () => {
        if (!cart) {
            setSubmitError('Le panier est vide');
            setErrors({});
            showErrorToast('Le panier est vide');
            formContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return false;
        }

        const newErrors: Record<string, string> = {};

        // Validation des champs obligatoires
        if (!form.name.trim()) newErrors.name = 'Veuillez renseigner votre nom';
        if (!form.phone.trim()) newErrors.phone = 'Veuillez renseigner votre numéro de téléphone';

        if (mode === 'planified' && !selectedHour) newErrors.hour = 'Veuillez sélectionner une heure de livraison';

        const isCreatingNewAddress = addresses.length === 0 || showAddressForm || !selectedAddressId;
        if (isCreatingNewAddress) {
            if (!form.street) newErrors.street = 'Rue requise';
            if (!form.city) newErrors.city = 'Ville requise';
            if (!form.zip) newErrors.zip = 'Code postal requis';
            if (!form.country) newErrors.country = 'Pays requis';
        } else if (!selectedAddressId) {
            setSubmitError('Veuillez sélectionner une adresse de livraison');
            const addrEl = document.getElementById('delivery-addresses-section');
            if (addrEl) {
                addrEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                formContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            showErrorToast('Veuillez sélectionner une adresse de livraison');
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setSubmitError('Veuillez corriger les champs indiqués');
            // Scroll to the first invalid field
            const firstKey = Object.keys(newErrors)[0];
            const fieldId = `delivery-input-${firstKey}`;
            const el = document.getElementById(fieldId);
            if (el) {
                (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
                (el as HTMLElement).focus();
            } else {
                formContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            // Show a toast
            showErrorToast('Veuillez corriger les champs indiqués');
            return false;
        }

        // Clear previous errors if validation is successful
        setSubmitError(null);
        setErrors({});
        return true;
    };

    const handleSubmit = async () => {
        if (!cart) return;

        // Re-validation avant soumission (sécurité si modal a été contourné)
        if (!validateOrderInputs()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        let addressId = selectedAddressId;

        // Si on est en mode formulaire d'adresse (aucune adresse existante sélectionnée)
        const isCreatingNewAddress = addresses.length === 0 || showAddressForm || !selectedAddressId;

        if (isCreatingNewAddress) {
            // Valider les champs d'adresse uniquement si on crée une nouvelle adresse
            if (!form.street || !form.city || !form.zip || !form.country) {
                setSubmitError('Veuillez remplir tous les champs requis pour l\'adresse');
                setIsSubmitting(false);
                return;
            }

            // Créer l'adresse
            try {
                const payload = {
                    userId: session?.user?.id,
                    label: `${form.street}, ${form.zip} ${form.city}`,
                    streetAddress: form.street,
                    city: form.city,
                    state: '',
                    postalCode: form.zip,
                    country: form.country,
                };
                const res = await createAddress.mutateAsync({ ...payload, userId: session?.user?.id });
                if (res && res.address && res.address.id) {
                    addressId = res.address.id;
                    setSelectedAddressId(addressId);
                    setShowAddressForm(false);
                } else {
                    setSubmitError("Erreur lors de l'ajout de l'adresse");
                    setIsSubmitting(false);
                    return;
                }
            } catch (e) {
                setSubmitError("Erreur lors de l'ajout de l'adresse");
                setIsSubmitting(false);
                return;
            }
        } else {
            // Si on a des adresses existantes mais aucune n'est sélectionnée
            if (!addressId) {
                setSubmitError('Veuillez sélectionner une adresse de livraison');
                setIsSubmitting(false);
                return;
            }
        }

        try {
            // Validate stock for all cart items before creating order
            const itemsToCheck = cart.items || [];
            const stockChecks = await Promise.all(itemsToCheck.map(async (i) => {
                try {
                    const stock = await CatalogAPI.getProductStock(i.productId);
                    return { item: i, stock };
                } catch (e) {
                    return { item: i, stock: null };
                }
            }));

            const insufficient = stockChecks.filter(sc => !sc.stock || sc.stock.quantity < sc.item.quantity);
            console.log('insufficient', insufficient);
            if (insufficient.length > 0) {
                setStockValidation({
                    valid: false,
                    items: insufficient.map(s => ({ productId: s.item.productId, requestedQuantity: s.item.quantity, availableQuantity: s.stock?.quantity ?? 0, isAvailable: false })),
                });
                setSubmitError('Un ou plusieurs produits sont en rupture de stock ou la quantité demandée dépasse le stock disponible. Veuillez vérifier votre panier.');
                setIsSubmitting(false);
                return;
            }
            // Also validate on backend (server authoritative check)
            try {
                // Only validate on the server if authenticated
                if (!session?.user?.id) {
                    setStockValidation(null);
                    setSubmitError('Veuillez vous connecter pour effectuer la validation & passer la commande.');
                    setIsSubmitting(false);
                    return;
                }
                const payload = { userId: session.user.id };
                const apiValidation = await CartAPI.validateStockThrottled(true, undefined, payload);
                if (!apiValidation.valid) {
                    setStockValidation(apiValidation);
                    setSubmitError('Un ou plusieurs produits ne sont plus disponibles. Veuillez vérifier votre panier.');
                    setIsSubmitting(false);
                    return;
                }
            } catch (e) {
                // If server validation fails for any reason, stop to avoid order issues
                setSubmitError('Impossible de valider le stock. Veuillez réessayer plus tard.');
                setIsSubmitting(false);
                return;
            }
            const deliveryInfo = mode === 'express'
                ? 'Livraison express (le jour même)'
                : mode === 'express_happy_hour'
                ? 'Livraison express avec Happy Hour (ultra-rapide)'
                : `Livraison planifiée le ${selectedDate.toLocaleDateString('fr-FR')} à ${selectedHour}`;

            const confirmationInfo = confirmationType === 'simple'
                ? 'Confirmation simple'
                : confirmationType === 'signature'
                ? 'Avec preuve signature'
                : confirmationType === 'photo'
                ? 'Avec preuve photo'
                : 'Retour magasin si absent';

            // Extract and validate storeId from cart items
            if (!cart?.items || cart.items.length === 0) {
                setSubmitError('Le panier est vide');
                setIsSubmitting(false);
                return;
            }

            // Get all unique store IDs from cart items using helper
            const storeIds = extractStoreIds(cart.items);

            // Validate we have at least one store ID
            if (storeIds.size === 0) {
                setSubmitError('Impossible de déterminer le magasin. Veuillez vérifier votre panier.');
                setIsSubmitting(false);
                console.error('No storeId found in any cart items');
                return;
            }

            // Warn if multiple stores (use first one)
            if (storeIds.size > 1) {
                console.warn(`Cart contains items from ${storeIds.size} different stores. Using first store.`);
            }

            const storeId = Array.from(storeIds)[0];

            const response = await createOrder.mutateAsync({
                userId: session?.user?.id || '',
                storeId: storeId,
                addressId: addressId,
                notes: `${deliveryInfo} - Téléphone: ${form.phone} - Confirmation: ${confirmationInfo}`,
                mode: (mode === 'express_happy_hour' ? 'express' : mode) as 'express' | 'planified',
                planifiedDate: mode === 'planified' ? selectedDate.toISOString().split('T')[0] : undefined,
                planifiedHour: mode === 'planified' ? selectedHour : undefined,
            });
            
            // Handle both new and legacy response formats
            const orderId = response?.order?.id || (response as { id?: string })?.id;
            if (orderId) {
                navigate(`/order-success/${orderId}`);
            } else {
                setSubmitError('Erreur lors de la création de la commande. Veuillez réessayer.');
            }
        } catch (error) {
            console.error('Submit error:', error);
            setSubmitError('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingCart) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Chargement...</div>
            </div>
        );
    }

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const days = daysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();



    const handleValidateOrder = () => {
        if (validateOrderInputs()) {
            setShowWarningModal(true);
        }
    };

    const handleWarningConfirm = async () => {
        setShowWarningModal(false);
        setIsSimulatingPayment(true);
        setTimeout(async () => {
            setIsSimulatingPayment(false);
            await handleSubmit();
        }, 5000); // 5s payment simulation
    };

    return (
        <div className="min-h-screen flex flex-col gap-6 p-4">

            <div className="flex items-center justify-between">
                <Label icon={<Truck className="text-vapo-purple-primary w-5 h-5" />} className="text-vapo-purple-primary text-lg font-semibold mb-2">
                    Détail Livraison
                </Label>
                <Button variant="link" className="text-gray-500 text-sm underline px-0" onClick={() => navigate(-1)}>
                    Fermer
                </Button>
            </div>
            <div className="bg-white rounded-2xl p-6 flex flex-col gap-2">
                <div className="text-lg font-medium">Prix total</div>
                <div className="text-2xl font-bold">{formatPrice(calculateTotal())}</div>
                <div className="text-sm text-gray-600 mt-2">
                    <div className="flex justify-between">
                        <span>Sous-total</span>
                        <span>{formatPrice(calculateSubtotal())}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Frais de livraison</span>
                        <span>{formatPrice(calculateShippingFee())}</span>
                    </div>
                </div>
            </div>
            <div ref={formContainerRef} className="bg-white rounded-2xl p-6 flex flex-col gap-4">
                <div className="text-lg font-semibold mb-1">Détail de la livraison</div>
                <div className="text-sm text-gray-700 mb-2">Veuillez remplir les informations en bas concernant l'adresse de livraison.</div>

                {multiStoreWarning && (
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-orange-700">
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                            <p>{multiStoreWarning}</p>
                        </div>
                    </div>
                )}

                {submitError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                            <div className="flex-1">
                                <p>{submitError}</p>
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
                                                            Quantité demandée: {item.requestedQuantity} - Disponible: {item.availableQuantity}
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

                <div className="text-vapo-purple-primary font-semibold mb-1">Information client</div>
                <div>
                    <Input
                        id="delivery-input-name"
                        placeholder="Nom et prénom"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                    <PhoneInput
                        id="delivery-input-phone"
                        international
                        defaultCountry="FR"
                        countryCallingCodeEditable={false}
                        placeholder="Numéro de téléphone (+33...)"
                        className={`mb-1 border border-gray-300 rounded-md px-3 py-2 w-full focus:border-vapo-purple-primary focus:ring-vapo-purple-primary/30 ${errors.phone ? 'border-red-500 mb-1' : 'mb-1'}`}
                        value={form.phone}
                        onChange={val => setForm(f => ({ ...f, phone: val || '' }))}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div className="text-vapo-purple-primary font-semibold mb-1">Adresse de livraison</div>
                {isLoadingAddresses ? (
                    <div className="text-gray-500">Chargement des adresses...</div>
                ) : addresses.length === 0 || showAddressForm ? (
                    <>
                        <div className="text-gray-600 mb-2">
                            Veuillez remplir les informations en bas concernant l'adresse pour la livraison.
                        </div>

                        <div className="flex gap-2 mb-2 items-center">
                            <Input
                                id="delivery-input-street"
                                placeholder="Numéro de rue"
                                value={form.street}
                                onChange={e => setForm(f => ({ ...f, street: e.target.value }))}
                                className={errors.street ? 'border-red-500' : ''}
                            />
                        </div>
                        {geoError && <p className="text-red-500 text-sm mt-1">{geoError}</p>}
                        {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
                        {/* Modale de demande d'autorisation géoloc */}
                        {geoModal && (
                            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                                <div className="bg-white rounded-xl shadow-lg p-6 max-w-xs w-full flex flex-col items-center">
                                    <div className="mb-3 text-vapo-purple-primary font-semibold text-lg">Autoriser la géolocalisation</div>
                                    <div className="text-gray-700 text-sm mb-4 text-center">Pour remplir automatiquement votre adresse, autorisez l'accès à votre position.</div>
                                    <Button variant="outline" onClick={() => setGeoModal(false)}>Annuler</Button>
                                </div>
                            </div>
                        )}
                        <Input
                            id="delivery-input-city"
                            placeholder="Ville"
                            value={form.city}
                            onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                            className={errors.city ? 'border-red-500' : ''}
                        />
                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                        <Input
                            id="delivery-input-zip"
                            placeholder="Code postal"
                            value={form.zip}
                            onChange={e => setForm(f => ({ ...f, zip: e.target.value }))}
                            className={errors.zip ? 'border-red-500' : ''}
                        />
                        {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip}</p>}
                        <Input
                            id="delivery-input-country"
                            placeholder="Pays"
                            value={form.country}
                            onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                            className={errors.country ? 'border-red-500' : ''}
                        />
                        {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                        {addresses.length > 0 && (
                            <Button
                                variant="vapo"
                                className="mt-4"
                                onClick={() => setShowAddressForm(false)}
                            >
                                Mes adresses
                            </Button>
                        )}

                        <Button
                            type="button"
                            variant="outline"
                            className="whitespace-nowrap"
                            onClick={() => {
                                setGeoError(null);
                                if (!navigator.geolocation) {
                                    setGeoError('La géolocalisation n\'est pas supportée par ce navigateur.');
                                    return;
                                }
                                setGeoModal(true);
                                navigator.geolocation.getCurrentPosition(
                                    async (pos) => {
                                        setGeoModal(false);
                                        const { latitude, longitude } = pos.coords;
                                        // Appel simple à Nominatim (OpenStreetMap) pour reverse geocoding
                                        try {
                                            const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                                            const data = await resp.json();
                                            setForm(f => ({
                                                ...f,
                                                street: data.address.road || '',
                                                city: data.address.city || data.address.town || data.address.village || '',
                                                zip: data.address.postcode || '',
                                                country: data.address.country || '',
                                            }));
                                        } catch (e) {
                                            setGeoError('Impossible de récupérer l\'adresse depuis la position.');
                                        }
                                    },
                                    () => {
                                        setGeoModal(false);
                                        setGeoError('Géolocalisation refusée ou indisponible.');
                                    }
                                );
                            }}
                        >
                            Utiliser ma position
                        </Button>
                    </>
                ) : (
                    <>
                        <div className="mb-2">Mes adresses :</div>
                        <div id="delivery-addresses-section" className="flex flex-col gap-2">
                            {addresses.map((address: Address) => (
                                <label
                                    key={address.id}
                                    className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${selectedAddressId === address.id
                                        ? 'border-vapo-purple-primary bg-purple-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="address"
                                        value={address.id}
                                        checked={selectedAddressId === address.id}
                                        onChange={() => {
                                            setSelectedAddressId(address.id);
                                            setForm(f => ({
                                                ...f,
                                                street: address.streetAddress,
                                                city: address.city,
                                                zip: address.postalCode,
                                                country: address.country,
                                            }));
                                        }}
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
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => setShowAddressForm(true)}
                        >
                            Nouvelle adresse
                        </Button>
                    </>
                )}
            </div>
            <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
                <div className="text-lg font-semibold mb-1">Choix de la livraison</div>
                <div className="text-sm text-gray-700 mb-2">Sélectionner l'option de livraison que vous voulez.</div>
                <div className="flex flex-col gap-3 mb-2">
                    {deliveryModes.map(opt => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => setMode(opt.value as 'express' | 'express_happy_hour' | 'planified')}
                            className={`flex items-start gap-3 p-3 rounded-lg border-2 text-left transition-colors ${mode === opt.value ? 'border-vapo-purple-primary bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                            <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${mode === opt.value ? 'border-vapo-purple-primary' : 'border-gray-300'}`}>
                                {mode === opt.value && <span className="w-3 h-3 bg-vapo-purple-primary rounded-full" />}
                            </span>
                            <div className="flex-1">
                                <div className={`font-semibold ${mode === opt.value ? 'text-vapo-purple-primary' : 'text-gray-900'}`}>
                                    {opt.label}
                                </div>
                                {opt.description && (
                                    <div className="text-sm text-gray-600 mt-1">
                                        {opt.description}
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
                {mode === 'express' && (
                    <div className="bg-vapo-purple-light-2/40 rounded-xl p-4 flex items-center gap-4">
                        <div>
                            <div className="font-semibold text-vapo-purple-primary mb-1">Livraison express</div>
                            <div className="text-sm text-vapo-purple-primary">Un de nos livreurs prendra la course en charge dans les meilleurs délais, pour effectuer votre livraison.</div>
                        </div>
                    </div>
                )}
                {mode === 'express_happy_hour' && (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-4">
                        <div>
                            <div className="font-semibold text-orange-600 mb-1">Livraison express avec Happy Hour</div>
                            <div className="text-sm text-orange-700">Service de livraison ultra-rapide disponible pendant les heures de pointe. Garantie d'arrivée en moins de 30 minutes ! (+3€)</div>
                        </div>
                    </div>
                )}
                {mode === 'planified' && (
                    <div>
                        <div className="font-semibold text-vapo-purple-primary mb-2">Choisissez les créneaux disponible.</div>
                        {errors.hour && <p className="text-red-500 text-sm mb-2">{errors.hour}</p>}
                        <div className="flex gap-8">
                            {/* Calendar */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <button onClick={() => setSelectedDate(new Date(year, month - 1, 1))} className="text-vapo-purple-primary">{'<'}</button>
                                    <span className="font-medium">{monthNames[month]} {year}</span>
                                    <button onClick={() => setSelectedDate(new Date(year, month + 1, 1))} className="text-vapo-purple-primary">{'>'}</button>
                                </div>
                                <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-1">
                                    <span>lun.</span><span>mar.</span><span>mer.</span><span>jeu.</span><span>ven.</span><span>sam.</span><span>dim.</span>
                                </div>
                                <div className="grid grid-cols-7 gap-1">
                                    {Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }).map((_, i) => <span key={i}></span>)}
                                    {Array.from({ length: days }).map((_, i) => {
                                        const d = i + 1;
                                        const isSelected = selectedDate.getDate() === d && selectedDate.getMonth() === month;
                                        return (
                                            <button
                                                key={d}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center ${isSelected ? 'bg-vapo-purple-primary text-white' : 'hover:bg-vapo-purple-light-2/40'}`}
                                                onClick={() => setSelectedDate(new Date(year, month, d))}
                                            >
                                                {d}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            {/* Hours */}
                            <div id="delivery-input-hour" className="flex flex-col gap-2 ml-6">
                                <div className="font-medium mb-1">Heure disponible</div>
                                <div className="grid grid-cols-2 gap-2">
                                    {availableHours.map(h => (
                                        <Button
                                            key={h}
                                            type="button"
                                            className={`border border-gray-400 text-xs font-medium ${selectedHour === h ? 'bg-vapo-purple-primary text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                                            onClick={() => setSelectedHour(h)}
                                        >
                                            {h}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Delivery Confirmation Type Section */}
            <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
                <div className="text-lg font-semibold mb-1">Type de confirmation de livraison</div>
                <div className="text-sm text-gray-700 mb-2">Choisissez comment vous souhaitez confirmer la réception de votre commande.</div>
                <div className="flex flex-col gap-3">
                    {deliveryConfirmationTypes.map(opt => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => setConfirmationType(opt.value as 'simple' | 'signature' | 'photo' | 'return_store')}
                            className={`flex items-start gap-3 p-3 rounded-lg border-2 text-left transition-colors ${confirmationType === opt.value ? 'border-vapo-purple-primary bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                            <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${confirmationType === opt.value ? 'border-vapo-purple-primary' : 'border-gray-300'}`}>
                                {confirmationType === opt.value && <span className="w-3 h-3 bg-vapo-purple-primary rounded-full" />}
                            </span>
                            <div className="flex-1">
                                <div className={`font-semibold ${confirmationType === opt.value ? 'text-vapo-purple-primary' : 'text-gray-900'}`}>
                                    {opt.label}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    {opt.description}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Additional info based on confirmation type */}
                {confirmationType === 'signature' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2">
                        <div className="font-medium text-blue-900 mb-1">Signature numérique</div>
                        <div className="text-sm text-blue-800">
                            Le livreur vous demandera de signer électroniquement sur son appareil pour confirmer la réception.
                        </div>
                    </div>
                )}
                {confirmationType === 'photo' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2">
                        <div className="font-medium text-blue-900 mb-1">Preuve photographique</div>
                        <div className="text-sm text-blue-800">
                            Le livreur prendra une photo de la livraison effectuée. Vous recevrez cette preuve par email.
                        </div>
                    </div>
                )}
                {confirmationType === 'return_store' && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-2">
                        <div className="font-medium text-orange-900 mb-1">Retour au magasin</div>
                        <div className="text-sm text-orange-800">
                            Si vous êtes absent lors de la livraison, votre commande sera retournée au magasin. Vous pourrez la récupérer sur présentation de votre CNI.
                        </div>
                    </div>
                )}
                {confirmationType === 'simple' && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-2">
                        <div className="font-medium text-gray-900 mb-1">Confirmation simple</div>
                        <div className="text-sm text-gray-800">
                            Le livreur confirmera simplement la remise de votre commande dans l'application.
                        </div>
                    </div>
                )}
            </div>

            <Button
                variant="vapo"
                className="w-full h-14 text-lg font-semibold mt-2"
                onClick={handleValidateOrder}
                disabled={isSubmitting || isSimulatingPayment}
            >
                {isSimulatingPayment ? 'Paiement en cours...' : isSubmitting ? 'Traitement en cours...' : 'Valider ma commande'}
            </Button>

            {/* Modal d’avertissement */}
            <Dialog open={showWarningModal} onOpenChange={setShowWarningModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Attention produits interdits aux mineurs</DialogTitle>
                    </DialogHeader>
                    <div className="text-gray-700 text-base mb-4">
                        Pièce d’identité obligatoire pour récupérer votre commande.<br /><br />
                        Si vous ne pouvez pas prouver votre majorité (CNI), le livreur ne sera pas en mesure de vous remettre votre commande (vous serez facturé).
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowWarningModal(false)}>
                            Annuler
                        </Button>
                        <Button variant="vapo" onClick={handleWarningConfirm}>
                            J’ai compris et je confirme
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            {/* Modal de simulation de paiement */}
            <Dialog open={isSimulatingPayment}>
                <DialogContent className="flex flex-col items-center justify-center gap-4 py-8">
                    <LoadingSpinner size={48} />
                    <div className="text-lg font-semibold text-vapo-purple-primary">Paiement en cours...</div>
                    <div className="text-gray-600 text-base text-center">Merci de patienter pendant la validation de votre paiement.</div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
