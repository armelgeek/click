# Development Guide

This guide will help you set up a complete local development environment for ClickNVape.

## Prerequisites

- Node.js >= 18.x
- PostgreSQL >= 14.x (or Docker)
- npm, yarn, or bun
- Git

## Setup Methods

### Method 1: Docker Compose (Recommended)

The easiest way to get started with the complete stack:

```bash
# Clone the repository
git clone https://github.com/armelgeek/click.git
cd click

# Start backend and database
docker-compose up -d

# Install frontend dependencies
npm install

# Start frontend development server
npm run dev
```

This starts:
- PostgreSQL database on port 5432
- Backend API on port 3000
- Frontend on port 5173 (manual start)

### Method 2: Manual Setup

#### 1. Clone Repository

```bash
git clone https://github.com/armelgeek/click.git
cd click
```

#### 2. Setup Backend

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
npm run prisma:migrate

# Seed database with test data
npm run prisma:seed

# Start backend server
npm run dev
```

Backend should now be running on `http://localhost:3000`

#### 3. Setup Frontend

In a new terminal:

```bash
# Navigate to project root
cd ..

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# Edit .env if needed (default should work)

# Start frontend development server
npm run dev
```

Frontend should now be running on `http://localhost:5173`

## Environment Configuration

### Backend (.env)

Located in `server/.env`:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:password@localhost:5432/clicknvape?schema=public"
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

Located in root `.env`:

```env
VITE_APP_MODE=development
VITE_APP_SERVER_URL=http://localhost:3000
```

## Database Management

### View Database Records

```bash
cd server
npm run prisma:studio
```

Opens Prisma Studio at `http://localhost:5555`

### Reset Database

⚠️ This deletes all data!

```bash
cd server
npx prisma migrate reset
```

### Create Migration

After changing `prisma/schema.prisma`:

```bash
cd server
npm run prisma:migrate
```

## Testing

### Test Backend API

```bash
# Health check
curl http://localhost:3000/health

# Get addresses (requires JWT token)
curl -X GET http://localhost:3000/users/addresses \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### Test Frontend

Open `http://localhost:5173` in your browser and:

1. Browse products
2. Add items to cart
3. Proceed to checkout
4. Complete an order
5. View order history
6. Track delivery

## Development Workflow

### Frontend Development

```bash
# Start dev server
npm run dev

# Lint code
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Development

```bash
cd server

# Start dev server with hot reload
npm run dev

# Lint code
npm run lint

# Format code
npm run format

# Build TypeScript
npm run build

# Start production server
npm start
```

## Code Structure

### Frontend

```
src/
├── app/               # Feature modules
│   ├── cart/
│   ├── checkout/
│   ├── delivery/
│   ├── orders/
│   └── ...
├── components/        # Reusable UI components
├── pages/            # Route pages
├── shared/           # Shared utilities
└── routes/           # Route definitions
```

### Backend

```
server/
├── src/
│   ├── controllers/  # Request handlers
│   ├── routes/       # API routes
│   ├── middleware/   # Express middleware
│   ├── config/       # Configuration
│   └── index.ts      # Entry point
└── prisma/
    ├── schema.prisma # Database schema
    └── seed.ts       # Seed data
```

## Common Tasks

### Add a New API Endpoint

1. Create controller in `server/src/controllers/`
2. Add route in `server/src/routes/`
3. Register route in `server/src/app.ts`
4. Update types in `src/shared/types/api.types.ts`
5. Create API client in frontend

### Add a Database Model

1. Edit `server/prisma/schema.prisma`
2. Run `npm run prisma:migrate`
3. Update seed script if needed
4. Update controllers to use new model

### Create a New Page

1. Create component in `src/pages/`
2. Add route in `src/routes/index.tsx`
3. Create feature module in `src/app/` if needed
4. Add navigation links

## Debugging

### Backend Debugging

The server logs all database queries in development mode. Check the console for:
- API requests
- Database queries
- Errors and stack traces

### Frontend Debugging

- React Query DevTools are enabled in development
- Check browser console for errors
- Use React DevTools extension

## IDE Setup

### VS Code Extensions

Recommended extensions:
- ESLint
- Prettier
- Prisma
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- GitLens

### VS Code Settings

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: add your feature"

# Push to remote
git push origin feature/your-feature

# Create pull request on GitHub
```

## Troubleshooting

### Port Already in Use

Change ports in environment files:
- Backend: Edit `PORT` in `server/.env`
- Frontend: Add `--port 5174` to dev script

### Database Connection Failed

1. Ensure PostgreSQL is running
2. Check `DATABASE_URL` in `server/.env`
3. Verify credentials and database exists

### Frontend Can't Connect to Backend

1. Check backend is running on port 3000
2. Verify `VITE_APP_SERVER_URL` in `.env`
3. Check browser console for CORS errors

### TypeScript Errors

```bash
# Frontend
npm run build

# Backend
cd server
npm run build
```

## Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Express Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## Getting Help

- Check existing documentation
- Review [BACKEND_API_DOCUMENTATION.md](./BACKEND_API_DOCUMENTATION.md)
- Look at similar implementations in the codebase
- Open an issue on GitHub

---

Happy coding! 🚀
