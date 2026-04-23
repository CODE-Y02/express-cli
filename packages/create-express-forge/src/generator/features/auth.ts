import path from 'path';
import fs from 'fs-extra';
import type { CliOptions } from '../../types.js';

export async function generateAuth(opts: CliOptions, targetDir: string): Promise<void> {
  if (opts.auth === 'none') return;

  const authDir = path.join(targetDir, 'src/middleware');
  await fs.ensureDir(authDir);

  if (opts.auth === 'jwt') {
    const isCookie = opts.jwtStorage === 'cookie';
    await fs.writeFile(
      path.join(authDir, 'auth.middleware.ts'),
      `import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

export const auth = (req: Request, _res: Response, next: NextFunction) => {
  let token: string | undefined;

  ${
    isCookie
      ? "token = req.cookies?.token;"
      : `const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }`
  }

  if (!token) {
    return next(ApiError.unauthorized('No token provided'));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
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
