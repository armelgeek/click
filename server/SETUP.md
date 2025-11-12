# Backend Setup Guide

This guide will help you set up and run the ClickNVape backend API server.

## Quick Start

### 1. Prerequisites

Make sure you have the following installed:
- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm, yarn, or bun

### 2. Database Setup

#### Option A: Local PostgreSQL

1. Install PostgreSQL on your system
2. Create a new database:
   ```bash
   psql -U postgres
   CREATE DATABASE clicknvape;
   \q
   ```

#### Option B: Docker PostgreSQL

```bash
docker run --name clicknvape-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=clicknvape \
  -p 5432:5432 \
  -d postgres:14
```

#### Option C: Cloud Database

Use a managed PostgreSQL service like:
- [Supabase](https://supabase.com) (Free tier available)
- [Railway](https://railway.app) (Free tier available)
- [Neon](https://neon.tech) (Free tier available)
- Heroku Postgres
- AWS RDS
- Google Cloud SQL

### 3. Backend Installation

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

### 4. Configure Environment

Edit the `.env` file with your settings:

```env
PORT=3000
NODE_ENV=development

# Update with your PostgreSQL connection string
DATABASE_URL="postgresql://postgres:password@localhost:5432/clicknvape?schema=public"

# Generate a random secret (use: openssl rand -base64 32)
JWT_SECRET=your-super-secret-jwt-key-change-this

# For Stripe integration (optional for now)
PAYMENT_GATEWAY_SECRET_KEY=sk_test_...
PAYMENT_GATEWAY_PUBLISHABLE_KEY=pk_test_...

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173

# Session secret
SESSION_SECRET=your-session-secret
```

### 5. Database Migration

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations to create tables
npm run prisma:migrate

# (Optional) Seed database with test data
npm run prisma:seed
```

### 6. Start the Server

Development mode with hot reload:
```bash
npm run dev
```

The server should now be running at `http://localhost:3000`

### 7. Verify Installation

Test the health endpoint:
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Test Credentials

If you ran the seed script, you can use these test credentials:

- **Email:** test@example.com
- **Password:** password123

Note: You'll need to implement authentication endpoints or use the frontend's authentication system to get a JWT token.

## Development Workflow

### View Database

Open Prisma Studio to view and edit database records:
```bash
npm run prisma:studio
```

This opens a web interface at `http://localhost:5555`

### Make Database Changes

1. Edit `prisma/schema.prisma`
2. Create migration:
   ```bash
   npm run prisma:migrate
   ```
3. Name your migration when prompted

### Reset Database

⚠️ Warning: This deletes all data!

```bash
npx prisma migrate reset
```

This will:
1. Drop the database
2. Create a new database
3. Run all migrations
4. Run the seed script

## Testing the API

### Using cURL

```bash
# Get addresses (requires auth token)
curl -X GET http://localhost:3000/users/addresses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"

# Create address
curl -X POST http://localhost:3000/users/addresses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "label": "Home",
    "streetAddress": "123 Main St",
    "city": "Paris",
    "state": "Île-de-France",
    "postalCode": "75001",
    "country": "France"
  }'
```

### Using Postman or Insomnia

1. Import the API collection (if available)
2. Set up environment variables:
   - `BASE_URL`: http://localhost:3000
   - `JWT_TOKEN`: Your authentication token
3. Start testing endpoints

## Common Issues

### Port Already in Use

If port 3000 is already in use, change the `PORT` in `.env`:
```env
PORT=3001
```

### Database Connection Failed

Check your `DATABASE_URL` in `.env`:
- Ensure PostgreSQL is running
- Verify username, password, and database name
- Check if the port is correct (default: 5432)

### Prisma Client Not Found

Run:
```bash
npm run prisma:generate
```

### Migration Errors

Reset and start fresh:
```bash
npx prisma migrate reset
npm run prisma:migrate
```

## Connecting Frontend

Update the frontend `.env` file:

```env
VITE_APP_SERVER_URL=http://localhost:3000
```

The frontend will now use the real backend instead of mock data.

## Production Deployment

See the main [server/README.md](./README.md) for deployment instructions.

## Next Steps

1. ✅ Set up database
2. ✅ Run migrations
3. ✅ Seed test data
4. ✅ Start server
5. 🔄 Integrate with frontend
6. 🔄 Add authentication endpoints
7. 🔄 Set up payment gateway
8. 🔄 Deploy to production

## Support

For issues or questions:
- Check server logs in the console
- Review [server/README.md](./README.md)
- Check the main [BACKEND_API_DOCUMENTATION.md](../BACKEND_API_DOCUMENTATION.md)

---

Happy coding! 🚀
