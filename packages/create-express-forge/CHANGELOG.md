# Changelog

## 4.1.5

### Patch Changes

- 516d219: Updated documentation domain to create-express-forge.js.org and synchronized NPM metadata across all packages. Hardened AI prompts and injected strict v4 guidelines into LLM context files.

## 4.1.4

### Patch Changes

- e7113ba: - Added support for scaffolding in the current directory (`.`)
  - Implemented automated import alias resolution (`@/`) for scaffolded projects
  - Fixed relative import bug in smoke test template
  - Synchronized documentation with latest v4 features (Zod-to-OpenAPI, Biome, Pro Fail-Fast)
  - Added a **High-Fidelity Personalized Welcome** message using a large gradient-styled font (powered by `figlet` and `gradient-string`) to greet users by name
  - Added documentation versioning support with v3 LTS dropdown
  - Enhanced documentation SEO, OpenGraph metadata, and social sharing tags
  - Standardized product naming to "Create Express Forge" across docs and CLI
  - Added a dedicated **MCP Server** (`@create-express-forge/mcp`) for AI-assisted scaffolding and documentation access
  - Automated generation of LLM-friendly documentation files (`llms.txt`, `llms-full.txt`, `ai.json`)
  - Highlighted **Ultra-Fast scaffolding** in the v3 vs v4 comparison (powered by internal refactoring)
  - Updated root and package READMEs with new features and Biome integration
  - Removed deprecated `cef` alias from documentation
  - Fixed file paths in CONTRIBUTING.md
  - Updated v3 documentation and root README to target the correct stable legacy version (`3.3.2`)

## 4.1.3

### Patch Changes

- 28c3e1b: - Added support for scaffolding in the current directory (`.`)
  - Implemented automated import alias resolution (`@/`) for scaffolded projects
  - Fixed relative import bug in smoke test template
  - Synchronized documentation with latest v4 features (Zod-to-OpenAPI, Biome, Pro Fail-Fast)
  - Added a **High-Fidelity Personalized Welcome** message using a large gradient-styled font (powered by `figlet` and `gradient-string`) to greet users by name
  - Added documentation versioning support with v3 LTS dropdown
  - Enhanced documentation SEO, OpenGraph metadata, and social sharing tags
  - Standardized product naming to "Create Express Forge" across docs and CLI
  - Added a dedicated **MCP Server** (`@create-express-forge/mcp`) for AI-assisted scaffolding and documentation access
  - Automated generation of LLM-friendly documentation files (`llms.txt`, `llms-full.txt`, `ai.json`)
  - Highlighted **Ultra-Fast scaffolding** in the v3 vs v4 comparison (powered by internal refactoring)
  - Updated root and package READMEs with new features and Biome integration
  - Removed deprecated `cef` alias from documentation
  - Fixed file paths in CONTRIBUTING.md
  - Updated v3 documentation and root README to target the correct stable legacy version (`3.3.2`)

## 4.1.2

### Patch Changes

- 4ffc258: - **Zod-to-OpenAPI Integration**: Implemented automated, DRY documentation using `@asteasolutions/zod-to-openapi`. Removed all clunky `@openapi` JSDoc comments from route files in favor of pure TypeScript path registration.
  - **Unified API Paths**: Standardized all routes and health checks under `/api/v1/` prefix.
  - **Improved DX**: Added automatic logging of the API Documentation URL on server startup.
  - **Biome 2.4 Integration**: Migrated the monorepo and generated templates to Biome for 20x faster linting and formatting. Templates now pin `@biomejs/biome@2.4.13` for consistent DX across environments.
  - **"Pro" Fail-Fast Logic**: Implemented strict connection checks for DB/Redis in production with warnings in development.
  - **Template Hardening**: Fixed multiple linting errors in generated templates (auth controllers, ApiResponse, and middleware).
  - **Docker Fix**: Resolved `depends_on` formatting and removed obsolete version tags in `docker-compose.yml`.
  - **Smoke Test Hardening**: Added mandatory linting checks to the generator test suite.

## 4.1.1

### Patch Changes

- 3752d64: fix build issues

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
