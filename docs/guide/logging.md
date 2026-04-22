# Logging

Proper logging is essential for production applications. We provide a pre-configured Winston or Pino setup.

## Winston Setup

Winston is a feature-rich logging library that supports multiple transports.

- **Console Transport**: Logs are printed to the console with colors in development.
- **File Transport**: Logs are saved to the `logs/` directory.
- **Log Levels**: Error, Warn, Info, Http, Debug.

## Usage

```typescript
import logger from '../utils/logger';

logger.info('User logged in', { userId: user.id });
logger.error('Database connection failed', { error: err.message });
```

## HTTP Logging

We also include **Morgan** middleware, which is integrated with Winston to automatically log every incoming HTTP request.
