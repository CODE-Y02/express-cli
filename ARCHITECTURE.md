# Architecture

## Repository Layout

```
create-express-forge/                  ← Turborepo monorepo root
├── packages/
│   ├── create-express-forge/          ← Published CLI package (npm)
│   │   ├── src/
│   │   │   ├── index.ts               ← CLI entry (shebang)
│   │   │   ├── prompts.ts             ← Interactive prompts (@inquirer/prompts)
│   │   │   ├── types.ts               ← Shared option types
│   │   │   ├── generator/
│   │   │   │   ├── index.ts           ← Orchestrator (runs all generators in order)
│   │   │   │   ├── base.ts            ← tsconfig, .gitignore, .env, README
│   │   │   │   ├── templates.ts       ← Shared template strings (middleware, utils, config)
│   │   │   │   ├── structure/
│   │   │   │   │   ├── modular.ts     ← Feature-based module architecture
│   │   │   │   │   └── mvc.ts         ← Model-View-Controller architecture
│   │   │   │   └── features/
│   │   │   │       ├── prisma.ts      ← Prisma schema + singleton client
│   │   │   │       ├── sequelize.ts   ← Sequelize model + config
│   │   │   │       ├── logger.ts      ← Winston / Pino logger
│   │   │   │       ├── testing.ts     ← Vitest / Jest config + sample test
│   │   │   │       └── docker.ts      ← Dockerfile + docker-compose
│   │   │   └── utils/
│   │   │       ├── display.ts         ← CLI banner + success/error output
│   │   │       ├── file.ts            ← fs-extra writeFile/writeJson helpers
│   │   │       └── package-builder.ts ← Builds generated project's package.json
│   │   └── tests/                     ← Vitest unit tests for the CLI itself
│   ├── typescript-config/             ← Shared tsconfig (internal, not published)
│   └── eslint-config/                 ← Shared ESLint config (internal, not published)
├── examples/
│   └── modular-postgres-prisma/       ← Pre-generated reference project
└── .github/
    └── workflows/
        ├── ci.yml                     ← Runs on all feature branches + PRs
        └── release.yml                ← Publishes to npm via Changesets
```

## Generator Flow

When the user runs `npx create-express-forge`:

```
prompts.ts
  → collects: projectName, pattern, orm, database, logger, testing, docker
  → calls generateProject(options, targetDir)

generator/index.ts (orchestrator)
  1. writeJson  package.json          ← package-builder.ts
  2. generateBaseFiles                ← base.ts
  3. generateModularStructure OR generateMvcStructure
  4. generatePrisma OR generateSequelize (if selected)
  5. generateLogger (if selected)
  6. generateTesting (if selected)
  7. generateDocker (if selected)
  8. npm install (if selected)
```

## What Gets Generated

Every generated project always includes:
- `src/middleware/errorHandler.ts` — Global centralized error handler
- `src/middleware/validate.ts` — Zod request validation
- `src/middleware/notFound.ts` — 404 handler
- `src/middleware/rateLimiter.ts` — Rate limiting
- `src/utils/ApiError.ts` — Custom error class
- `src/utils/ApiResponse.ts` — Consistent response helpers
- `src/utils/asyncHandler.ts` — Async route wrapper
- `src/config/env.ts` — Zod-validated env schema

## Adding a New Feature Generator

1. Add the option to `src/types.ts`
2. Add the prompt in `src/prompts.ts`
3. Create `src/generator/features/my-feature.ts`
4. Import and call it in `src/generator/index.ts`
5. Add any deps to `src/utils/package-builder.ts`
6. Write a test in `tests/`
