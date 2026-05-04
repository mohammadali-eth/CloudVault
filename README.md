# Cloud Vault

A modern enterprise-grade cloud storage and collaboration platform.

## Tech Stack

- **Frontend**: Next.js (App Router) + Tailwind CSS 4 + shadcn/ui
- **Backend**: NestJS
- **Database**: PostgreSQL with Prisma ORM

## Project Structure

```
cloud-vault/
├── backend/            # NestJS Backend
│   ├── prisma/         # Prisma schema and migrations
│   └── src/            # Application source code
└── frontend/           # Next.js Frontend
    ├── src/app/        # App Router pages
    ├── src/components/ # UI components
    └── src/lib/        # Utilities and API helpers
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL instance

### Backend Setup

1. `cd backend`
2. `npm install`
3. Configure `.env` with your `DATABASE_URL`
4. `npx prisma migrate dev`
5. `npm run start:dev`

### Frontend Setup

1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Scripts

- **Backend**: `npm run start:dev` (runs on http://localhost:4000)
- **Frontend**: `npm run dev` (runs on http://localhost:3000)
