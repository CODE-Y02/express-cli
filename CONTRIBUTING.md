# Contributing

Thank you for contributing! 🎉

## Prerequisites

- Node.js >= 18
- pnpm >= 9 (`npm i -g pnpm@9`)

## Setup

```bash
git clone https://github.com/CODE-Y02/express-cli
cd express-cli
pnpm install
pnpm run build
```

## Development

Run the CLI directly from source (no build needed):

```bash
pnpm tsx packages/create-express-forge/src/index.ts my-test-app
```

Run all checks:

```bash
pnpm run check-types
pnpm run lint
pnpm run test
```

## Adding a New Generator Feature

1. Add your option to `packages/create-express-forge/src/types.ts`
2. Add the prompt in `packages/create-express-forge/src/prompts.ts`
3. Add templates in `packages/create-express-forge/templates/`
4. Wire logic into `packages/create-express-forge/src/generator/index.ts`
5. Update `packages/create-express-forge/src/utils/package-builder.ts` if it adds dependencies
6. Add a test in `packages/create-express-forge/tests/`

## Releasing

We use [Changesets](https://github.com/changesets/changesets).

1. Make changes + open a PR
2. Run `pnpm changeset` and describe the change
3. After merge to `main`, the Changesets bot opens a "Version Packages" PR
4. Merge that PR → auto-publish to npm with `latest` tag

### Beta releases

Merge to the `next` branch → auto-publishes with `next` tag:

```bash
npx create-express-forge@next my-app
```
