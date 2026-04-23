import path from 'path';
import type { CliOptions } from '../../types.js';
import { writeFile } from '../../utils/file.js';
import {
  tplEnvConfig, tplApiError, tplApiResponse, tplAsyncHandler,
  tplErrorHandler, tplNotFound, tplRateLimiter, tplValidate,
  tplExpressTypes, tplServerTs, tplAppTs,
} from '../templates.js';
import { TemplateManager } from '../../utils/template-manager.js';

export async function generateMvcStructure(opts: CliOptions, dir: string): Promise<void> {
  const src = path.join(dir, 'src');
  const tm = new TemplateManager(opts);

  await writeFile(path.join(src, 'config', 'env.ts'), tplEnvConfig(opts));
  await writeFile(path.join(src, 'types', 'express.d.ts'), tplExpressTypes());
  await writeFile(path.join(src, 'utils', 'ApiError.ts'), tplApiError());
  await writeFile(path.join(src, 'utils', 'ApiResponse.ts'), tplApiResponse());
  await writeFile(path.join(src, 'utils', 'asyncHandler.ts'), tplAsyncHandler());
  await writeFile(path.join(src, 'middleware', 'errorHandler.ts'), tplErrorHandler());
  await writeFile(path.join(src, 'middleware', 'notFound.ts'), tplNotFound());
  await writeFile(path.join(src, 'middleware', 'rateLimiter.ts'), tplRateLimiter());
  await writeFile(path.join(src, 'middleware', 'validate.ts'), tplValidate());
  if (opts.auth !== 'none') {
    await writeFile(path.join(src, 'middleware', 'auth.middleware.ts'), tm.renderAuthMiddleware(1));
  }

  await writeFile(path.join(src, 'schemas', 'todo.schema.ts'),
    `import { z } from 'zod';\nexport const createTodoSchema = z.object({ body: z.object({ title: z.string().min(1).max(100), description: z.string().max(500).optional() }) });\nexport const updateTodoSchema = z.object({ params: z.object({ id: z.string() }), body: z.object({ title: z.string().min(1).max(100).optional(), description: z.string().max(500).optional(), completed: z.boolean().optional() }) });\nexport type CreateTodoDto = z.infer<typeof createTodoSchema>['body'];\nexport type UpdateTodoDto = z.infer<typeof updateTodoSchema>['body'];\n`);

  await writeFile(path.join(src, 'services', 'todo.service.ts'), tm.renderTodoService(1));

  await writeFile(path.join(src, 'controllers', 'health.controller.ts'),
    `import type { Request, Response } from 'express';\nimport { ApiResponse } from '../utils/ApiResponse.js';\nexport const getHealth = (_req: Request, res: Response) => ApiResponse.success(res, { status: 'ok', timestamp: new Date().toISOString() }, 'Service healthy');\n`);

  await writeFile(path.join(src, 'controllers', 'todo.controller.ts'),
    `import type { Request, Response } from 'express';\nimport { asyncHandler } from '../utils/asyncHandler.js';\nimport { ApiResponse } from '../utils/ApiResponse.js';\nimport { TodosService } from '../services/todo.service.js';\nimport type { CreateTodoDto, UpdateTodoDto } from '../schemas/todo.schema.js';\nexport const getTodos = asyncHandler(async (req, res: Response) => ApiResponse.success(res, await TodosService.findAll(req.user?.id || 'guest'), 'Todos fetched'));\nexport const getTodoById = asyncHandler(async (req: Request, res: Response) => ApiResponse.success(res, await TodosService.findById(req.params.id || '', req.user?.id || 'guest')));\nexport const createTodo = asyncHandler(async (req: Request, res: Response) => ApiResponse.created(res, await TodosService.create(req.user?.id || 'guest', req.body as CreateTodoDto), 'Todo created'));\nexport const updateTodo = asyncHandler(async (req: Request, res: Response) => ApiResponse.success(res, await TodosService.update(req.params.id || '', req.user?.id || 'guest', req.body as UpdateTodoDto), 'Todo updated'));\nexport const deleteTodo = asyncHandler(async (req: Request, res: Response) => { await TodosService.remove(req.params.id || '', req.user?.id || 'guest'); return ApiResponse.noContent(res); });\n`);

  await writeFile(path.join(src, 'routes', 'index.ts'),
    `import { Router } from 'express';\nimport { healthRouter } from './health.routes.js';\nimport { todoRouter } from './todo.routes.js';\n${opts.auth === 'jwt' ? "import { authRouter } from './auth.routes.js';\n" : ""}const router = Router();\nrouter.use('/health', healthRouter);\nrouter.use('/todos', todoRouter);\n${opts.auth === 'jwt' ? "router.use('/auth', authRouter);\n" : ""}export { router };\n`);

  await writeFile(path.join(src, 'routes', 'health.routes.ts'),
    `import { Router } from 'express';\nimport { getHealth } from '../controllers/health.controller.js';\nconst router = Router();\n/**\n * @openapi\n * /api/health:\n *   get:\n *     tags:\n *       - Health\n *     description: Responds if the app is up and running\n *     responses:\n *       200:\n *         description: App is up and running\n */\nrouter.get('/', getHealth);\nexport { router as healthRouter };\n`);

  await writeFile(path.join(src, 'routes', 'todo.routes.ts'),
    `import { Router } from 'express';\nimport { getTodos, getTodoById, createTodo, updateTodo, deleteTodo } from '../controllers/todo.controller.js';\nimport { validate } from '../middleware/validate.js';\nimport { createTodoSchema, updateTodoSchema } from '../schemas/todo.schema.js';\n${opts.auth !== 'none' ? "import { auth } from '../middleware/auth.middleware.js';\n" : ""}const router = Router();\n${opts.auth !== 'none' ? 'router.use(auth);\n' : ''}/**\n * @openapi\n * /api/v1/todos:\n *   get:\n *     tags:\n *       - Todos\n *     responses:\n *       200:\n *         description: Success\n *   post:\n *     tags:\n *       - Todos\n *     requestBody:\n *       required: true\n *       content:\n *         application/json:\n *           schema:\n *             type: object\n *             required: [title]\n *             properties:\n *               title:\n *                 type: string\n *               description:\n *                 type: string\n *     responses:\n *       201:\n *         description: Created\n */\nrouter.get('/', getTodos);\nrouter.get('/:id', getTodoById);\nrouter.post('/', validate(createTodoSchema), createTodo);\nrouter.patch('/:id', validate(updateTodoSchema), updateTodo);\nrouter.delete('/:id', deleteTodo);\nexport { router as todoRouter };\n`);

  if (opts.auth === 'jwt') {
    await writeFile(path.join(src, 'schemas', 'auth.schema.ts'),
      `import { z } from 'zod';\nexport const registerSchema = z.object({ body: z.object({ email: z.string().email(), password: z.string().min(8), name: z.string().min(2) }) });\nexport const loginSchema = z.object({ body: z.object({ email: z.string().email(), password: z.string().min(8) }) });\n`);
    await writeFile(path.join(src, 'controllers', 'auth.controller.ts'), tm.renderAuthController(1));
    await writeFile(path.join(src, 'routes', 'auth.routes.ts'),
      `import { Router } from 'express';\nimport { login, register, logout } from '../controllers/auth.controller.js';\nimport { validate } from '../middleware/validate.js';\nimport { loginSchema, registerSchema } from '../schemas/auth.schema.js';\nconst router = Router();\n/**\n * @openapi\n * /api/v1/auth/register:\n *   post:\n *     tags:\n *       - Auth\n *     requestBody:\n *       required: true\n *       content:\n *         application/json:\n *           schema:\n *             type: object\n *             required: [email, password, name]\n *             properties:\n *               email:\n *                 type: string\n *               password:\n *                 type: string\n *               name:\n *                 type: string\n *     responses:\n *       201:\n *         description: Registered successfully\n * /api/v1/auth/login:\n *   post:\n *     tags:\n *       - Auth\n *     requestBody:\n *       required: true\n *       content:\n *         application/json:\n *           schema:\n *             type: object\n *             required: [email, password]\n *             properties:\n *               email:\n *                 type: string\n *               password:\n *                 type: string\n *     responses:\n *       200:\n *         description: Logged in successfully\n */\nrouter.post('/register', validate(registerSchema), register);\nrouter.post('/login', validate(loginSchema), login);\nrouter.post('/logout', logout);\nexport { router as authRouter };\n`);
  }

  await writeFile(path.join(src, 'app.ts'), tplAppTs(opts));

  await writeFile(path.join(src, 'server.ts'), tplServerTs(opts.logger));
}
