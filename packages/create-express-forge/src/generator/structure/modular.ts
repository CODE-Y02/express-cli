import path from 'path';
import type { CliOptions } from '../../types.js';
import { writeFile } from '../../utils/file.js';
import {
  tplEnvConfig, tplApiError, tplApiResponse, tplAsyncHandler,
  tplErrorHandler, tplNotFound, tplRateLimiter, tplValidate,
  tplExpressTypes, tplServerTs,
} from '../templates.js';

export async function generateModularStructure(opts: CliOptions, dir: string): Promise<void> {
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

  // Health module
  await writeFile(path.join(src, 'modules', 'health', 'health.routes.ts'),
    `import { Router } from 'express';\nimport { getHealth } from './health.controller.js';\nconst router = Router();\nrouter.get('/', getHealth);\nexport { router as healthRouter };\n`);
  await writeFile(path.join(src, 'modules', 'health', 'health.controller.ts'),
    `import type { Request, Response } from 'express';\nimport { ApiResponse } from '../../utils/ApiResponse.js';\nexport const getHealth = (_req: Request, res: Response) =>\n  ApiResponse.success(res, { status: 'ok', timestamp: new Date().toISOString() }, 'Service healthy');\n`);

  // Users module
  await writeFile(path.join(src, 'modules', 'users', 'users.schema.ts'),
    `import { z } from 'zod';\n\nexport const createUserSchema = z.object({\n  body: z.object({\n    name: z.string().min(2),\n    email: z.string().email(),\n    password: z.string().min(8),\n  }),\n});\n\nexport const updateUserSchema = z.object({\n  params: z.object({ id: z.string().uuid() }),\n  body: z.object({ name: z.string().min(2).optional(), email: z.string().email().optional() }),\n});\n\nexport type CreateUserDto = z.infer<typeof createUserSchema>['body'];\nexport type UpdateUserDto = z.infer<typeof updateUserSchema>['body'];\n`);

  await writeFile(path.join(src, 'modules', 'users', 'users.service.ts'),
    `import { ApiError } from '../../utils/ApiError.js';\n\nconst store: Array<{ id: string; name: string; email: string }> = [];\n\nexport const UsersService = {\n  findAll: async () => store,\n  findById: async (id: string) => {\n    const user = store.find((u) => u.id === id);\n    if (!user) throw ApiError.notFound('User not found');\n    return user;\n  },\n  create: async (data: { name: string; email: string; password: string }) => {\n    if (store.find((u) => u.email === data.email)) throw ApiError.conflict('Email already registered');\n    const user = { id: crypto.randomUUID(), name: data.name, email: data.email };\n    store.push(user);\n    return user;\n  },\n  update: async (id: string, data: Partial<{ name: string; email: string }>) => {\n    const user = store.find((u) => u.id === id);\n    if (!user) throw ApiError.notFound('User not found');\n    Object.assign(user, data);\n    return user;\n  },\n  remove: async (id: string) => {\n    const idx = store.findIndex((u) => u.id === id);\n    if (idx === -1) throw ApiError.notFound('User not found');\n    store.splice(idx, 1);\n  },\n};\n`);

  await writeFile(path.join(src, 'modules', 'users', 'users.controller.ts'),
    `import type { Request, Response } from 'express';\nimport { asyncHandler } from '../../utils/asyncHandler.js';\nimport { ApiResponse } from '../../utils/ApiResponse.js';\nimport { UsersService } from './users.service.js';\nimport type { CreateUserDto, UpdateUserDto } from './users.schema.js';\n\nexport const getUsers = asyncHandler(async (_req, res: Response) => ApiResponse.success(res, await UsersService.findAll(), 'Users fetched'));\nexport const getUserById = asyncHandler(async (req: Request, res: Response) => ApiResponse.success(res, await UsersService.findById(req.params.id ?? '')));\nexport const createUser = asyncHandler(async (req: Request, res: Response) => ApiResponse.created(res, await UsersService.create(req.body as CreateUserDto), 'User created'));\nexport const updateUser = asyncHandler(async (req: Request, res: Response) => ApiResponse.success(res, await UsersService.update(req.params.id ?? '', req.body as UpdateUserDto), 'User updated'));\nexport const deleteUser = asyncHandler(async (req: Request, res: Response) => { await UsersService.remove(req.params.id ?? ''); return ApiResponse.noContent(res); });\n`);

  await writeFile(path.join(src, 'modules', 'users', 'users.routes.ts'),
    `import { Router } from 'express';\nimport { getUsers, getUserById, createUser, updateUser, deleteUser } from './users.controller.js';\nimport { validate } from '../../middleware/validate.js';\nimport { createUserSchema, updateUserSchema } from './users.schema.js';\n\nconst router = Router();\nrouter.get('/', getUsers);\nrouter.get('/:id', getUserById);\nrouter.post('/', validate(createUserSchema), createUser);\nrouter.patch('/:id', validate(updateUserSchema), updateUser);\nrouter.delete('/:id', deleteUser);\nexport { router as usersRouter };\n`);

  await writeFile(path.join(src, 'app.ts'),
    `import express from 'express';\nimport cors from 'cors';\nimport helmet from 'helmet';\nimport compression from 'compression';\nimport { env } from './config/env.js';\nimport { rateLimiter } from './middleware/rateLimiter.js';\nimport { notFound } from './middleware/notFound.js';\nimport { errorHandler } from './middleware/errorHandler.js';\nimport { healthRouter } from './modules/health/health.routes.js';\nimport { usersRouter } from './modules/users/users.routes.js';\n\nconst app = express();\napp.use(helmet());\napp.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));\napp.use(express.json({ limit: '10mb' }));\napp.use(express.urlencoded({ extended: true }));\napp.use(compression());\napp.use(rateLimiter);\napp.use('/api/health', healthRouter);\napp.use('/api/v1/users', usersRouter);\napp.use(notFound);\napp.use(errorHandler);\nexport { app };\n`);

  await writeFile(path.join(src, 'server.ts'), tplServerTs(opts.logger));
}
