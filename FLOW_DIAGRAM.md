# E-commerce Checkout Flow Diagram

## Complete User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      SHOPPING PHASE                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Browse Products │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Add to Cart     │◄─── Can add multiple items
                    └──────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CART PAGE (/cart)                           │
│  • View all cart items                                          │
│  • Adjust quantities                                            │
│  • Remove items                                                 │
│  • See subtotal + shipping                                      │
│  • Button: "Effectuer ma commande"                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   CHECKOUT PAGE (/checkout)                      │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ STEP 1: ADDRESS SELECTION                              │   │
│  │ ┌──────────────────────────────────────────────────┐  │   │
│  │ │ ○ Domicile                                       │  │   │
│  │ │   123 Rue de la République                       │  │   │
│  │ │   75001 Paris, France                            │  │   │
│  │ │   [Par défaut]                                   │  │   │
│  │ └──────────────────────────────────────────────────┘  │   │
│  │ ┌──────────────────────────────────────────────────┐  │   │
│  │ │ ○ Bureau                                         │  │   │
│  │ │   456 Avenue des Champs-Élysées                  │  │   │
│  │ │   75008 Paris, France                            │  │   │
│  │ └──────────────────────────────────────────────────┘  │   │
│  │                                                        │   │
│  │                [Continuer →]                           │   │
│  └────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ STEP 2: PAYMENT METHOD SELECTION                       │   │
│  │ ┌──────────────────────────────────────────────────┐  │   │
│  │ │ ○ Visa **** 4242                                 │  │   │
│  │ │   Exp: 12/2025                                   │  │   │
│  │ │   [Par défaut]                                   │  │   │
│  │ └──────────────────────────────────────────────────┘  │   │
│  │ ┌──────────────────────────────────────────────────┐  │   │
│  │ │ ○ Mastercard **** 5555                           │  │   │
│  │ │   Exp: 06/2026                                   │  │   │
│  │ └──────────────────────────────────────────────────┘  │   │
│  │ ┌──────────────────────────────────────────────────┐  │   │
│  │ │ ○ PayPal                                         │  │   │
│  │ └──────────────────────────────────────────────────┘  │   │
│  │                                                        │   │
│  │     [← Retour]              [Continuer →]             │   │
│  └────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ STEP 3: ORDER REVIEW                                   │   │
│  │                                                        │   │
│  │ Adresse de livraison:                                 │   │
│  │ ├─ Domicile                                           │   │
│  │ └─ 123 Rue de la République, 75001 Paris             │   │
│  │                                                        │   │
│  │ Moyen de paiement:                                    │   │
│  │ └─ Visa - **** 4242                                  │   │
│  │                                                        │   │
│  │ Articles commandés:                                   │   │
│  │ ├─ Product A x 2    ...  19.98 €                     │   │
│  │ └─ Product B x 1    ...   9.99 €                     │   │
│  │                                                        │   │
│  │ Sous-total:                     29.97 €              │   │
│  │ Frais de livraison:              4.99 €              │   │
│  │ ═══════════════════════════════════════              │   │
│  │ Total:                          34.96 €              │   │
│  │                                                        │   │
│  │     [← Retour]          [Payer maintenant →]         │   │
│  └────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ PAYMENT PROCESSING                                     │   │
│  │                                                        │   │
│  │              🔄 Loading spinner                        │   │
│  │                                                        │   │
│  │     Traitement du paiement...                         │   │
│  │     Veuillez patienter...                             │   │
│  │                                                        │   │
│  │     ⏱️ Duration: 2 seconds                            │   │
│  │     🎲 Success Rate: 90%                              │   │
│  └────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
               Success              Failure
                    │                   │
                    │                   └───► Show error message
                    │                         Allow retry (go back to review)
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│              ORDER SUCCESS PAGE (/order-success/:orderId)        │
│                                                                  │
│                     🚚 Delivery Icon                            │
│                                                                  │
│            Commande fait avec succès !                          │
│                                                                  │
│     Votre commande numéro order-1234567890 a été                │
│     effectuée avec succès.                                      │
│                                                                  │
│     Total: 34.96 €                                              │
│                                                                  │
│     Vous pouvez suivre votre commande en cliquant               │
│     sur ce lien [/orders/order-1234567890]                     │
│                                                                  │
│               Vapostore vous remercie !                         │
│               À la prochaine.                                   │
│                                                                  │
│              [← Retourner aux magasins]                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│          DELIVERY TRACKING PAGE (/orders/:orderId)              │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Order #order-1234567890          [En cours de livraison]│   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ ETA: 12 minutes                                        │   │
│  │ Driver: Pierre Martin                                  │   │
│  │ Location: Rue de Rivoli, Paris                         │   │
│  │ Last Updated: 2 seconds ago                            │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ 📍 MAP (Real-time tracking)                            │   │
│  │                                                        │   │
│  │    Shop ──────────► Driver ──────────► Destination    │   │
│  │                         🚲                             │   │
│  │                                                        │   │
│  │  [📞 Call Driver]         [💬 Send Message]           │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Timeline:                                                      │
│  ✅ En préparation              (0-2 min)                      │
│  ✅ Prêt pour ramassage         (2-3 min)                      │
│  ✅ Récupéré par le livreur     (3-4 min)                      │
│  🔄 En cours de livraison       (4-8 min) ← Current           │
│  ⏳ Livré                        (8+ min)                      │
│                                                                  │
│              [Marquer comme reçu]                               │
│                                                                  │
│  ⚡ Auto-updates every 15 seconds                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                    (After 8 minutes of real time)
                              │
                              ▼
                     Status: DELIVERED ✅
                              │
                              ▼
              User clicks "Marquer comme reçu"
                              │
                              ▼
                ┌──────────────────────────┐
                │ ✅ Livraison confirmée ! │
                └──────────────────────────┘
```

## Status Progression Timeline

```
Time:    0min   2min   3min   4min        8min
         │      │      │      │           │
Status:  │      │      │      │           │
         ▼      ▼      ▼      ▼           ▼
      ┌────┐ ┌────┐ ┌────┐ ┌────┐     ┌────┐
      │PREP│→│READY│→│PICK│→│WAY │ ... │DELV│
      └────┘ └────┘ └────┘ └────┘     └────┘
      
      PREP = preparing
      READY = ready for pickup
      PICK = picked_up
      WAY = on_the_way
      DELV = delivered
```

## Data Flow

```
┌─────────────┐
│   Cart      │
│   Module    │
└──────┬──────┘
       │
       │ createOrder()
       ▼
┌─────────────┐
│   Orders    │ ◄──── getMockOrderById()
│   Module    │
└──────┬──────┘
       │
       │ Order ID
       ▼
┌─────────────┐
│  Delivery   │
│   Module    │ ◄──── Auto-creates tracking
└──────┬──────┘       on first access
       │
       │ Auto-update
       │ every 15s
       ▼
   User sees
   real-time
   updates
```

## Mock Data Structure

```
Addresses (2):
├─ addr-1: Domicile (default)
└─ addr-2: Bureau

Payment Methods (3):
├─ pm-1: Visa **** 4242 (default)
├─ pm-2: Mastercard **** 5555
└─ pm-3: PayPal

Drivers (3):
├─ driver-001: Pierre Martin (bike, 4.8★)
├─ driver-002: Sophie Dubois (scooter, 4.9★)
└─ driver-003: Malik Benzema (car, 4.7★)
```

## API Endpoints Summary

```
User Addresses:         5 endpoints
Payment Methods:        4 endpoints
Payment Processing:     3 endpoints
Orders:                 9 endpoints
Delivery Tracking:      5 endpoints
────────────────────────────────────
Total:                 26 endpoints
```

## Security Flow

```
Frontend                    Backend
   │                          │
   │  1. Select address       │
   │  2. Select payment       │
   │  3. Review order         │
   │                          │
   │  POST /payment/intent    │
   ├─────────────────────────►│
   │                          │
   │  ◄─ Payment Intent ID    │
   │                          │
   │  POST /payment/confirm   │
   ├─────────────────────────►│
   │  (with payment token)    │
   │                          │
   │  ◄─ Success/Failure      │
   │                          │
   │  If success:             │
   │  POST /orders            │
   ├─────────────────────────►│
   │  (create order)          │
   │                          │
   │  ◄─ Order ID             │
   │                          │
   │  Navigate to success     │
   │                          │
```

## Error Handling

```
Payment Failed (10% chance)
   │
   ▼
Show Error Message
   │
   ├──► "Payment declined. Please try another payment method."
   │
   ▼
Return to Review Step
   │
   ▼
User Can:
├─ Change payment method
├─ Review order again
└─ Retry payment
```

---

This diagram shows the complete flow from browsing products to delivery confirmation. The entire journey is implemented and functional with mock data, ready for backend integration.
