# Logging

The CLI supports **Winston** and **Pino** loggers.

## Winston

Feature-rich logger with transport-based architecture.

Generated at `src/logger/index.ts`:
- **Development**: Colorized console output with timestamps
- **Production**: JSON format + daily rotating file logs in `logs/`

```ts
import { logger } from './logger/index.js';

logger.info('Server started');
logger.warn('Deprecation warning');
logger.error('Something failed', { error: err });
logger.debug('Debug data', { userId: '123' });
```

### Log Files (production)

```
logs/
├── app-2024-01-15.log
├── app-2024-01-14.log.gz   ← auto-compressed
└── ...                      ← auto-deleted after 14 days
```

## Pino

Ultra-fast, low-overhead structured logger.

Generated files:
- `src/logger/index.ts` — Pino instance
- `src/middleware/httpLogger.ts` — HTTP request logging via `pino-http`

```ts
import { logger } from './logger/index.js';

logger.info('Server started');
logger.info({ userId: '123' }, 'User logged in');
```

### Pretty output in development

Pino outputs JSON by default. In development, `pino-pretty` formats it:

```
14:30:22 [INFO]: Server started
14:30:23 [INFO]: User logged in { userId: '123' }
```

## When to Choose Which

| | Winston | Pino |
|---|---|---|
| **Speed** | Good | 5x faster |
| **File logging** | Built-in rotation | Needs external tool |
| **Customization** | Very flexible | Minimal API |
| **Use case** | Complex logging needs | High-throughput APIs |
