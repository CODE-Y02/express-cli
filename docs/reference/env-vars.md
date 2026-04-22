# Environment Variables

Every generated project uses **Zod** to validate environment variables at startup. If any required variable is missing or invalid, the server fails fast with a clear error message.

## Configuration

Environment variables are defined in `src/config/env.ts`:

```ts
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  CORS_ORIGIN: z.string().default('*'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900_000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  DATABASE_URL: z.string().min(1), // only if ORM selected
});
```

## Variables

### Core

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `NODE_ENV` | `development \| production \| test` | `development` | Application environment |
| `PORT` | `number` | `3000` | Server port |
| `CORS_ORIGIN` | `string` | `*` | Allowed CORS origin(s) |

### Rate Limiting

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `RATE_LIMIT_WINDOW_MS` | `number` | `900000` (15 min) | Window duration in ms |
| `RATE_LIMIT_MAX` | `number` | `100` | Max requests per window |

### Database (if ORM selected)

| Variable | Type | Example |
|----------|------|---------|
| `DATABASE_URL` | `string` | `postgresql://user:pass@localhost:5432/mydb` |

#### Connection string formats

```bash
# PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# MySQL
DATABASE_URL="mysql://user:password@localhost:3306/mydb"

# SQLite
DATABASE_URL="file:./dev.db"
```

## Adding Custom Variables

1. Add to the Zod schema in `src/config/env.ts`:

```ts
const envSchema = z.object({
  // ...existing vars
  JWT_SECRET: z.string().min(32),
  REDIS_URL: z.string().url().optional(),
});
```

2. Add to `.env` and `.env.example`:

```env
JWT_SECRET=your-super-secret-key-at-least-32-chars
REDIS_URL=redis://localhost:6379
```

3. Use anywhere via the typed `env` object:

```ts
import { env } from '../config/env.js';
const secret = env.JWT_SECRET; // fully typed!
```
