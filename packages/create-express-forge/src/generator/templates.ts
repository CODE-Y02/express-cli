import type { CliOptions } from '../types.js';

// All template strings for files written into the user's generated project

export function tplEnvConfig(opts: CliOptions): string {
  const hasDb = opts.orm !== 'none' && opts.database !== 'none';
  return `import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  CORS_ORIGIN: z.string().default('*'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900_000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
${hasDb ? "  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required')," : "  // DATABASE_URL: z.string(),"}
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('\\n❌ Invalid environment variables:');
  console.error(JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;
`;
}

export function tplApiError(): string {
  return `export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors: unknown[];
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, errors: unknown[] = [], isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, ApiError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad Request', errors: unknown[] = []) { return new ApiError(400, message, errors); }
  static unauthorized(message = 'Unauthorized') { return new ApiError(401, message); }
  static forbidden(message = 'Forbidden')        { return new ApiError(403, message); }
  static notFound(message = 'Not Found')          { return new ApiError(404, message); }
  static conflict(message = 'Conflict')           { return new ApiError(409, message); }
  static internal(message = 'Internal Server Error') { return new ApiError(500, message, [], false); }
}
`;
}

export function tplApiResponse(): string {
  return `import type { Response } from 'express';

export class ApiResponse {
  static success<T>(res: Response, data: T, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({ success: true, message, data });
  }
  static created<T>(res: Response, data: T, message = 'Created') {
    return ApiResponse.success(res, data, message, 201);
  }
  static noContent(res: Response) { return res.status(204).send(); }
  static paginated<T>(res: Response, data: T[], pagination: { total: number; page: number; limit: number; pages: number }, message = 'Success') {
    return res.status(200).json({ success: true, message, data, pagination });
  }
}
`;
}

export function tplAsyncHandler(): string {
  return `import type { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncFn = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

/** Wraps async route handlers — errors forwarded to global error handler */
export const asyncHandler = (fn: AsyncFn): RequestHandler =>
  (req, res, next) => { Promise.resolve(fn(req, res, next)).catch(next); };
`;
}

export function tplErrorHandler(): string {
  return `import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.js';

/**
 * Global centralized error handler — must be the LAST middleware registered.
 * Handles: ApiError, ZodError, and unknown errors.
 */
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  const isDev = process.env.NODE_ENV === 'development';

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors.length > 0 && { errors: err.errors }),
      ...(isDev && { stack: err.stack }),
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors.map((e) => ({ path: e.path.join('.'), message: e.message })),
    });
    return;
  }

  console.error('[UnhandledError]', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    ...(isDev && { stack: err.stack }),
  });
};
`;
}

export function tplNotFound(): string {
  return `import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';

export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  next(ApiError.notFound(\`Route \${req.method} \${req.url} not found\`));
};
`;
}

export function tplRateLimiter(): string {
  return `import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

export const rateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
`;
}

export function tplValidate(): string {
  return `import type { Request, Response, NextFunction } from 'express';
import { type AnyZodObject, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.js';

/** Validates req.body / req.query / req.params against a Zod schema */
export const validate = (schema: AnyZodObject) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({ body: req.body, query: req.query, params: req.params });
      next();
    } catch (err) {
      if (err instanceof ZodError) next(ApiError.badRequest('Validation failed', err.errors));
      else next(err);
    }
  };
`;
}

export function tplExpressTypes(): string {
  return `import 'express';

declare module 'express' {
  interface Request {
    user?: { id: string; email: string; role: string };
  }
}
`;
}

export function tplServerTs(loggerLib: string): string {
  const hasLogger = loggerLib !== 'none';
  const logImport = hasLogger ? `import { logger } from './logger/index.js';\n` : '';
  const log = hasLogger ? 'logger.info' : 'console.log';
  return `import 'dotenv/config';
${logImport}import { app } from './app.js';
import { env } from './config/env.js';

const server = app.listen(env.PORT, () => {
  ${log}(\`🚀 Server running on port \${env.PORT} in \${env.NODE_ENV} mode\`);
});

const shutdown = (signal: string) => {
  ${log}(\`\${signal} received — shutting down gracefully\`);
  server.close(() => process.exit(0));
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('uncaughtException', (err) => { console.error('Uncaught:', err); process.exit(1); });
process.on('unhandledRejection', (r) => { console.error('Unhandled:', r); process.exit(1); });
`;
}
