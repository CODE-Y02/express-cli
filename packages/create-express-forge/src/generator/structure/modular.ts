import path from 'path';
import type { CliOptions } from '../../types.js';
import { writeFile } from '../../utils/file.js';
import {
  tplEnvConfig, tplApiError, tplApiResponse, tplAsyncHandler,
  tplErrorHandler, tplNotFound, tplRateLimiter, tplValidate,
  tplExpressTypes, tplServerTs, tplAppTs,
} from '../templates.js';
import { TemplateManager } from '../../utils/template-manager.js';

export async function generateModularStructure(opts: CliOptions, dir: string): Promise<void> {
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

  // Health module
  await writeFile(path.join(src, 'modules', 'health', 'health.routes.ts'),
    `import { Router } from 'express';\nimport { getHealth } from './health.controller.js';\nconst router = Router();\n/**\n * @openapi\n * /api/health:\n *   get:\n *     tags:\n *       - Health\n *     description: Responds if the app is up and running\n *     responses:\n *       200:\n *         description: App is up and running\n */\nrouter.get('/', getHealth);\nexport { router as healthRouter };\n`);
  await writeFile(path.join(src, 'modules', 'health', 'health.controller.ts'),
    `import type { Request, Response } from 'express';\nimport { ApiResponse } from '../../utils/ApiResponse.js';\nexport const getHealth = (_req: Request, res: Response) =>\n  ApiResponse.success(res, { status: 'ok', timestamp: new Date().toISOString() }, 'Service healthy');\n`);

  // Todos module
  await writeFile(path.join(src, 'modules', 'todos', 'todos.schema.ts'),
    `import { z } from 'zod';\n\nexport const createTodoSchema = z.object({\n  body: z.object({\n    title: z.string().min(1).max(100),\n    description: z.string().max(500).optional(),\n  }),\n});\n\nexport const updateTodoSchema = z.object({\n  params: z.object({ id: z.string() }),\n  body: z.object({\n    title: z.string().min(1).max(100).optional(),\n    description: z.string().max(500).optional(),\n    completed: z.boolean().optional(),\n  }),\n});\n\nexport type CreateTodoDto = z.infer<typeof createTodoSchema>['body'];\nexport type UpdateTodoDto = z.infer<typeof updateTodoSchema>['body'];\n`);

  await writeFile(path.join(src, 'modules', 'todos', 'todos.service.ts'),
    `import { ApiError } from '../../utils/ApiError.js';\n\nexport interface Todo { id: string; title: string; description?: string; completed: boolean; ${opts.auth === 'none' ? '' : 'userId: string; '}}\n\nconst store: Todo[] = [];\n\nexport const TodosService = {\n  findAll: async (${opts.auth === 'none' ? '' : 'userId: string'}) => store${opts.auth === 'none' ? '' : '.filter(t => t.userId === userId)'},\n  findById: async (id: string${opts.auth === 'none' ? '' : ', userId: string'}) => {\n    const todo = store.find((t) => t.id === id${opts.auth === 'none' ? '' : ' && t.userId === userId'});\n    if (!todo) throw ApiError.notFound('Todo not found');\n    return todo;\n  },\n  create: async (data: Omit<Todo, 'id'>) => {\n    const todo = { id: Math.random().toString(36).substring(7), ...data };\n    store.push(todo);\n    return todo;\n  },\n  update: async (id: string, ${opts.auth === 'none' ? '' : 'userId: string, '}data: Partial<Todo>) => {\n    const todo = store.find((t) => t.id === id${opts.auth === 'none' ? '' : ' && t.userId === userId'});\n    if (!todo) throw ApiError.notFound('Todo not found');\n    Object.assign(todo, data);\n    return todo;\n  },\n  remove: async (id: string${opts.auth === 'none' ? '' : ', userId: string'}) => {\n    const idx = store.findIndex((t) => t.id === id${opts.auth === 'none' ? '' : ' && t.userId === userId'});\n    if (idx === -1) throw ApiError.notFound('Todo not found');\n    store.splice(idx, 1);\n  },\n};\n`);

  await writeFile(path.join(src, 'modules', 'todos', 'todos.controller.ts'),
    `import type { Request, Response } from 'express';\nimport { asyncHandler } from '../../utils/asyncHandler.js';\nimport { ApiResponse } from '../../utils/ApiResponse.js';\nimport { TodosService } from './todos.service.js';\nimport type { CreateTodoDto, UpdateTodoDto } from './todos.schema.js';\n\nexport const getTodos = asyncHandler(async (req, res: Response) => {\n  const todos = await TodosService.findAll(${opts.auth === 'none' ? '' : "req.user?.id || 'guest'"});\n  return ApiResponse.success(res, todos, 'Todos fetched');\n});\n\nexport const getTodoById = asyncHandler(async (req: Request, res: Response) => {\n  const todo = await TodosService.findById(req.params.id || ''${opts.auth === 'none' ? '' : ", req.user?.id || 'guest'"});\n  return ApiResponse.success(res, todo);\n});\n\nexport const createTodo = asyncHandler(async (req: Request, res: Response) => {\n  const todo = await TodosService.create({ ...(req.body as CreateTodoDto), completed: false${opts.auth === 'none' ? '' : ", userId: req.user?.id || 'guest'" } });\n  return ApiResponse.created(res, todo, 'Todo created');\n});\n\nexport const updateTodo = asyncHandler(async (req: Request, res: Response) => {\n  const todo = await TodosService.update(req.params.id || '', ${opts.auth === 'none' ? '' : "req.user?.id || 'guest', "}req.body as UpdateTodoDto);\n  return ApiResponse.success(res, todo, 'Todo updated');\n});\n\nexport const deleteTodo = asyncHandler(async (req: Request, res: Response) => {\n  await TodosService.remove(req.params.id || ''${opts.auth === 'none' ? '' : ", req.user?.id || 'guest'"});\n  return ApiResponse.noContent(res);\n});\n`);

  await writeFile(path.join(src, 'modules', 'todos', 'todos.routes.ts'),
    `import { Router } from 'express';\nimport { getTodos, getTodoById, createTodo, updateTodo, deleteTodo } from './todos.controller.js';\nimport { validate } from '../../middleware/validate.js';\nimport { createTodoSchema, updateTodoSchema } from './todos.schema.js';\n${opts.auth !== 'none' ? "import { auth } from '../../middleware/auth.middleware.js';\n" : ""}
const router = Router();
${opts.auth !== 'none' ? 'router.use(auth);' : ''}

/**
 * @openapi
 * /api/v1/todos:
 *   get:
 *     tags:
 *       - Todos
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     tags:
 *       - Todos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.get('/', getTodos);
router.get('/:id', getTodoById);
router.post('/', validate(createTodoSchema), createTodo);
router.patch('/:id', validate(updateTodoSchema), updateTodo);
router.delete('/:id', deleteTodo);
export { router as todosRouter };\n`);

  if (opts.auth === 'jwt') {
    await writeFile(path.join(src, 'modules', 'auth', 'auth.schema.ts'),
      `import { z } from 'zod';\nexport const loginSchema = z.object({ body: z.object({ email: z.string().email(), password: z.string().min(8) }) });\n`);
    await writeFile(path.join(src, 'modules', 'auth', 'auth.controller.ts'),
      `import type { Request, Response } from 'express';\nimport jwt from 'jsonwebtoken';\nimport { asyncHandler } from '../../utils/asyncHandler.js';\nimport { ApiResponse } from '../../utils/ApiResponse.js';\nimport { env } from '../../config/env.js';\n\nexport const login = asyncHandler(async (req, res) => {\n  // Demo logic: accept any valid email/password\n  const token = jwt.sign({ email: req.body.email }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });\n  ${opts.jwtStorage === 'cookie' ? "res.cookie('token', token, { httpOnly: true, secure: env.NODE_ENV === 'production' });\n  return ApiResponse.success(res, { token }, 'Logged in successfully');" : "return ApiResponse.success(res, { token }, 'Logged in successfully');"}\n});\n`);
    await writeFile(path.join(src, 'modules', 'auth', 'auth.routes.ts'),
      `import { Router } from 'express';\nimport { login } from './auth.controller.js';\nimport { validate } from '../../middleware/validate.js';\nimport { loginSchema } from './auth.schema.js';\nconst router = Router();\n/**\n * @openapi\n * /api/v1/auth/login:\n *   post:\n *     tags:\n *       - Auth\n *     requestBody:\n *       required: true\n *       content:\n *         application/json:\n *           schema:\n *             type: object\n *             required: [email, password]\n *             properties:\n *               email:\n *                 type: string\n *               password:\n *                 type: string\n *     responses:\n *       200:\n *         description: Logged in successfully\n */\nrouter.post('/login', validate(loginSchema), login);\nexport { router as authRouter };\n`);
  }

  await writeFile(path.join(src, 'app.ts'), tplAppTs(opts));

  await writeFile(path.join(src, 'server.ts'), tplServerTs(opts.logger));
}
