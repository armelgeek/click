# ClickNVape Backend API Server

Backend API server for the ClickNVape e-commerce platform. This server implements all the endpoints documented in `BACKEND_API_DOCUMENTATION.md`.

## Features

- 🔐 JWT-based authentication
- 💳 Payment processing (Stripe integration ready)
- 📦 Order management
- 🚚 Delivery tracking
- 📍 Address management
- 💰 Payment methods management
- 🗄️ PostgreSQL database with Prisma ORM
- 🔒 Secure API endpoints with CORS
- ⚡ Built with TypeScript & Express

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (jsonwebtoken)
- **Payment:** Stripe (ready for integration)

## Prerequisites

- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm or yarn or bun

## Installation

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file with your configuration:**
   ```env
   PORT=3000
   NODE_ENV=development
   DATABASE_URL="postgresql://user:password@localhost:5432/clicknvape?schema=public"
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRATION=7d
   PAYMENT_GATEWAY_SECRET_KEY=sk_test_your_stripe_secret_key
   PAYMENT_GATEWAY_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   FRONTEND_URL=http://localhost:5173
   SESSION_SECRET=your-session-secret
   ```

5. **Set up database:**
   ```bash
   # Generate Prisma client
   npm run prisma:generate

   # Run database migrations
   npm run prisma:migrate
   ```

## Development

Start the development server with hot reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the PORT you specified).

## Production

Build and start the production server:

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

## API Endpoints

### User Addresses
- `GET /users/addresses` - Get all user addresses
- `POST /users/addresses` - Create a new address
- `PUT /users/addresses/:addressId` - Update an address
- `DELETE /users/addresses/:addressId` - Delete an address
- `PUT /users/addresses/:addressId/default` - Set default address

### Payment Methods
- `GET /users/payment-methods` - Get all payment methods
- `POST /users/payment-methods` - Add a new payment method
- `DELETE /users/payment-methods/:paymentId` - Delete a payment method
- `PUT /users/payment-methods/:paymentId/default` - Set default payment method

### Payment Processing
- `POST /payment/intent` - Create a payment intent
- `POST /payment/confirm` - Confirm a payment
- `POST /payment/simulate-error` - Simulate payment errors (testing)

### Orders
- `POST /orders` - Create a new order
- `GET /orders` - Get all orders (paginated)
- `GET /orders/:orderId` - Get order details
- `GET /orders/statistics` - Get order statistics
- `PUT /orders/:orderId/cancel` - Cancel an order
- `POST /orders/:orderId/return` - Request order return
- `GET /orders/:orderId/return-status` - Get return status
- `POST /orders/:orderId/rating` - Rate an order
- `GET /orders/:orderId/invoice` - Get order invoice
- `POST /orders/:orderId/confirm-delivery` - Confirm delivery

### Delivery Tracking
- `GET /delivery/:orderId/tracking` - Get delivery tracking
- `GET /delivery/:orderId/status-updates` - Get status updates
- `POST /delivery/:orderId/call-driver` - Call the driver
- `POST /delivery/:orderId/message` - Send message to driver
- `POST /delivery/:orderId/mark-received` - Mark order as received

## Database Schema

The database schema includes the following models:

- **User** - User accounts
- **Address** - User delivery addresses
- **PaymentMethod** - Saved payment methods
- **Order** - Customer orders
- **OrderItem** - Items in an order
- **Payment** - Payment transactions
- **Delivery** - Delivery tracking information
- **DeliveryTimeline** - Delivery status history
- **DeliveryMessage** - Messages between customer and driver
- **OrderRating** - Order ratings
- **OrderReturn** - Return requests

View the full schema in `prisma/schema.prisma`.

## Database Management

```bash
# Open Prisma Studio (database GUI)
npm run prisma:studio

# Create a new migration
npm run prisma:migrate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Seed database with sample data
npx prisma db seed
```

## Authentication

All endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

The token should be obtained from your authentication system (e.g., better-auth in the frontend).

## Testing

### Manual Testing

Use tools like:
- Postman
- Insomnia
- cURL
- Thunder Client (VS Code extension)

Example request:
```bash
curl -X GET http://localhost:3000/users/addresses \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json"
```

### Health Check

```bash
curl http://localhost:3000/health
```

## Project Structure

```
server/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/
│   │   ├── index.ts           # Configuration
│   │   └── database.ts        # Prisma client
│   ├── controllers/
│   │   ├── addresses.controller.ts
│   │   ├── payment-methods.controller.ts
│   │   ├── payment.controller.ts
│   │   ├── orders.controller.ts
│   │   └── delivery.controller.ts
│   ├── middleware/
│   │   ├── auth.ts            # Authentication middleware
│   │   └── error.ts           # Error handling
│   ├── routes/
│   │   ├── addresses.routes.ts
│   │   ├── payment-methods.routes.ts
│   │   ├── payment.routes.ts
│   │   ├── orders.routes.ts
│   │   └── delivery.routes.ts
│   ├── app.ts                 # Express app setup
│   └── index.ts               # Server entry point
├── .env.example               # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

## Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

Error responses follow this format:
```json
{
  "error": "Error name",
  "message": "Descriptive error message"
}
```

## Security Considerations

- ✅ JWT authentication on all routes
- ✅ CORS configured for frontend origin
- ✅ SQL injection prevention (Prisma)
- ✅ Input validation
- ✅ Ownership verification on resources
- ⚠️ Add rate limiting in production
- ⚠️ Implement HTTPS in production
- ⚠️ Use secure session secrets
- ⚠️ Enable Helmet.js for security headers
- ⚠️ Implement request logging

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 3000) |
| `NODE_ENV` | Environment mode | No (default: development) |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret for JWT signing | Yes |
| `JWT_EXPIRATION` | JWT token expiration | No (default: 7d) |
| `PAYMENT_GATEWAY_SECRET_KEY` | Stripe secret key | Yes |
| `PAYMENT_GATEWAY_PUBLISHABLE_KEY` | Stripe publishable key | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | Yes |
| `SESSION_SECRET` | Session secret | Yes |

## Deployment

### Docker (Recommended)

1. Build the Docker image:
   ```bash
   docker build -t clicknvape-api .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 --env-file .env clicknvape-api
   ```

### Manual Deployment

1. Set up PostgreSQL database
2. Configure environment variables
3. Run migrations: `npm run prisma:migrate`
4. Build: `npm run build`
5. Start: `npm start`

### Platforms

Compatible with:
- Heroku
- Railway
- Render
- DigitalOcean App Platform
- AWS (EC2, ECS, Lambda)
- Google Cloud Run
- Azure App Service

## Monitoring

Consider adding:
- Application Performance Monitoring (APM)
- Error tracking (Sentry)
- Logging (Winston, Pino)
- Health checks
- Metrics (Prometheus)

## Contributing

1. Follow TypeScript best practices
2. Add JSDoc comments for complex functions
3. Update Prisma schema for database changes
4. Test endpoints before committing
5. Follow existing code style

## License

MIT

## Support

For issues or questions, please refer to the main repository documentation or open an issue.

---

**Note:** This server implements the API specification defined in `/BACKEND_API_DOCUMENTATION.md`. Please refer to that document for detailed endpoint specifications and examples.
