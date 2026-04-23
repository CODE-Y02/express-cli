import type { CliOptions } from '../types.js';

// All template strings for files written into the user's generated project

export function tplEnvConfig(opts: CliOptions): string {
  const hasDb = opts.orm !== 'none' && opts.database !== 'none';
  const isJwt = opts.auth === 'jwt';
  const isSession = opts.auth === 'session';

  return `import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  CORS_ORIGIN: z.string().default('*'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900_000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
${hasDb ? `  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),` : "  // DATABASE_URL: z.string(),"}
${isJwt ? `  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),\n  JWT_EXPIRES_IN: z.string().default('1d'),` : ''}${isSession ? `  SESSION_SECRET: z.string().min(1, 'SESSION_SECRET is required'),` : ''}
${opts.cache === 'redis' ? `  REDIS_URL: z.string().url().default('redis://localhost:6379'),` : ''}
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
import { env } from '../config/env.js';

/**
 * Global centralized error handler — must be the LAST middleware registered.
 * Handles: ApiError, ZodError, and unknown errors.
 */
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  const isDev = env.NODE_ENV === 'development';

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

export function tplAppTs(opts: CliOptions): string {
  const isModular = opts.pattern === 'modular';
  const hasSwagger = opts.openapi;
  const needsCookies = opts.jwtStorage === 'cookie' || opts.auth === 'session';

  return `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
${needsCookies ? "import cookieParser from 'cookie-parser';" : ''}
import { env } from './config/env.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
${hasSwagger ? "import { setupSwagger } from './docs/swagger.js';" : ''}
${isModular ? `import { healthRouter } from './modules/health/health.routes.js';
import { todosRouter } from './modules/todos/todos.routes.js';
${opts.auth === 'jwt' ? "import { authRouter } from './modules/auth/auth.routes.js';" : ''}` : "import { router } from './routes/index.js';"}

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
${needsCookies ? 'app.use(cookieParser());' : ''}
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(rateLimiter);

${hasSwagger ? 'setupSwagger(app);' : ''}

${
  isModular
    ? `app.use('/api/health', healthRouter);
app.use('/api/v1/todos', todosRouter);
${opts.auth === 'jwt' ? "app.use('/api/v1/auth', authRouter);" : ''}`
    : "app.use('/api/v1', router);"
}

app.use(notFound);
app.use(errorHandler);

export { app };
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

export function tplTodosService(opts: CliOptions): string {
  if (opts.orm === 'prisma') {
    return `import { prisma } from '../../config/database.js';
import { ApiError } from '../../utils/ApiError.js';
import type { CreateTodoDto, UpdateTodoDto } from './todos.schema.js';

export const TodosService = {
  findAll: async (userId: string) => {
    return prisma.user.findUnique({
      where: { id: userId }
    }).todos(); // Assuming a relation exists, or just filter:
    // return prisma.todo.findMany({ where: { userId } });
  },

  findById: async (id: string, userId: string) => {
    const todo = await prisma.todo.findFirst({ where: { id, userId } });
    if (!todo) throw ApiError.notFound('Todo not found');
    return todo;
  },

  create: async (userId: string, data: CreateTodoDto) => {
    return prisma.todo.create({
      data: { ...data, userId }
    });
  },

  update: async (id: string, userId: string, data: UpdateTodoDto) => {
    const todo = await prisma.todo.findFirst({ where: { id, userId } });
    if (!todo) throw ApiError.notFound('Todo not found');
    return prisma.todo.update({
      where: { id },
      data
    });
  },

  remove: async (id: string, userId: string) => {
    const todo = await prisma.todo.findFirst({ where: { id, userId } });
    if (!todo) throw ApiError.notFound('Todo not found');
    return prisma.todo.delete({ where: { id } });
  },
};
`;
  }

  // Default in-memory store for 'none' or simple demo
  return `import { ApiError } from '../../utils/ApiError.js';

export interface Todo { id: string; title: string; description?: string; completed: boolean; userId: string; }

const store: Todo[] = [];

export const TodosService = {
  findAll: async (userId: string) => store.filter(t => t.userId === userId),
  findById: async (id: string, userId: string) => {
    const todo = store.find((t) => t.id === id && t.userId === userId);
    if (!todo) throw ApiError.notFound('Todo not found');
    return todo;
  },
  create: async (userId: string, data: any) => {
    const todo = { id: Math.random().toString(36).substring(7), ...data, userId, completed: false };
    store.push(todo);
    return todo;
  },
  update: async (id: string, userId: string, data: any) => {
    const todo = store.find((t) => t.id === id && t.userId === userId);
    if (!todo) throw ApiError.notFound('Todo not found');
    Object.assign(todo, data);
    return todo;
  },
  remove: async (id: string, userId: string) => {
    const idx = store.findIndex((t) => t.id === id && t.userId === userId);
    if (idx === -1) throw ApiError.notFound('Todo not found');
    store.splice(idx, 1);
  },
};
`;
}
