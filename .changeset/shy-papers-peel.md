---
"create-express-forge": major
---

### 🚀 Core CLI & Codebase Modernization- **Unified Tooling**: Migrated the entire monorepo to **Biome 2.4**, achieving sub-100ms linting and formatting.- **Generator Refactor**: Re-architected the generator logic into modular, testable components (Base, Structure, Features).- **Pro Testing Suite**: - Separated internal logic tests (`main.test.ts`) from CLI E2E tests (`smoke.integration.test.ts`). - Disabled test caching in Turborepo to ensure 100% reliable smoke runs.- **Modern Templates**: - Updated to **Express 5** (native async error handling) and **Prisma 6**. - Implemented professional **multi-stage Docker builds** (Node 20 Alpine). - Integrated **Biome** as the default linter/formatter for all generated projects.- **Production Hardening**: Added graceful shutdown handlers (SIGTERM/SIGINT) and fail-fast database connection checks on startup.- **Infrastructure**: Renamed and modernized shared monorepo configs (`@repo/lint-config`).
