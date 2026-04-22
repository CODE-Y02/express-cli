# Core Features

Express Forge comes packed with everything you need to build robust APIs.

## 🛡️ TypeScript First
Type safety is at the core of Express Forge. Every scaffolded project includes:
- Strict TypeScript configuration.
- Path aliases (e.g., `@modules/users`).
- Type-safe environment variables.
- Zod integration for request validation.

## 💾 Database Integration
Choose your favorite ORM and get started instantly:
- **Prisma**: Modern ORM with auto-generated client and type-safe queries.
- **Sequelize**: The most popular traditional ORM for Node.js.
- **Migrations**: Pre-configured scripts to handle database schema changes.

## 🧪 Testing Suite
Don't ship broken code. Express Forge sets up a complete testing environment:
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

## 🧱 Graceful Shutdown
Every Express Forge project handles `SIGTERM` and `SIGINT` signals correctly. This ensures that:
1. No new requests are accepted.
2. Existing requests are finished.
3. Database connections are closed cleanly.
4. The process exits without data corruption.
