import path from 'path';
import type { CliOptions } from '../../types.js';
import { writeFile } from '../../utils/file.js';
import {
  tplEnvConfig, tplApiError, tplApiResponse, tplAsyncHandler,
  tplErrorHandler, tplNotFound, tplRateLimiter, tplValidate,
  tplExpressTypes, tplServerTs,
} from '../templates.js';

export async function generateMvcStructure(opts: CliOptions, dir: string): Promise<void> {
  const src = path.join(dir, 'src');

  await writeFile(path.join(src, 'config', 'env.ts'), tplEnvConfig(opts));
  await writeFile(path.join(src, 'types', 'express.d.ts'), tplExpressTypes());
  await writeFile(path.join(src, 'utils', 'ApiError.ts'), tplApiError());
  await writeFile(path.join(src, 'utils', 'ApiResponse.ts'), tplApiResponse());
  await writeFile(path.join(src, 'utils', 'asyncHandler.ts'), tplAsyncHandler());
  await writeFile(path.join(src, 'middleware', 'errorHandler.ts'), tplErrorHandler());
  await writeFile(path.join(src, 'middleware', 'notFound.ts'), tplNotFound());
  await writeFile(path.join(src, 'middleware', 'rateLimiter.ts'), tplRateLimiter());
  await writeFile(path.join(src, 'middleware', 'validate.ts'), tplValidate());

  await writeFile(path.join(src, 'schemas', 'user.schema.ts'),
    `import { z } from 'zod';\nexport const createUserSchema = z.object({ body: z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(8) }) });\nexport const updateUserSchema = z.object({ params: z.object({ id: z.string().uuid() }), body: z.object({ name: z.string().min(2).optional(), email: z.string().email().optional() }) });\nexport type CreateUserDto = z.infer<typeof createUserSchema>['body'];\nexport type UpdateUserDto = z.infer<typeof updateUserSchema>['body'];\n`);

  await writeFile(path.join(src, 'services', 'user.service.ts'),
    `import { ApiError } from '../utils/ApiError.js';\nconst store: Array<{ id: string; name: string; email: string }> = [];\nexport const UserService = {\n  findAll: async () => store,\n  findById: async (id: string) => { const u = store.find((u) => u.id === id); if (!u) throw ApiError.notFound('User not found'); return u; },\n  create: async (data: { name: string; email: string; password: string }) => { if (store.find((u) => u.email === data.email)) throw ApiError.conflict('Email already registered'); const u = { id: crypto.randomUUID(), name: data.name, email: data.email }; store.push(u); return u; },\n  update: async (id: string, data: Partial<{ name: string; email: string }>) => { const u = store.find((u) => u.id === id); if (!u) throw ApiError.notFound('User not found'); Object.assign(u, data); return u; },\n  remove: async (id: string) => { const i = store.findIndex((u) => u.id === id); if (i === -1) throw ApiError.notFound('User not found'); store.splice(i, 1); },\n};\n`);

  await writeFile(path.join(src, 'controllers', 'health.controller.ts'),
    `import type { Request, Response } from 'express';\nimport { ApiResponse } from '../utils/ApiResponse.js';\nexport const getHealth = (_req: Request, res: Response) => ApiResponse.success(res, { status: 'ok', timestamp: new Date().toISOString() }, 'Service healthy');\n`);

  await writeFile(path.join(src, 'controllers', 'user.controller.ts'),
    `import type { Request, Response } from 'express';\nimport { asyncHandler } from '../utils/asyncHandler.js';\nimport { ApiResponse } from '../utils/ApiResponse.js';\nimport { UserService } from '../services/user.service.js';\nimport type { CreateUserDto, UpdateUserDto } from '../schemas/user.schema.js';\nexport const getUsers = asyncHandler(async (_req, res: Response) => ApiResponse.success(res, await UserService.findAll(), 'Users fetched'));\nexport const getUserById = asyncHandler(async (req: Request, res: Response) => ApiResponse.success(res, await UserService.findById(req.params.id ?? '')));\nexport const createUser = asyncHandler(async (req: Request, res: Response) => ApiResponse.created(res, await UserService.create(req.body as CreateUserDto), 'User created'));\nexport const updateUser = asyncHandler(async (req: Request, res: Response) => ApiResponse.success(res, await UserService.update(req.params.id ?? '', req.body as UpdateUserDto), 'User updated'));\nexport const deleteUser = asyncHandler(async (req: Request, res: Response) => { await UserService.remove(req.params.id ?? ''); return ApiResponse.noContent(res); });\n`);

  await writeFile(path.join(src, 'routes', 'index.ts'),
    `import { Router } from 'express';\nimport { healthRouter } from './health.routes.js';\nimport { userRouter } from './user.routes.js';\nconst router = Router();\nrouter.use('/health', healthRouter);\nrouter.use('/users', userRouter);\nexport { router };\n`);

  await writeFile(path.join(src, 'routes', 'health.routes.ts'),
    `import { Router } from 'express';\nimport { getHealth } from '../controllers/health.controller.js';\nconst router = Router();\nrouter.get('/', getHealth);\nexport { router as healthRouter };\n`);

  await writeFile(path.join(src, 'routes', 'user.routes.ts'),
    `import { Router } from 'express';\nimport { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/user.controller.js';\nimport { validate } from '../middleware/validate.js';\nimport { createUserSchema, updateUserSchema } from '../schemas/user.schema.js';\nconst router = Router();\nrouter.get('/', getUsers);\nrouter.get('/:id', getUserById);\nrouter.post('/', validate(createUserSchema), createUser);\nrouter.patch('/:id', validate(updateUserSchema), updateUser);\nrouter.delete('/:id', deleteUser);\nexport { router as userRouter };\n`);

  await writeFile(path.join(src, 'app.ts'),
    `import express from 'express';\nimport cors from 'cors';\nimport helmet from 'helmet';\nimport compression from 'compression';\nimport { env } from './config/env.js';\nimport { rateLimiter } from './middleware/rateLimiter.js';\nimport { notFound } from './middleware/notFound.js';\nimport { errorHandler } from './middleware/errorHandler.js';\nimport { router } from './routes/index.js';\nconst app = express();\napp.use(helmet());\napp.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));\napp.use(express.json({ limit: '10mb' }));\napp.use(express.urlencoded({ extended: true }));\napp.use(compression());\napp.use(rateLimiter);\napp.use('/api/v1', router);\napp.use(notFound);\napp.use(errorHandler);\nexport { app };\n`);

  await writeFile(path.join(src, 'server.ts'), tplServerTs(opts.logger));
}
