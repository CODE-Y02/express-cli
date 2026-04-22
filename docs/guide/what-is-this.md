# What is create-express-forge?

**create-express-forge** is a CLI tool that scaffolds production-ready Express.js + TypeScript backends with a single command.

## Why?

Starting a new Express project usually means:

1. Setting up TypeScript config manually
2. Writing boilerplate middleware
3. Creating a project structure from scratch
4. Configuring error handling, validation, logging
5. Setting up Docker, testing, ORM...

**create-express-forge** does all of this in ~30 seconds with interactive prompts.

## What's Included in Every Project

Every generated project comes with these built-in — no extra config:

| Feature | Description |
|---------|-------------|
| **TypeScript** | Strict mode, NodeNext modules, `tsx` dev server |
| **Zod env validation** | Fails fast on startup if env vars are invalid |
| **Global error handler** | Handles `ApiError`, `ZodError`, and unknown errors |
| **Request validation** | `validate(schema)` middleware for any route |
| **ApiError class** | `.notFound()`, `.unauthorized()`, `.conflict()`, etc. |
| **ApiResponse helpers** | `.success()`, `.created()`, `.paginated()`, `.noContent()` |
| **asyncHandler** | Wraps async routes — no try/catch needed |
| **Security** | Helmet + CORS + compression + rate limiter |
| **Graceful shutdown** | SIGTERM / SIGINT handlers |

## Optional Features

Selected via interactive prompts:

- **Architecture**: Modular (feature-based) or MVC
- **ORM**: Prisma or Sequelize
- **Database**: PostgreSQL, MySQL, or SQLite
- **Logger**: Winston or Pino
- **Testing**: Vitest or Jest (with Supertest)
- **Docker**: Multi-stage Dockerfile + docker-compose with DB service
