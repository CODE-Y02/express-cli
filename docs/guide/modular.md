# Modular Architecture

The **Modular** (feature-based) pattern groups all files for a feature together. This is the recommended pattern for most projects.

## Generated Structure

```
src/
├── config/
│   └── env.ts                  ← Zod-validated environment
├── middleware/
│   ├── errorHandler.ts         ← Global centralized error handler
│   ├── validate.ts             ← Zod request validation
│   ├── notFound.ts             ← 404 handler
│   └── rateLimiter.ts          ← Rate limiting
├── modules/
│   ├── health/
│   │   ├── health.controller.ts
│   │   └── health.routes.ts
│   └── users/
│       ├── users.schema.ts     ← Zod schemas + DTO types
│       ├── users.service.ts    ← Business logic
│       ├── users.controller.ts ← Route handlers
│       └── users.routes.ts     ← Express router
├── utils/
│   ├── ApiError.ts
│   ├── ApiResponse.ts
│   └── asyncHandler.ts
├── types/
│   └── express.d.ts
├── app.ts                      ← Express app setup
└── server.ts                   ← Server + graceful shutdown
```

## Adding a New Module

Create a new folder in `src/modules/`:

```bash
mkdir src/modules/products
```

Create these files following the same pattern as `users`:

1. **`products.schema.ts`** — Zod validation schemas
2. **`products.service.ts`** — Business logic (DB calls)
3. **`products.controller.ts`** — Route handlers using `asyncHandler`
4. **`products.routes.ts`** — Express router

Then register the router in `app.ts`:

```ts
import { productsRouter } from './modules/products/products.routes.js';
app.use('/api/v1/products', productsRouter);
```

## Route Registration

Routes are registered directly in `app.ts`:

```ts
app.use('/api/health', healthRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/products', productsRouter); // add new modules here
```
