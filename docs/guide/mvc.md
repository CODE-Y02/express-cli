# MVC Architecture

The **MVC** pattern separates concerns by type — controllers, services, routes, schemas in their own directories.

## Generated Structure

```
src/
├── config/env.ts
├── controllers/
│   ├── health.controller.ts
│   └── user.controller.ts
├── services/
│   └── user.service.ts
├── schemas/
│   └── user.schema.ts
├── routes/
│   ├── index.ts              ← Central router
│   ├── health.routes.ts
│   └── user.routes.ts
├── middleware/
│   ├── errorHandler.ts
│   ├── validate.ts
│   ├── notFound.ts
│   └── rateLimiter.ts
├── utils/
│   ├── ApiError.ts
│   ├── ApiResponse.ts
│   └── asyncHandler.ts
├── app.ts
└── server.ts
```

## Adding a New Resource

1. Create `src/schemas/product.schema.ts`
2. Create `src/services/product.service.ts`
3. Create `src/controllers/product.controller.ts`
4. Create `src/routes/product.routes.ts`
5. Register in `src/routes/index.ts`:

```ts
import { productRouter } from './product.routes.js';
router.use('/products', productRouter);
```

## Route Registration

MVC uses a central router in `src/routes/index.ts`:

```ts
const router = Router();
router.use('/health', healthRouter);
router.use('/users', userRouter);
router.use('/products', productRouter);
export { router };
```

Which is mounted in `app.ts`:

```ts
app.use('/api/v1', router);
```
