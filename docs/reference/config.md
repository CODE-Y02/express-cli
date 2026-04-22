# Configuration Reference

Every project created with Express Forge uses a centralized configuration system powered by environment variables.

## 🌍 Environment Variables

Create a `.env` file in the root of your project.

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | The port the server listens on | `3000` | No |
| `NODE_ENV` | `development`, `production`, `test` | `development` | No |
| `DATABASE_URL` | Connection string for your DB | - | Yes* |
| `LOG_LEVEL` | `fatal`, `error`, `warn`, `info`, `debug`, `trace` | `debug` | No |
| `CORS_ORIGIN` | Allowed origins (comma separated) | `*` | No |
| `RATE_LIMIT_MAX` | Max requests per window | `100` | No |
| `RATE_LIMIT_WINDOW` | Window size in minutes | `15` | No |

*\*Required if an ORM is selected.*

## ⚙️ App Configuration

Configuration is managed in `src/config/index.ts`. This file:
1. Validates environment variables using **Zod**.
2. Exports a typed configuration object.
3. Provides default values for optional variables.

## 💾 Database Config

If you chose Prisma, your configuration is primarily in `prisma/schema.prisma`. 

For Sequelize, configuration is found in `src/config/database.ts`, which handles the connection pooling and dialect-specific settings.

## 📝 Logger Config

Logging configuration is found in `src/config/logger.ts`. You can toggle between `pretty-print` (for development) and `JSON` (for production) logging here.
