# Project Structure

Express Forge scaffolds a clean, professional directory structure. Depending on your chosen architecture, the structure will vary slightly.

## 📦 Modular Architecture

This structure is organized by **features**. Each module is self-contained.

```text
.
├── src/
│   ├── modules/          # Feature modules
│   │   └── users/        # Example module
│   │       ├── users.controller.ts
│   │       ├── users.service.ts
│   │       ├── users.routes.ts
│   │       └── users.schema.ts
│   ├── shared/           # Code shared across modules
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── constants/
│   ├── config/           # App configuration
│   └── app.ts            # App initialization
├── prisma/               # Database schema (if Prisma chosen)
├── tests/                # Integration and unit tests
├── .env                  # Environment variables
└── package.json
```

## 🏛 MVC Architecture

A traditional technical-layer separation.

```text
.
├── src/
│   ├── controllers/      # Route handlers
│   ├── models/           # Data models
│   ├── services/         # Business logic
│   ├── routes/           # Route definitions
│   ├── middleware/       # Global middleware
│   ├── config/
│   └── app.ts
├── ...
```

## Key Files

- **`src/app.ts`**: The entry point where Express is initialized, middleware is registered, and routes are attached.
- **`src/config/`**: Contains configuration for the database, logger, and environment variables.
- **`prisma/schema.prisma`**: (Optional) Defines your database models and relationships.
- **`docker-compose.yml`**: Defines the local development environment (e.g., PostgreSQL/MySQL containers).
