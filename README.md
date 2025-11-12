# ClickNVape

E-commerce platform for vaping products with a complete backend API.

## Project Structure

This is a monorepo containing:

- **Frontend:** React + Vite application (root directory)
- **Backend:** Express + TypeScript API server (`/server` directory)

## Quick Start

### Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173`

### Backend

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Set up database and environment
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npm run prisma:migrate

# Seed database with test data
npm run prisma:seed

# Start development server
npm run dev
```

API available at `http://localhost:3000`

## Documentation

- [Frontend Documentation](./documentation/README.md)
- [Backend Setup Guide](./server/SETUP.md)
- [Backend API Documentation](./BACKEND_API_DOCUMENTATION.md)
- [Backend README](./server/README.md)

## Features

✅ Complete checkout flow  
✅ Payment processing simulation  
✅ Real-time delivery tracking  
✅ User address management  
✅ Payment methods management  
✅ Order history and statistics  
✅ RESTful API with 27+ endpoints  
✅ PostgreSQL database with Prisma ORM  
✅ JWT authentication  
✅ Docker support  

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Query
- Zustand
- React Router

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Stripe (ready for integration)

## Development

See individual documentation for detailed setup and development instructions.

---

Voir [Documentation](./documentation/README.md)