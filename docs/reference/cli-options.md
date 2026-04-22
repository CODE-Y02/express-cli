# CLI Options

## Usage

```bash
npx create-express-forge [project-name]
```

If `project-name` is not provided, the CLI will prompt you.

## Flags

| Flag | Description |
|------|-------------|
| `--help` | Show help |
| `--version` | Show version |

## Interactive Prompts

All options are selected via interactive prompts. There are no CLI flags for individual options — this is intentional to keep the DX simple and discoverable.

### Project Name

- **Type**: `string`
- **Default**: `my-express-app`
- **Validation**: lowercase letters, numbers, hyphens, underscores only

### Architecture Pattern

| Value | Description |
|-------|-------------|
| `modular` | Feature-based modules — each feature in its own folder |
| `mvc` | Model-View-Controller — separated by concern type |

### ORM

| Value | Description |
|-------|-------------|
| `prisma` | Type-safe ORM with schema-first approach |
| `sequelize` | Traditional ORM with decorator-based models |
| `none` | No ORM — configure later |

### Database

Only shown if ORM ≠ `none`.

| Value | Description |
|-------|-------------|
| `postgresql` | PostgreSQL via `pg` driver |
| `mysql` | MySQL via `mysql2` driver |
| `sqlite` | SQLite for local dev |
| `none` | No database configured |

### Logger

| Value | Description |
|-------|-------------|
| `winston` | Feature-rich with file rotation |
| `pino` | Ultra-fast structured logging |
| `none` | Uses `console.log` |

### Testing Framework

| Value | Description |
|-------|-------------|
| `vitest` | Fast, ESM-native (recommended) |
| `jest` | Widely-used, mature ecosystem |
| `none` | No testing configured |

### Docker

- **Type**: `boolean`
- **Default**: `true`
- Generates `Dockerfile`, `.dockerignore`, and `docker-compose.yml`

### Install Dependencies

- **Type**: `boolean`
- **Default**: `true`
- Runs `npm install` after scaffolding
