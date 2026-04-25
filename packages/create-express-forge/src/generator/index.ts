import ora from 'ora';
import chalk from 'chalk';
import path from 'path';
import { execa } from 'execa';
import fs from 'fs-extra';
import type { CliOptions } from '../types.js';
import { writeJson } from '../utils/file.js';
import { buildPackageJson } from '../utils/package-builder.js';
import { displaySuccess, displayError } from '../utils/display.js';
import { generateBaseFiles } from './base.js';
import { generateModularStructure } from './structure/modular.js';
import { generateMvcStructure } from './structure/mvc.js';
import { generatePrisma } from './features/prisma.js';
import { generateSequelize } from './features/sequelize.js';
import { generateLogger } from './features/logger.js';
import { generateTesting } from './features/testing.js';
import { generateDocker } from './features/docker.js';
import { generateAuth } from './features/auth.js';
import { generateCache } from './features/cache.js';
import { generateOpenApi } from './features/openapi.js';

export async function generateProject(opts: CliOptions, targetDir: string): Promise<void> {
  const spinner = ora();

  if (await fs.pathExists(targetDir)) {
    const files = await fs.readdir(targetDir);
    if (files.length > 0) {
      displayError(`Directory "${opts.projectName}" already exists and is not empty.`);
      process.exit(1);
    }
  }

  await fs.ensureDir(targetDir);
  console.log();

  try {
    spinner.start(chalk.dim('Creating package.json...'));
    await writeJson(path.join(targetDir, 'package.json'), buildPackageJson(opts));
    spinner.succeed(chalk.green('package.json'));

    spinner.start(chalk.dim('Setting up base config...'));
    await generateBaseFiles(opts, targetDir);
    spinner.succeed(chalk.green('Base config files'));

    spinner.start(chalk.dim(`Scaffolding ${opts.pattern} architecture...`));
    if (opts.pattern === 'modular') {
      await generateModularStructure(opts, targetDir);
    } else {
      await generateMvcStructure(opts, targetDir);
    }
    spinner.succeed(chalk.green(`${opts.pattern.toUpperCase()} architecture`));

    if (opts.orm === 'prisma') {
      spinner.start(chalk.dim('Configuring Prisma...'));
      await generatePrisma(opts, targetDir);
      spinner.succeed(chalk.green('Prisma'));
    } else if (opts.orm === 'sequelize') {
      spinner.start(chalk.dim('Configuring Sequelize...'));
      await generateSequelize(opts, targetDir);
      spinner.succeed(chalk.green('Sequelize'));
    }

    if (opts.logger !== 'none') {
      spinner.start(chalk.dim(`Configuring ${opts.logger}...`));
      await generateLogger(opts, targetDir);
      spinner.succeed(chalk.green(`${opts.logger} logger`));
    }

    if (opts.testing !== 'none') {
      spinner.start(chalk.dim(`Configuring ${opts.testing}...`));
      await generateTesting(opts, targetDir);
      spinner.succeed(chalk.green(opts.testing));
    }

    if (opts.docker) {
      spinner.start(chalk.dim('Adding Docker files...'));
      await generateDocker(opts, targetDir);
      spinner.succeed(chalk.green('Docker + docker-compose'));
    }

    if (opts.auth !== 'none') {
      spinner.start(chalk.dim(`Configuring ${opts.auth} authentication...`));
      await generateAuth(opts, targetDir);
      spinner.succeed(chalk.green(`${opts.auth.toUpperCase()} Auth`));
    }

    if (opts.cache !== 'none') {
      spinner.start(chalk.dim(`Configuring ${opts.cache} caching...`));
      await generateCache(opts, targetDir);
      spinner.succeed(chalk.green(`${opts.cache.toUpperCase()} Cache`));
    }

    if (opts.openapi) {
      spinner.start(chalk.dim('Generating OpenAPI docs...'));
      await generateOpenApi(opts, targetDir);
      spinner.succeed(chalk.green('OpenAPI (Swagger)'));
    }

    if (opts.installDeps) {
      spinner.start(chalk.dim(`Installing dependencies with ${opts.packageManager}...`));
      await execa(opts.packageManager, ['install'], { cwd: targetDir });
      spinner.succeed(chalk.green('Dependencies installed'));

      if (opts.orm === 'prisma') {
        spinner.start(chalk.dim('Generating Prisma client...'));
        try {
          const npxCmd = opts.packageManager === 'bun' ? 'bunx' : opts.packageManager === 'pnpm' ? 'pnpm' : 'npx';
          const args = opts.packageManager === 'pnpm' ? ['exec', 'prisma', 'generate'] : ['prisma', 'generate'];
          await execa(npxCmd, args, { cwd: targetDir });
          spinner.succeed(chalk.green('Prisma client generated'));
        } catch (err) {
          spinner.warn(chalk.yellow('Prisma client generation skipped (network/env issue)'));
          console.log(chalk.dim('  You can run "npx prisma generate" manually once your network is stable.'));
        }
      }
    }

    displaySuccess(opts.projectName, opts.packageManager, opts.installDeps);
  } catch (err) {
    spinner.fail(chalk.red('Scaffolding failed'));
    displayError((err as Error).message);
    process.exit(1);
  }
}
