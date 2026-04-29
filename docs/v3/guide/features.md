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
- **Health Checks**: A standard `/health` endpoint is included, providing uptime, memory usage, and database connectivity status.

## 📜 OpenAPI Documentation
Never let your documentation get out of sync:
- **Swagger UI**: Integrated UI to explore and test your API endpoints directly from the browser.
- **Auto-generated Spec**: The CLI generates a `docs.json` endpoint that is always up-to-date with your code's JSDoc annotations.
- **Security Schemas**: Pre-configured security definitions for your chosen auth strategy (Cookie or Bearer).

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
