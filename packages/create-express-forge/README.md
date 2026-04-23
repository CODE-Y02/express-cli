# create-express-forge

> ⚡ Scaffold production-ready Express.js TypeScript backends in seconds

## Usage

```bash
npx create-express-forge my-api
npm create express-forge my-api
npx cef my-api          # short alias
```

## Features

- **🚀 Multiple Architectures**: Modular (feature-based) or MVC patterns.
- **🔐 Flexible Auth**: JWT authentication with selectable storage (**HttpOnly Cookies** or **Headers**).
- **📦 Package Manager Choice**: Support for **npm**, **pnpm**, **yarn**, and **bun**.
- **📜 OpenAPI Documentation**: Automated Swagger generation with an optional UI and security integration.
- **🪵 Advanced Logging**: Choice of Winston or Pino with pre-configured transports.
- **⚡ Fast Scaffolding**: Use the `-y, --yes` flag to scaffold instantly with recommended defaults.
- **🐳 Docker Ready**: Optional Docker and docker-compose configuration.
- **✅ Type-Safe**: Centralized environment validation using **Zod**.

## Quick Start

```bash
npx create-express-forge@latest [project-name]
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
