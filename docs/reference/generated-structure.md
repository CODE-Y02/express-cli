# Generated Project Structure

## Modular Pattern (Full Stack)

With Prisma + Winston + Vitest + Docker:

```
my-api/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── config/
│   │   ├── env.ts              ← Zod env validation
│   │   └── database.ts         ← Prisma singleton
│   ├── middleware/
│   │   ├── errorHandler.ts     ← Global error handler
│   │   ├── validate.ts         ← Zod request validation
│   │   ├── notFound.ts         ← 404 handler
│   │   └── rateLimiter.ts      ← Rate limiting
│   ├── modules/
│   │   ├── health/
│   │   │   ├── health.controller.ts
│   │   │   └── health.routes.ts
│   │   └── users/
│   │       ├── users.schema.ts
│   │       ├── users.service.ts
│   │       ├── users.controller.ts
│   │       └── users.routes.ts
│   ├── utils/
│   │   ├── ApiError.ts
│   │   ├── ApiResponse.ts
│   │   └── asyncHandler.ts
│   ├── logger/
│   │   └── index.ts
│   ├── __tests__/
│   │   └── health.test.ts
│   ├── types/
│   │   └── express.d.ts
│   ├── app.ts
│   └── server.ts
├── Dockerfile
├── .dockerignore
├── docker-compose.yml
├── .env
├── .env.example
├── .gitignore
├── tsconfig.json
├── vitest.config.ts
├── package.json
└── README.md
```

## MVC Pattern (Full Stack)

```
my-api/
├── src/
│   ├── config/
│   ├── controllers/
│   │   ├── health.controller.ts
│   │   └── user.controller.ts
│   ├── services/
│   │   └── user.service.ts
│   ├── schemas/
│   │   └── user.schema.ts
│   ├── routes/
│   │   ├── index.ts
│   │   ├── health.routes.ts
│   │   └── user.routes.ts
│   ├── middleware/
│   ├── utils/
│   ├── app.ts
│   └── server.ts
└── ...
```

## Minimal (No Extras)

With ORM=none, logger=none, testing=none, docker=no:

```
my-api/
├── src/
│   ├── config/env.ts
│   ├── middleware/
│   ├── modules/ (or controllers/ + routes/)
│   ├── utils/
│   ├── types/
│   ├── app.ts
│   └── server.ts
├── .env
├── .env.example
├── .gitignore
├── tsconfig.json
├── package.json
└── README.md
```
