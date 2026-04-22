import type { CliOptions } from '../types.js';

export function buildPackageJson(opts: CliOptions): object {
  const { projectName, orm, database, logger, testing, cache, auth, openapi } = opts;

  const deps: Record<string, string> = {
    express: '^4.19.2',
    cors: '^2.8.5',
    helmet: '^7.1.0',
    compression: '^1.7.4',
    dotenv: '^16.4.5',
    'express-rate-limit': '^7.3.1',
    zod: '^3.23.8',
  };

  const devDeps: Record<string, string> = {
    typescript: '^5.5.3',
    tsx: '^4.15.0',
    tsup: '^8.1.0',
    '@types/node': '^20.14.0',
    '@types/express': '^4.17.21',
    '@types/cors': '^2.8.17',
    '@types/compression': '^1.7.5',
  };

  if (orm === 'prisma') {
    deps['@prisma/client'] = '^5.16.0';
    devDeps['prisma'] = '^5.16.0';
  } else if (orm === 'sequelize') {
    deps['sequelize'] = '^6.37.3';
    deps['sequelize-typescript'] = '^2.1.6';
    deps['reflect-metadata'] = '^0.2.2';
    devDeps['sequelize-cli'] = '^6.6.2';
    if (database === 'postgresql') deps['pg'] = '^8.12.0';
    else if (database === 'mysql') deps['mysql2'] = '^3.10.1';
    else if (database === 'sqlite') deps['sqlite3'] = '^5.1.7';
  }

  if (logger === 'winston') {
    deps['winston'] = '^3.13.0';
    deps['winston-daily-rotate-file'] = '^5.0.0';
  } else if (logger === 'pino') {
    deps['pino'] = '^9.3.1';
    deps['pino-http'] = '^10.2.0';
    devDeps['pino-pretty'] = '^11.2.1';
  }

  if (testing === 'vitest') {
    devDeps['vitest'] = '^1.6.0';
    devDeps['@vitest/coverage-v8'] = '^1.6.0';
    devDeps['supertest'] = '^7.0.0';
    devDeps['@types/supertest'] = '^6.0.2';
  } else if (testing === 'jest') {
    devDeps['jest'] = '^29.7.0';
    devDeps['ts-jest'] = '^29.2.2';
    devDeps['@types/jest'] = '^29.5.12';
    devDeps['supertest'] = '^7.0.0';
    devDeps['@types/supertest'] = '^6.0.2';
  }

  if (cache === 'redis') {
    deps['redis'] = '^4.6.14';
  } else if (cache === 'node-cache') {
    deps['node-cache'] = '^5.1.2';
  }

  if (auth === 'jwt') {
    deps['jsonwebtoken'] = '^9.0.2';
    devDeps['@types/jsonwebtoken'] = '^9.0.6';
  } else if (auth === 'session') {
    deps['express-session'] = '^1.18.0';
    devDeps['@types/express-session'] = '^1.18.0';
  }

  if (openapi) {
    deps['swagger-jsdoc'] = '^6.2.8';
    deps['swagger-ui-express'] = '^5.0.1';
    devDeps['@types/swagger-jsdoc'] = '^6.0.4';
    devDeps['@types/swagger-ui-express'] = '^4.1.6';
  }

  const scripts: Record<string, string> = {
    dev: 'tsx watch src/server.ts',
    build: 'tsup src/server.ts --format esm --dts',
    start: 'node dist/server.js',
    'check-types': 'tsc --noEmit',
    lint: 'tsc --noEmit',
  };

  if (orm === 'prisma') {
    scripts['db:generate'] = 'prisma generate';
    scripts['db:migrate'] = 'prisma migrate dev';
    scripts['db:push'] = 'prisma db push';
    scripts['db:studio'] = 'prisma studio';
    scripts['db:seed'] = 'tsx prisma/seed.ts';
  }

  if (testing === 'vitest') {
    scripts['test'] = 'vitest run';
    scripts['test:watch'] = 'vitest';
    scripts['test:coverage'] = 'vitest run --coverage';
  } else if (testing === 'jest') {
    scripts['test'] = 'jest';
    scripts['test:watch'] = 'jest --watch';
    scripts['test:coverage'] = 'jest --coverage';
  }

  return {
    name: projectName,
    version: '0.1.0',
    description: '',
    type: 'module',
    scripts,
    dependencies: deps,
    devDependencies: devDeps,
    engines: { node: '>=18.0.0' },
  };
}
