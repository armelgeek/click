# Backend API Implementation Guide

This document describes the API endpoints that need to be implemented in the backend server to replace the current mock implementations. The application currently uses mock data for the checkout, payment, delivery, and orders flows.

## Base URL
All API endpoints should be available at: `${VITE_APP_SERVER_URL}` (configured in environment variables)

## Authentication
Most endpoints require authentication. Use the existing authentication system with:
- Cookie-based sessions (`withCredentials: true`)
- JWT tokens in headers if applicable

---

## 1. User Addresses API

### GET /users/addresses
Get all addresses for the authenticated user.

**Response:**
```json
{
  "addresses": [
    {
      "id": "string",
      "label": "string",
      "streetAddress": "string",
      "city": "string",
      "state": "string",
      "postalCode": "string",
      "country": "string",
      "latitude": "number | optional",
      "longitude": "number | optional",
      "isDefault": "boolean | optional",
      "createdAt": "string (ISO 8601)",
      "updatedAt": "string (ISO 8601)"
    }
  ]
}
```

### POST /users/addresses
Create a new address for the authenticated user.

**Request Body:**
```json
{
  "label": "string",
  "streetAddress": "string",
  "city": "string",
  "state": "string",
  "postalCode": "string",
  "country": "string",
  "latitude": "number | optional",
  "longitude": "number | optional"
}
```

**Response:**
```json
{
  "address": { /* Address object */ }
}
```

### PUT /users/addresses/:addressId
Update an existing address.

**Request Body:** Same as POST (all fields optional)

**Response:**
```json
{
  "address": { /* Updated address object */ }
}
```

### DELETE /users/addresses/:addressId
Delete an address.

**Response:**
```json
{
  "success": true,
  "message": "Address deleted successfully"
}
```

### PUT /users/addresses/:addressId/default
Set an address as default.

**Response:**
```json
{
  "success": true,
  "message": "Default address updated"
}
```

---

## 2. Payment Methods API

### GET /users/payment-methods
Get all payment methods for the authenticated user.

**Response:**
```json
{
  "paymentMethods": [
    {
      "id": "string",
      "type": "card | paypal | other",
      "provider": "string",
      "token": "string | optional",
      "last4": "string | optional",
      "cardBrand": "string | optional",
      "expiryMonth": "number | optional",
      "expiryYear": "number | optional",
      "isDefault": "boolean | optional",
      "createdAt": "string (ISO 8601)",
      "updatedAt": "string (ISO 8601)"
    }
  ]
}
```

### POST /users/payment-methods
Add a new payment method.

**Request Body:**
```json
{
  "type": "card | paypal | other",
  "provider": "string",
  "token": "string",
  "last4": "string | optional",
  "cardBrand": "string | optional",
  "expiryMonth": "number | optional",
  "expiryYear": "number | optional"
}
```

**Response:**
```json
{
  "paymentMethod": { /* PaymentMethod object */ }
}
```

### DELETE /users/payment-methods/:paymentId
Delete a payment method.

**Response:**
```json
{
  "success": true,
  "message": "Payment method deleted"
}
```

### PUT /users/payment-methods/:paymentId/default
Set a payment method as default.

**Response:**
```json
{
  "success": true,
  "message": "Default payment method updated"
}
```

---

## 3. Payment Processing API

### POST /payment/intent
Create a payment intent.

**Request Body:**
```json
{
  "amount": "number",
  "currency": "string",
  "orderId": "string"
}
```

**Response:**
```json
{
  "paymentIntentId": "string",
  "clientSecret": "string",
  "status": "string",
  "amount": "number",
  "currency": "string"
}
```

### POST /payment/confirm
Confirm a payment.

**Request Body:**
```json
{
  "paymentIntentId": "string",
  "paymentMethodToken": "string"
}
```

**Response:**
```json
{
  "success": true,
  "status": "succeeded | failed | requires_action",
  "message": "string",
  "transactionId": "string | optional"
}
```

### POST /payment/simulate-error
Simulate payment errors (for testing).

**Request Body:**
```json
{
  "type": "declined | insufficient_funds | network_error | authentication_required"
}
```

**Response:**
```json
{
  "error": "string",
  "message": "string"
}
```

---

## 4. Orders API

### POST /orders
Create a new order (called from CartAPI after successful payment).

**Request Body:**
```json
{
  "addressId": "string",
  "paymentMethodId": "string",
  "notes": "string | optional"
}
```

**Response:**
```json
{
  "order": {
    "id": "string",
    "status": "pending | confirmed | preparing | in_delivery | delivered | cancelled",
    "date": "string (ISO 8601)",
    "deliveryAddress": "string",
    "totalAmount": "number",
    "currency": "string",
    "items": [
      {
        "id": "string",
        "name": "string",
        "quantity": "number",
        "price": "number",
        "image": "string | optional"
      }
    ],
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
}
```

### GET /orders
Get all orders for the authenticated user with pagination.

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10, max: 100)

**Response:**
```json
{
  "data": [ /* Array of Order objects */ ],
  "total": "number",
  "page": "number",
  "limit": "number",
  "totalPages": "number"
}
```

### GET /orders/:orderId
Get details of a specific order.

**Response:**
```json
{
  /* Order object with full details */
}
```

### GET /orders/statistics
Get order statistics for the user.

**Response:**
```json
{
  "totalOrders": "number",
  "totalSpent": "number",
  "averageOrderValue": "number"
}
```

### PUT /orders/:orderId/cancel
Cancel an order.

**Request Body:**
```json
{
  "reason": "string | optional"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

### POST /orders/:orderId/return
Request a return for an order.

**Request Body:**
```json
{
  "reason": "string",
  "items": ["string"] /* Optional array of item IDs */
}
```

**Response:**
```json
{
  "success": true,
  "message": "Return request submitted"
}
```

### GET /orders/:orderId/return-status
Get the status of a return request.

**Response:**
```json
{
  "orderId": "string",
  "status": "pending | approved | rejected | completed",
  "reason": "string | optional",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

### POST /orders/:orderId/rating
Rate an order.

**Request Body:**
```json
{
  "rating": "number (1-5)",
  "comment": "string | optional"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you for your rating!"
}
```

### GET /orders/:orderId/invoice
Get the invoice URL for an order.

**Response:**
```json
{
  "url": "string (invoice PDF URL)"
}
```

### POST /orders/:orderId/confirm-delivery
Confirm delivery of an order.

**Request Body:**
```json
{
  "photoUrl": "string | optional",
  "signature": "string | optional",
  "notes": "string | optional"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Delivery confirmed"
}
```

---

## 5. Delivery Tracking API

### GET /delivery/:orderId/tracking
Get real-time delivery tracking for an order.

**Response:**
```json
{
  "tracking": {
    "id": "string",
    "orderId": "string",
    "status": "preparing | ready | picked_up | on_the_way | nearby | delivered | failed | returned",
    "estimatedTimeMinutes": "number",
    "driver": {
      "id": "string",
      "name": "string",
      "phone": "string",
      "photo": "string | optional",
      "vehicleType": "bike | scooter | car",
      "rating": "number"
    },
    "currentLocation": {
      "coordinates": {
        "latitude": "number",
        "longitude": "number"
      },
      "address": "string",
      "landmark": "string | optional"
    },
    "destination": {
      "coordinates": {
        "latitude": "number",
        "longitude": "number"
      },
      "address": "string",
      "landmark": "string | optional"
    },
    "shopLocation": {
      "coordinates": {
        "latitude": "number",
        "longitude": "number"
      },
      "address": "string",
      "landmark": "string | optional"
    },
    "timeline": [
      {
        "id": "string",
        "status": "string",
        "timestamp": "string (ISO 8601)",
        "description": "string",
        "location": "string | optional"
      }
    ],
    "canCall": "boolean",
    "canMessage": "boolean",
    "lastUpdated": "string (ISO 8601)"
  }
}
```

**Note:** This endpoint is called every 15 seconds by the frontend for real-time updates. Consider implementing WebSocket or Server-Sent Events for better performance.

### GET /delivery/:orderId/status-updates
Get lightweight status updates (polled more frequently).

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "string",
    "status": "string",
    "estimatedTimeMinutes": "number",
    "currentLocation": {
      "coordinates": { "latitude": "number", "longitude": "number" },
      "address": "string"
    },
    "lastUpdated": "string (ISO 8601)"
  }
}
```

**Note:** This endpoint is called every 5 seconds for position updates. Implement rate limiting and consider WebSocket.

### POST /delivery/:orderId/call-driver
Initiate a call to the driver.

**Response:**
```json
{
  "success": true,
  "message": "Call initiated to driver"
}
```

### POST /delivery/:orderId/message
Send a message to the driver.

**Request Body:**
```json
{
  "message": "string"
}
```

**Response:**
```json
{
  "success": true,
  "response": "string (driver's response or auto-response)"
}
```

### POST /delivery/:orderId/mark-received
Mark an order as received by the customer.

**Response:**
```json
{
  "success": true,
  "message": "Order marked as received"
}
```

---

## Implementation Notes

### 1. Real-time Updates
The current mock implementation simulates automatic delivery progression:
- Orders start in "preparing" status
- Progress through: ready → picked_up → on_the_way → delivered
- Timeline is auto-populated based on status

**Backend should:**
- Update order status based on driver actions
- Emit events when status changes
- Consider WebSocket/SSE instead of polling
- Maintain delivery timeline history

### 2. Payment Processing
The current mock has a 10% random failure rate for testing.

**Backend should:**
- Integrate with real payment gateway (Stripe, PayPal, etc.)
- Handle payment webhooks
- Implement proper error handling and retry logic
- Store transaction records
- Handle refunds and chargebacks

### 3. Data Relationships
- Orders are created from cart items after successful payment
- Each order automatically gets a delivery tracking entry
- Delivery tracking should be created when order status changes to "confirmed"
- Link orders to users, addresses, and payment methods

### 4. Security Considerations
- Validate user owns the order before allowing access
- Sanitize address and payment data
- Use HTTPS for all payment-related endpoints
- Implement rate limiting on polling endpoints
- Validate payment amounts match cart totals server-side
- Use PCI-compliant payment tokenization

### 5. Performance Optimization
- Cache frequently accessed data (user addresses, payment methods)
- Implement pagination for order lists
- Consider database indexes on user_id, order_id, status
- Use connection pooling for database
- Implement CDN for static assets (product images)

### 6. Monitoring & Logging
- Log all payment transactions
- Monitor delivery tracking polling frequency
- Alert on failed payments
- Track order completion rates
- Monitor API response times

---

## Migration from Mock to Real Backend

### Phase 1: Replace Mock APIs
1. Implement `/users/addresses` endpoints
2. Implement `/users/payment-methods` endpoints
3. Update frontend to remove mock implementations

### Phase 2: Payment Integration
1. Set up payment gateway account
2. Implement `/payment/*` endpoints
3. Test payment flow thoroughly
4. Implement webhook handlers

### Phase 3: Orders & Delivery
1. Implement `/orders` endpoints
2. Implement `/delivery` endpoints
3. Set up driver mobile app or admin panel for status updates
4. Consider WebSocket for real-time tracking

### Phase 4: Production Launch
1. Load testing
2. Security audit
3. PCI compliance check
4. Backup and disaster recovery plan
5. Monitoring setup

---

## Environment Variables Required

```bash
# Backend
DATABASE_URL=postgresql://...
PAYMENT_GATEWAY_SECRET_KEY=sk_...
PAYMENT_GATEWAY_PUBLISHABLE_KEY=pk_...
JWT_SECRET=...
SESSION_SECRET=...

# Frontend (.env)
VITE_APP_SERVER_URL=https://api.yourapp.com
VITE_PAYMENT_GATEWAY_PUBLIC_KEY=pk_...
```

---

## Testing Recommendations

1. **Unit Tests**: Test each API endpoint independently
2. **Integration Tests**: Test complete flows (cart → checkout → payment → delivery)
3. **Load Tests**: Simulate multiple concurrent users
4. **Security Tests**: Penetration testing for payment flows
5. **E2E Tests**: Automate entire user journey

---

## Support & Questions

For implementation questions or clarifications on any endpoint, please refer to:
- The mock implementations in `/src/app/*/api/` directories
- Type definitions in `/src/shared/types/api.types.ts`
- This documentation

Good luck with the backend implementation! 🚀
