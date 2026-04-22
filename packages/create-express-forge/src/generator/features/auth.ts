import path from 'path';
import fs from 'fs-extra';
import type { CliOptions } from '../../types.js';

export async function generateAuth(opts: CliOptions, targetDir: string): Promise<void> {
  if (opts.auth === 'none') return;

  const authDir = path.join(targetDir, 'src/middlewares');
  await fs.ensureDir(authDir);

  if (opts.auth === 'jwt') {
    await fs.writeFile(
      path.join(authDir, 'auth.middleware.ts'),
      `import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

export const auth = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('No token provided'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded as any;
    next();
  } catch (err) {
    next(ApiError.unauthorized('Invalid or expired token'));
  }
};
`
    );
  } else if (opts.auth === 'session') {
    await fs.writeFile(
      path.join(authDir, 'auth.middleware.ts'),
      `import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';

export const auth = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.session || !(req.session as any).user) {
    return next(ApiError.unauthorized('Session expired or invalid'));
  }
  next();
};
`
    );
  }
}
