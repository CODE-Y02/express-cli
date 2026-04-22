# Getting Started

## Quick Start

```bash
npx create-express-forge my-api
```

Or with the shorthand:

```bash
npx cef my-api
```

You'll be guided through interactive prompts to select your stack.

## Requirements

- **Node.js** >= 18
- **npm** or **pnpm**

## Interactive Prompts

The CLI asks you to choose:

```
? Architecture pattern: ›
  📦  Modular  — feature-based modules (recommended)
  🏗️  MVC     — Model / View / Controller

? ORM / Database layer: ›
  🔷  Prisma      (type-safe, modern — recommended)
  🔶  Sequelize   (battle-tested)
  ⬜  None

? Database: ›
  🐘  PostgreSQL
  🐬  MySQL
  🪶  SQLite

? Logger: ›
  🪵  Winston   (feature-rich, transport-based)
  ⚡  Pino      (ultra-fast, low-overhead)
  ⬜  None

? Testing framework: ›
  ⚡  Vitest   (fast, ESM-native — recommended)
  🃏  Jest     (widely-used)
  ⬜  None

? Add Docker + docker-compose? › Yes
? Install dependencies now? › Yes
```

## After Scaffolding

```bash
cd my-api
cp .env.example .env
npm run dev
```

Your API is running at `http://localhost:3000` with:

- `GET /api/health` — Health check
- `GET /api/v1/users` — List users
- `POST /api/v1/users` — Create user (with Zod validation)
- `PATCH /api/v1/users/:id` — Update user
- `DELETE /api/v1/users/:id` — Delete user

## Available Scripts

```bash
npm run dev          # Start dev server with hot-reload (tsx)
npm run build        # Build for production (tsup)
npm start            # Run production build
npm run check-types  # TypeScript type check
npm run test         # Run tests
```

### If you chose Prisma:

```bash
npm run db:migrate   # Create + run migration
npm run db:push      # Push schema to DB (no migration)
npm run db:generate  # Regenerate Prisma client
npm run db:studio    # Open Prisma Studio GUI
npm run db:seed      # Run seed script
```
