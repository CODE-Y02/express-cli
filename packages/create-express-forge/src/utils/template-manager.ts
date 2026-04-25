import type { CliOptions } from '../types.js';

/**
 * Advanced Template Manager to handle code generation with consistency.
 * This avoids giant template strings and allows for more structured logic.
 */
export class TemplateManager {
  constructor(private opts: CliOptions) {}

  renderTodoService(depth = 2): string {
    const rel = '../'.repeat(depth);
    const { orm } = this.opts;

    if (orm === 'prisma') {
      return `import { prisma } from '${rel}config/database.js';
import { ApiError } from '${rel}utils/ApiError.js';

export const TodosService = {
  findAll: async (userId: string) => {
    return prisma.todo.findMany({ where: { userId } });
  },

  findById: async (id: string, userId: string) => {
    const todo = await prisma.todo.findFirst({ where: { id, userId } });
    if (!todo) throw ApiError.notFound('Todo not found');
    return todo;
  },

  create: async (userId: string, data: { title: string; description?: string }) => {
    return prisma.todo.create({
      data: { ...data, userId }
    });
  },

  update: async (id: string, userId: string, data: any) => {
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

    if (orm === 'sequelize') {
      return `import { Todo } from '${rel}models/Todo.model.js';
import { ApiError } from '${rel}utils/ApiError.js';

export const TodosService = {
  findAll: async (userId: string) => {
    return Todo.findAll({ where: { userId } });
  },

  findById: async (id: string, userId: string) => {
    const todo = await Todo.findOne({ where: { id, userId } });
    if (!todo) throw ApiError.notFound('Todo not found');
    return todo;
  },

  create: async (userId: string, data: any) => {
    return Todo.create({ ...data, userId });
  },

  update: async (id: string, userId: string, data: any) => {
    const todo = await Todo.findOne({ where: { id, userId } });
    if (!todo) throw ApiError.notFound('Todo not found');
    return todo.update(data);
  },

  remove: async (id: string, userId: string) => {
    const todo = await Todo.findOne({ where: { id, userId } });
    if (!todo) throw ApiError.notFound('Todo not found');
    return todo.destroy();
  },
};
`;
    }

    return `import { ApiError } from '${rel}utils/ApiError.js';

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

  renderAuthController(depth = 2): string {
    const rel = '../'.repeat(depth);
    const { orm, jwtStorage } = this.opts;

    return `import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { asyncHandler } from '${rel}utils/asyncHandler.js';
import { ApiResponse } from '${rel}utils/ApiResponse.js';
import { ApiError } from '${rel}utils/ApiError.js';
import { env } from '${rel}config/env.js';
${orm === 'prisma' ? `import { prisma } from '${rel}config/database.js';` : ''}
${orm === 'sequelize' ? `import { User } from '${rel}models/User.model.js';` : ''}

export const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  ${
    orm === 'prisma'
      ? `const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw ApiError.conflict('User already exists');

  const user = await prisma.user.create({
    data: { email, name, password: hashedPassword }
  });`
      : orm === 'sequelize'
      ? `const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw ApiError.conflict('User already exists');

  const user = await User.create({ email, name, password: hashedPassword });`
      : `// Demo logic for 'none' or in-memory
  const user = { id: Math.random().toString(36).substring(7), email, name };`
  }

  return ApiResponse.created(res, { id: user.id, email: user.email }, 'User registered successfully');
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  ${
    orm === 'prisma'
      ? `const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }`
      : orm === 'sequelize'
      ? `const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }`
      : `// Demo logic: accept any valid email/password
  const user = { id: 'demo-user-id', email, role: 'USER' };`
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: (user as any).role || 'USER' },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as any }
  );

  ${
    jwtStorage === 'cookie'
      ? `res.cookie('token', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  });`
      : ''
  }

  return ApiResponse.success(res, { 
    user: { id: user.id, email: user.email },
    ${jwtStorage === 'header' ? 'token' : ''}
  }, 'Logged in successfully');
});

export const logout = asyncHandler(async (_req, res) => {
  ${jwtStorage === 'cookie' ? "res.clearCookie('token');" : ''}
  return ApiResponse.success(res, null, 'Logged out successfully');
});
`;
  }

  renderAuthMiddleware(depth = 1): string {
    const rel = '../'.repeat(depth);
    const { jwtStorage } = this.opts;

    return `import jwt from 'jsonwebtoken';
import { asyncHandler } from '${rel}utils/asyncHandler.js';
import { ApiError } from '${rel}utils/ApiError.js';
import { env } from '${rel}config/env.js';

export const auth = asyncHandler(async (req, _res, next) => {
  let token: string | undefined;

  ${
    jwtStorage === 'cookie'
      ? "token = req.cookies?.token;"
      : "if (req.headers.authorization?.startsWith('Bearer ')) { token = req.headers.authorization.split(' ')[1]; }"
  }

  if (!token) {
    throw ApiError.unauthorized('Authentication required');
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err) {
    throw ApiError.unauthorized('Invalid or expired token');
  }
});
`;
  }
}
