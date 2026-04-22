import { input, select, confirm } from '@inquirer/prompts';
import path from 'path';
import type { CliOptions } from './types.js';
import { displayBanner } from './utils/display.js';
import { generateProject } from './generator/index.js';

export async function runCLI(initialProjectName?: string) {
  displayBanner();

  const projectName =
    initialProjectName ??
    (await input({
      message: 'Project name:',
      default: 'my-express-app',
      validate: (v) =>
        /^[a-z0-9-_]+$/.test(v)
          ? true
          : 'Use lowercase letters, numbers, hyphens, or underscores',
    }));

  const pattern = await select<CliOptions['pattern']>({
    message: 'Architecture pattern:',
    choices: [
      { name: '📦  Modular  — feature-based modules (recommended)', value: 'modular' },
      { name: '🏗️   MVC     — Model / View / Controller', value: 'mvc' },
    ],
  });

  const orm = await select<CliOptions['orm']>({
    message: 'ORM / Database layer:',
    choices: [
      { name: '🔷  Prisma      (type-safe, modern — recommended)', value: 'prisma' },
      { name: '🔶  Sequelize   (battle-tested)', value: 'sequelize' },
      { name: '⬜  None        (configure later)', value: 'none' },
    ],
  });

  const database: CliOptions['database'] =
    orm !== 'none'
      ? await select<CliOptions['database']>({
          message: 'Database:',
          choices: [
            { name: '🐘  PostgreSQL', value: 'postgresql' },
            { name: '🐬  MySQL', value: 'mysql' },
            { name: '🪶  SQLite', value: 'sqlite' },
            { name: '⬜  None (configure later)', value: 'none' },
          ],
        })
      : 'none';

  const logger = await select<CliOptions['logger']>({
    message: 'Logger:',
    choices: [
      { name: '🪵  Winston   (feature-rich, transport-based)', value: 'winston' },
      { name: '⚡  Pino      (ultra-fast, low-overhead)', value: 'pino' },
      { name: '⬜  None      (console.log)', value: 'none' },
    ],
  });

  const testing = await select<CliOptions['testing']>({
    message: 'Testing framework:',
    choices: [
      { name: '⚡  Vitest   (fast, ESM-native — recommended)', value: 'vitest' },
      { name: '🃏  Jest     (widely-used)', value: 'jest' },
      { name: '⬜  None', value: 'none' },
    ],
  });

  const auth = await select<CliOptions['auth']>({
    message: 'Authentication strategy:',
    choices: [
      { name: '🔐  JWT       (stateless, token-based — recommended)', value: 'jwt' },
      { name: '🍪  Session   (stateful, cookie-based)', value: 'session' },
      { name: '⬜  None', value: 'none' },
    ],
  });

  const cache = await select<CliOptions['cache']>({
    message: 'Caching layer:',
    choices: [
      { name: '🔴  Redis      (distributed, high-performance)', value: 'redis' },
      { name: '💾  Node-Cache (simple, in-memory)', value: 'node-cache' },
      { name: '⬜  None', value: 'none' },
    ],
  });

  const openapi = await confirm({ message: 'Add OpenAPI (Swagger) documentation?', default: true });

  const docker = await confirm({ message: 'Add Docker + docker-compose?', default: true });
  const installDeps = await confirm({ message: 'Install dependencies now?', default: true });

  const options: CliOptions = {
    projectName,
    pattern,
    orm,
    database,
    logger,
    testing,
    auth,
    cache,
    openapi,
    docker,
    installDeps,
  };

  const targetDir = path.resolve(process.cwd(), projectName);
  await generateProject(options, targetDir);
}
