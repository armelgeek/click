import express, { Express } from 'express';
import cors from 'cors';
import { config } from './config';
import { errorHandler, notFound } from './middleware/error';

// Import routes
import addressesRoutes from './routes/addresses.routes';
import paymentMethodsRoutes from './routes/payment-methods.routes';
import paymentRoutes from './routes/payment.routes';
import ordersRoutes from './routes/orders.routes';
import deliveryRoutes from './routes/delivery.routes';

const app: Express = express();

// Middleware
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/users/addresses', addressesRoutes);
app.use('/users/payment-methods', paymentMethodsRoutes);
app.use('/payment', paymentRoutes);
app.use('/orders', ordersRoutes);
app.use('/delivery', deliveryRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
