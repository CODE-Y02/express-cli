# create-express-forge

> ⚡ Scaffold production-ready Express.js TypeScript backends in seconds

[![npm version](https://img.shields.io/npm/v/create-express-forge.svg)](https://www.npmjs.com/package/create-express-forge)
[![CI](https://github.com/CODE-Y02/create-express-forge/actions/workflows/ci.yml/badge.svg)](https://github.com/CODE-Y02/create-express-forge/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Quick Start

```bash
npx create-express-forge my-api
# or
npm create express-forge my-api
# or (short alias)
npx cef my-api
```

## What You Get

Interactive prompts let you choose:

| Option | Choices |
|--------|---------|
| **Architecture** | Modular (feature-based) · MVC |
| **ORM** | Prisma · Sequelize · None |
| **Database** | PostgreSQL · MySQL · SQLite · None |
| **Logger** | Winston · Pino · None |
| **Testing** | Vitest · Jest · None |
| **Docker** | Dockerfile + docker-compose |

## Generated Project Includes

- ✅ **TypeScript** + `tsx` hot-reload dev server
- ✅ **Zod** env validation on startup — fails fast on bad config
- ✅ **Global centralized error handler** — `ApiError`, `ZodError`, unknown errors all handled
- ✅ **Request validation middleware** via `validate(schema)`
- ✅ **`ApiError`** — custom class with static factories (`.notFound()`, `.unauthorized()`, etc.)
- ✅ **`ApiResponse`** — consistent JSON response helpers
- ✅ **`asyncHandler`** — wraps async routes, no try/catch needed
- ✅ **Helmet + CORS + compression + rate limiter**
- ✅ **Graceful shutdown** (SIGTERM / SIGINT)
- ✅ **Multi-stage Dockerfile** with healthcheck
- ✅ **docker-compose** with correct DB service

## Repository Structure

```
create-express-forge/
├── packages/
│   ├── create-express-forge/   ← The published CLI
│   ├── typescript-config/      ← Shared internal TS config
│   └── eslint-config/          ← Shared internal ESLint config
├── examples/
│   └── modular-postgres-prisma/ ← Pre-generated example
└── .github/workflows/           ← CI + Release
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Versioning & Branches

| Branch | npm tag | Description |
|--------|---------|-------------|
| `main` | `latest` | Stable releases |
| `next` | `next` | Pre-releases / beta |

## License

MIT © [Yatharth Lakhate](https://github.com/CODE-Y02)
