# Prisma ORM

If you chose Prisma, your project is pre-configured with a modern, type-safe database layer.

## Setup

The generated project includes:
-   `prisma/schema.prisma`: Your database schema.
-   `prisma/seed.ts`: A script to seed your database.
-   `src/config/database.ts`: A singleton Prisma Client instance.

## Common Commands

### Generate Client
```bash
npx prisma generate
```

### Migration
```bash
npx prisma migrate dev --name init
```

### Studio
```bash
npx prisma studio
```

## Singleton Pattern

We use a singleton pattern in `src/config/database.ts` to prevent exhausting database connections during development due to hot-reloading.

```typescript
import { PrismaClient } from '@prisma/client';
// ... singleton logic ...
export const prisma = ...
```
