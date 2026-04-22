# AGENTS.md — AI Agent Instructions

This file instructs AI coding agents (Cursor, GitHub Copilot, Claude, etc.) on how to work with this repository correctly.

## What This Repo Is

A **Turborepo monorepo** for `create-express-forge` — an open-source CLI that scaffolds production-ready Express.js TypeScript backends.

## Package Manager

**Always use `pnpm`.** Never use `npm install` or `yarn` directly.

```bash
pnpm install              # install all workspace deps
pnpm install -w <pkg>     # add to root
pnpm add <pkg> --filter create-express-forge  # add to CLI package
```

## Running Things

```bash
pnpm run build            # build all packages via turbo
pnpm run check-types      # typecheck all packages
pnpm run test             # run all tests
pnpm run lint             # lint all packages

# Dev: run CLI from source (no build needed)
pnpm tsx packages/create-express-forge/src/index.ts my-test-app
```

## Repository Structure

```
packages/create-express-forge/   ← The CLI (the only published package)
packages/typescript-config/      ← Internal shared TS config
packages/eslint-config/          ← Internal shared ESLint config
examples/                        ← Pre-generated reference projects (private)
```

## Key Conventions

### Types

All CLI option types live in `packages/create-express-forge/src/types.ts`.
- `Pattern` = `'modular' | 'mvc'`
- `ORM` = `'prisma' | 'sequelize' | 'none'`
- `Database` = `'postgresql' | 'mysql' | 'sqlite' | 'none'`
- `LoggerLib` = `'winston' | 'pino' | 'none'`
- `TestingLib` = `'vitest' | 'jest' | 'none'`

### Generated Code Templates

All template strings (file content that gets written to the user's project) live in:
- `src/generator/templates.ts` — shared middleware/utils/config
- `src/generator/structure/modular.ts` — modular arch templates
- `src/generator/structure/mvc.ts` — MVC arch templates
- `src/generator/features/*.ts` — feature-specific templates

### Adding a New Feature

1. Add the type to `src/types.ts`
2. Add the prompt in `src/prompts.ts` using `@inquirer/prompts` (`select`, `confirm`, `input`)
3. Create `src/generator/features/my-feature.ts` exporting `async function generateMyFeature(opts, dir)`
4. Import and call it in `src/generator/index.ts`
5. Add deps to `src/utils/package-builder.ts` in the right section
6. Add a test in `tests/my-feature.test.ts`

### Template String Rules

- Use template literals with backtick strings
- All generated imports use `.js` extension (NodeNext ESM)
- Never use `process.cwd()` inside templates — use `dir` param
- Generated package.json `"type": "module"` always

### File Writing Helpers

```typescript
import { writeFile, writeJson } from '../../utils/file.js';
await writeFile(path.join(dir, 'src', 'app.ts'), `...content...`);
await writeJson(path.join(dir, 'package.json'), { ... });
```

## Testing

Tests live in `packages/create-express-forge/tests/`.
Run with: `pnpm run test --filter create-express-forge`

Tests use **Vitest**. Each generator function should have a test that:
1. Calls the generator with mock options
2. Checks that expected files were created in a temp dir
3. Verifies file content contains key strings

## TypeScript

- `tsconfig.json` extends `@repo/typescript-config/base.json`
- `moduleResolution: NodeNext` — all imports need `.js` extension
- No `any` types
- `noUncheckedIndexedAccess: true` — always check array access

## Changeset / Releasing

Only `packages/create-express-forge` is published. Internal packages (`typescript-config`, `eslint-config`) are private.

To add a changeset after making changes:
```bash
pnpm changeset
```
