import { Command } from 'commander';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const pkg = require('../package.json') as { version: string };

import { runCLI } from './prompts.js';

const program = new Command();

program
  .name('create-express-forge')
  .description('⚡ Scaffold production-ready Express.js TypeScript backends in seconds')
  .version(pkg.version)
  .option('-y, --yes', 'Use default options for all prompts')
  .argument('[project-name]', 'Name of the project')
  .action(async (projectName?: string, options?: { yes?: boolean }) => {
    await runCLI(projectName, options?.yes);
  });

program.parse(process.argv);
