# ⚡️ create-express-forge

### The ultimate Express.js + TypeScript Backend Generator.
**Build production-ready Node.js APIs in seconds, not hours.**

`create-express-forge` is a powerful CLI tool that scaffolds a high-performance **Express TypeScript backend** with best practices out of the box. Whether you need a simple REST API or a complex enterprise system, this generator handles the boilerplate for you.

[![npm version](https://img.shields.io/npm/v/create-express-forge.svg)](https://www.npmjs.com/package/create-express-forge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 Why use Express Forge?
Searching for an **Express TypeScript starter**? Most boilerplates are either too bloated or too empty. Express Forge gives you a modular, configurable, and type-safe foundation using the tools you already love.

## 🚀 Quick Start
Create your new project instantly:
```bash
npx create-express-forge@latest my-api
```

---

## 🔥 Key Features
- **🏗️ Smart Architectures**: Choose between **Modular (feature-based)** or **MVC** patterns.
- **🛡️ Type-Safe by Default**: Fully configured **TypeScript** with **Zod** for environment and request validation.
- **🔐 Professional Auth**: Ready-to-use **JWT Authentication** with **HttpOnly Cookies** or **Bearer Headers**.
- **🗄️ ORM Flexibility**: Support for **Prisma**, **Sequelize**, or raw drivers.
- **📜 Automated Documentation**: Built-in **OpenAPI / Swagger** support with a live UI.
- **🐳 DevOps Ready**: One-click **Docker** and **docker-compose** setup.
- **🪵 Observability**: High-performance logging with **Pino** or **Winston**.
- **⚡ Performance**: Optimized for fast startup and low overhead.

---

## 🛠️ Advanced Usage
Bypass prompts using CLI flags for automation:
```bash
npx create-express-forge my-api --pattern modular --orm prisma --db postgresql --auth jwt
```

| Flag | Options |
| :--- | :--- |
| `--pattern` | `modular`, `mvc` |
| `--orm` | `prisma`, `sequelize`, `none` |
| `--db` | `postgresql`, `mysql`, `sqlite`, `none` |
| `--logger` | `winston`, `pino`, `none` |
| `--test` | `vitest`, `jest`, `none` |
| `--docker` | `true`, `false` |
| `--install` | `true`, `false` |
```

Or for instant scaffolding:

```bash
npx create-express-forge@latest [project-name] --yes
```

## Development & Testing

### Unit Tests
```bash
pnpm test
```

### Integration (Smoke) Test
Verifies the CLI by scaffolding a full project, type-checking it, and building it.
```bash
pnpm test:smoke
```

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
