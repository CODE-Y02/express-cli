# Prisma ORM

When you select **Prisma** as your ORM, the CLI generates a complete Prisma setup.

## What Gets Generated

### `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // or mysql, sqlite
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@map("users")
}

enum Role {
  USER
  ADMIN
}
```

### `src/config/database.ts` — Singleton Client

```ts
import { PrismaClient } from '@prisma/client';

// Prevents hot-reload from creating multiple connections
declare global { var __prisma: PrismaClient | undefined; }

export const prisma =
  globalThis.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'warn', 'error']
      : ['error'],
  });

if (process.env.NODE_ENV !== 'production')
  globalThis.__prisma = prisma;
```

### `prisma/seed.ts`

Pre-configured seed file — just add your data.

## Scripts

```bash
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Create + apply migration
npm run db:push      # Push schema (no migration file)
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Run seed script
```

## Using in Services

```ts
import { prisma } from '../config/database.js';

export const UserService = {
  findAll: () => prisma.user.findMany(),
  findById: (id: string) => prisma.user.findUnique({ where: { id } }),
  create: (data: CreateUserDto) => prisma.user.create({ data }),
};
```
