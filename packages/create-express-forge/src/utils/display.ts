import chalk from 'chalk';

export function displayBanner(): void {
  console.log();
  console.log(chalk.bold.hex('#7C3AED')('  ╔══════════════════════════════════════╗'));
  console.log(
    chalk.bold.hex('#7C3AED')('  ║') +
      chalk.bold.white('   ⚡  create-express-forge             ') +
      chalk.bold.hex('#7C3AED')('║'),
  );
  console.log(
    chalk.bold.hex('#7C3AED')('  ║') +
      chalk.dim('   Production-ready backends. Fast.    ') +
      chalk.bold.hex('#7C3AED')('║'),
  );
  console.log(chalk.bold.hex('#7C3AED')('  ╚══════════════════════════════════════╝'));
  console.log();
}

export function displaySuccess(projectName: string, installDeps: boolean): void {
  console.log();
  console.log(chalk.bold.green('  ✅  Project scaffolded successfully!\n'));
  console.log(chalk.bold('  Next steps:\n'));
  console.log(chalk.cyan(`    cd ${projectName}`));
  if (!installDeps) console.log(chalk.cyan('    pnpm install'));
  console.log(chalk.cyan('    cp .env.example .env'));
  console.log(chalk.cyan('    npm run dev\n'));
  console.log(chalk.dim('  Happy coding! 🚀\n'));
}

export function displayError(message: string): void {
  console.error(chalk.bold.red(`\n  ❌  ${message}\n`));
}
