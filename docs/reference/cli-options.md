# CLI Reference

The `create-express-forge` command can be used with various flags to bypass the interactive prompts and speed up your workflow.

## Usage

```bash
npx create-express-forge [project-name] [options]
```

## Options

| Flag | Description | Values |
|------|-------------|--------|
| `--help` | Show help information | - |
| `--version` | Show current version | - |
| `--pattern` | Architecture pattern | `modular`, `mvc` |
| `--orm` | ORM to use | `prisma`, `sequelize`, `none` |
| `--db` | Database type | `postgres`, `mysql`, `sqlite` |
| `--logger` | Logging library | `winston`, `pino` |
| `--test` | Testing framework | `vitest`, `jest` |
| `--docker` | Include Docker setup | `true`, `false` |
| `--install` | Auto-install dependencies | `true`, `false` |

## Example

Scaffold a modular project with Prisma and Vitest:

```bash
npx create-express-forge my-api --pattern modular --orm prisma --test vitest --install true
```

