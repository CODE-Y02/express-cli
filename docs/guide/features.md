---
title: Core Features | Create Express Forge
description: Explore the production-ready features of Create Express Forge, including JWT Auth, Prisma integration, and automated OpenAPI documentation.
---

# Core Features

Create Express Forge comes packed with everything you need to build robust APIs.

## 🛡️ TypeScript First
Type safety is at the core of Create Express Forge. Every scaffolded project includes:
- Strict TypeScript configuration.
- Path aliases (e.g., `@/config/env`).
- Type-safe environment variables via **Zod**.
- Automated scaffolding with your choice of **npm**, **pnpm**, **yarn**, or **bun**.

## 🔐 Flexible Authentication
Scaffold a complete authentication system with a single choice:
- **JWT Authentication**: Choose between **HttpOnly Cookies** (recommended for web) or **Bearer Headers** (recommended for mobile/API clients).
- **Session Auth**: Battle-tested session management for stateful applications.
- **Protected Routes**: Every boilerplate includes a protected resource showing you exactly how to use the auth middleware.

## 💾 Database Integration
Choose your favorite ORM and get started instantly:
- **Prisma**: Modern ORM with auto-generated client and type-safe queries.
- **Sequelize**: The most popular traditional ORM for Node.js.
- **Migrations**: Pre-configured scripts to handle database schema changes.

## 🧪 Testing Suite
Don't ship broken code. Create Express Forge sets up a complete testing environment:
- **Vitest/Jest**: Choose your favorite test runner.
- **Supertest**: For high-level API integration tests.
- **Example Tests**: Every scaffolded project includes example unit and integration tests.

## 🐳 Docker Support
Ship to production with confidence:
- **Multi-stage Build**: Optimized Dockerfiles for smaller production images.
- **Docker Compose**: Includes a `docker-compose.yml` with a database setup for local development.

## 🔐 Security Best Practices
Stay secure by default with pre-configured industry standards:
- **Helmet**: Automatically sets security-related HTTP headers to protect against common vulnerabilities.
- **CORS**: Flexible Cross-Origin Resource Sharing configuration.
- **Rate Limiting**: Integrated `express-rate-limit` to prevent brute-force attacks and DDoS.
- **Dotenv & Zod**: Every environment variable is validated on startup. If a variable is missing or malformed, the app fails fast with a clear error message.

## 📝 Logging & Monitoring
- **Pino/Winston**: High-performance, structured logging. Pino is used by default for its extreme speed and JSON output, which is perfect for log aggregators like ELK or Datadog.
- **Pro Fail-Fast**: In production, the app strictly validates database and Redis connections on startup. If a dependency is down, the app fails early to prevent inconsistent states. In development, it provides clear warnings.
- **Health Checks**: A standard `/api/v1/health` endpoint is included, providing uptime, memory usage, and database connectivity status.

## 📜 OpenAPI Documentation
Never let your documentation get out of sync:
- **Swagger UI / Scalar**: Beautiful, integrated UI to explore and test your API endpoints directly from the browser.
- **Zero-JSDoc Spec**: Documentation is generated directly from your **Zod schemas** and a centralized registry. No more clunky JSDoc comments in your controllers!
- **Type-Safe Documentation**: Your runtime validation and your API documentation are always 100% in sync.

## ⚡ Modern Tooling
- **Biome**: Replaces ESLint and Prettier for 20x faster linting and formatting.
- **Import Aliases**: Pre-configured `@/` paths for clean, absolute imports.
- **ESM Native**: Built from the ground up for modern Node.js and ECMAScript Modules.

## 🧱 Graceful Shutdown
Every Create Express Forge project handles `SIGTERM` and `SIGINT` signals correctly. This ensures that:
1. No new requests are accepted.
2. Existing requests are finished.
3. Database connections are closed cleanly.
4. The process exits without data corruption.

## 🛠️ Error Handling & Responses
Create Express Forge enforces a consistent communication pattern between your API and clients.

### Centralized Error Handling
A global error middleware is the "safety net" for your application. It catches all errors and transforms them into structured JSON responses, handling `Zod` validation errors and custom `ApiError` instances automatically.

### Custom `ApiError` Class
Stop throwing generic strings. Use the built-in `ApiError` class to provide context, status codes, and operational flags:
- `ApiError.notFound('User not found')`
- `ApiError.unauthorized()`
- `ApiError.badRequest('Invalid input', validationErrors)`

### Standardized `ApiResponse`
Ensure your frontend team always knows what to expect. Every success response follows a predictable schema:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Async Error Wrapper
The provided `asyncHandler` utility eliminates the need for `try-catch` blocks in your controllers, automatically forwarding any promise rejections to the global error handler.

## 🆚 Comparison: v4 vs v3

| Feature | v3.x (Legacy) | v4.x (Latest) |
| :--- | :--- | :--- |
| **OpenAPI Docs** | JSDoc-based (`swagger-jsdoc`) | **Zero-JSDoc** (via Zod schemas) |
| **Linting & Formatting** | ESLint + Prettier | **Biome** (20x faster) |
| **Path Aliases** | Not supported by default | **Native Support** (`@/` aliases) |
| **CLI Flexibility** | Only new directories | **Scaffold in `.`** supported |
| **Scaffolding Speed** | Standard | **Ultra-Fast** (Refactored logic) |
| **Reliability** | Standard startup | **Pro Fail-Fast** (DB/Redis checks) |
| **Imports** | Relative only (`../../`) | **Automated Alias resolution** |
| **Architecture** | Basic Modular/MVC | **Hardened Structures** |
| **Deployment** | Basic Dockerfiles | **Optimized Multi-stage builds** |
