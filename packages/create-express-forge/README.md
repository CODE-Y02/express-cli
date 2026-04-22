# create-express-forge

> ⚡ Scaffold production-ready Express.js TypeScript backends in seconds

## Usage

```bash
npx create-express-forge my-api
npm create express-forge my-api
npx cef my-api          # short alias
```

## Options

| Prompt | Choices |
|--------|---------|
| Architecture | `modular` · `mvc` |
| ORM | `prisma` · `sequelize` · `none` |
| Database | `postgresql` · `mysql` · `sqlite` · `none` |
| Logger | `winston` · `pino` · `none` |
| Testing | `vitest` · `jest` · `none` |
| Docker | yes / no |

## What's included in every generated project

- TypeScript + tsx dev server
- Zod env validation (startup-time fail-fast)
- Global centralized error handler (`ApiError`, `ZodError`, unknown)
- Request validation middleware
- `ApiError` — `.notFound()`, `.unauthorized()`, `.conflict()`, etc.
- `ApiResponse` — `.success()`, `.created()`, `.paginated()`, `.noContent()`
- `asyncHandler` — no try/catch in route handlers
- Helmet + CORS + compression + rate limiter
- Graceful shutdown (SIGTERM/SIGINT)

## License

MIT
