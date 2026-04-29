import os from "node:os";
import chalk from "chalk";
import figlet from "figlet";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";

export async function displayBanner(): Promise<void> {
  const username = os.userInfo().username;
  const capitalizedUser =
    username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();

  const welcomeText = figlet.textSync(`WELCOME, ${capitalizedUser}!`, {
    font: "Slant",
    horizontalLayout: "default",
  });

  console.log();
  const rainbow = chalkAnimation.rainbow(welcomeText);

  // Let the rainbow shine for a bit
  await new Promise((resolve) => setTimeout(resolve, 1500));
  rainbow.stop();

  console.log();
  console.log(
    chalk.bold.hex("#7C3AED")(
      "  ────────────────────────────────────────────────────────────────",
    ),
  );
  console.log();
  console.log(
    chalk.bold.hex("#7C3AED")("  ╔══════════════════════════════════════╗"),
  );
  console.log(
    chalk.bold.hex("#7C3AED")("  ║") +
      chalk.bold.white("   ⚡  create-express-forge             ") +
      chalk.bold.hex("#7C3AED")("║"),
  );
  console.log(
    chalk.bold.hex("#7C3AED")("  ║") +
      chalk.dim("   Production-ready backends. Fast.    ") +
      chalk.bold.hex("#7C3AED")("║"),
  );
  console.log(
    chalk.bold.hex("#7C3AED")("  ╚══════════════════════════════════════╝"),
  );
  console.log();
}

export function displaySuccess(
  projectName: string,
  packageManager: string,
  installDeps: boolean,
): void {
  const pm = packageManager;
  const run = pm === "npm" ? "npm run" : pm;

  console.log();
  console.log(
    chalk.bold.green("  ✨  Success! Your project is ready at ") +
      chalk.cyan(`./${projectName}`),
  );
  console.log(
    chalk.dim(
      "  ────────────────────────────────────────────────────────────────",
    ),
  );
  console.log();
  console.log(chalk.bold("  Next steps to get started:\n"));

  let step = 1;
  console.log(chalk.white(`    ${step++}. `) + chalk.cyan(`cd ${projectName}`));

  if (!installDeps) {
    console.log(chalk.white(`    ${step++}. `) + chalk.cyan(`${pm} install`));
  }

  console.log(
    chalk.white(`    ${step++}. `) + chalk.cyan("cp .env.example .env"),
  );
  console.log(chalk.white(`    ${step++}. `) + chalk.cyan(`${run} dev`));

  console.log();
  console.log(chalk.bold("  Useful commands:\n"));
  console.log(
    chalk.white(`    • ${run} build      `) +
      chalk.dim("— Compile the project"),
  );
  console.log(
    chalk.white(`    • ${run} test       `) + chalk.dim("— Run the test suite"),
  );
  console.log(
    chalk.white(`    • ${run} lint       `) + chalk.dim("— Run linting checks"),
  );

  console.log();
  console.log(chalk.bold.hex("#7C3AED")("  Happy building! 🚀\n"));
}

export function displayError(message: string): void {
  console.error(chalk.bold.red(`\n  ❌  ${message}\n`));
}
