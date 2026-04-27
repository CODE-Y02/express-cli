# Changelog

## 4.1.0

### Minor Changes

- 3f3aa68: fix linting issues with package

## 4.0.0

### Major Changes

- d617dbf: ### 🚀 Core CLI & Codebase Modernization
- d617dbf: ### 🚀 Core CLI & Codebase Modernization- **Unified Tooling**: Migrated the entire monorepo to **Biome 2.4**, achieving sub-100ms linting and formatting.- **Generator Refactor**: Re-architected the generator logic into modular, testable components (Base, Structure, Features).- **Pro Testing Suite**: - Separated internal logic tests (`main.test.ts`) from CLI E2E tests (`smoke.integration.test.ts`). - Disabled test caching in Turborepo to ensure 100% reliable smoke runs.- **Modern Templates**: - Updated to **Express 5** (native async error handling) and **Prisma 6**. - Implemented professional **multi-stage Docker builds** (Node 20 Alpine). - Integrated **Biome** as the default linter/formatter for all generated projects.- **Production Hardening**: Added graceful shutdown handlers (SIGTERM/SIGINT) and fail-fast database connection checks on startup.- **Infrastructure**: Renamed and modernized shared monorepo configs (`@repo/lint-config`).

## 3.3.2

### Patch Changes

- 1bf6660: Removed CEF package alias as its not avaialbe

## 3.3.0

### Minor Changes

- b089069: - Added comprehensive CLI flags for scaffolding (--pattern, --orm, --db, --logger, --test, --docker, --install).
  - Added 'cef' short alias package for easier npx usage.
  - Improved Prisma singleton and environment validation.
  - Enhanced README and Documentation for AI-readiness and SEO.

## 3.2.0

### Minor Changes

- 930d25c: CLI improvements and refactoring for production readiness.

## 3.1.0

### Minor Changes

- 1910f89: Fix inconsistency issues and improve template generation.

## 3.0.0

### Major Changes

- e1e588f: ## Added

  - Support for multiple package managers (npm, pnpm, yarn, bun).
  - JWT authentication with HttpOnly Cookie and Header options.
  - Swagger UI integration for interactive API documentation.

  ## Fixed

  - Minor fixes and improvements in the CLI scaffolding process.
  - Support for multiple package managers (npm, pnpm, yarn, bun).
  - JWT authentication with HttpOnly Cookie and Header options.
  - Swagger UI integration for interactive API documentation.

  ## Fixed

  - Minor fixes and improvements in the CLI scaffolding process.

## 2.0.0

### Major Changes

- 3b31da8: v2

## 1.0.0

### Major Changes

- cfe08be: fix: resolve initial build and linting issues

### Minor Changes

- 5081374: Patch for prisma

## 0.1.0

### Minor Changes

- Initial release
- Interactive CLI with Inquirer
- Modular and MVC architecture patterns
- Prisma and Sequelize ORM support
- Winston and Pino logger support
- Vitest and Jest testing support
- Docker + docker-compose generation
- Global centralized error handler
- Zod env validation
