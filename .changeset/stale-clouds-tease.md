---
"create-express-forge": patch
---

- **Zod-to-OpenAPI Integration**: Implemented automated, DRY documentation using `@asteasolutions/zod-to-openapi`. Removed all clunky `@openapi` JSDoc comments from route files in favor of pure TypeScript path registration.
- **Unified API Paths**: Standardized all routes and health checks under `/api/v1/` prefix.
- **Improved DX**: Added automatic logging of the API Documentation URL on server startup.
- **Biome 2.4 Integration**: Migrated the monorepo and generated templates to Biome for 20x faster linting and formatting. Templates now pin `@biomejs/biome@2.4.13` for consistent DX across environments.
- **"Pro" Fail-Fast Logic**: Implemented strict connection checks for DB/Redis in production with warnings in development.
- **Template Hardening**: Fixed multiple linting errors in generated templates (auth controllers, ApiResponse, and middleware).
- **Docker Fix**: Resolved `depends_on` formatting and removed obsolete version tags in `docker-compose.yml`.
- **Smoke Test Hardening**: Added mandatory linting checks to the generator test suite.
