import path from "node:path";
import chalk from "chalk";
import { execa } from "execa";
import fs from "fs-extra";
import ora from "ora";
import type { CliOptions } from "../types.js";
import { displayError, displaySuccess } from "../utils/display.js";
import { writeJson } from "../utils/file.js";
import { buildPackageJson } from "../utils/package-builder.js";
import { generateBaseFiles } from "./base.js";
import { generateAuth } from "./features/auth.js";
import { generateCache } from "./features/cache.js";
import { generateDocker } from "./features/docker.js";
import { generateLogger } from "./features/logger.js";
import { generateOpenApi } from "./features/openapi.js";
import { generatePrisma } from "./features/prisma.js";
import { generateSequelize } from "./features/sequelize.js";
import { generateTesting } from "./features/testing.js";
import { generateModularStructure } from "./structure/modular.js";
import { generateMvcStructure } from "./structure/mvc.js";

export async function generateProject(
  opts: CliOptions,
  targetDir: string,
): Promise<void> {
  const spinner = ora();

  if (await fs.pathExists(targetDir)) {
    const files = await fs.readdir(targetDir);
    if (files.length > 0) {
      displayError(
        `Directory "${opts.projectName}" already exists and is not empty.`,
      );
      process.exit(1);
    }
  }

  await fs.ensureDir(targetDir);
  console.log();

  try {
    spinner.start(chalk.dim("Creating package.json..."));
    await writeJson(
      path.join(targetDir, "package.json"),
      buildPackageJson(opts),
    );
    spinner.succeed(chalk.green("package.json"));

    const { TemplateManager } = await import("../utils/template-manager.js");
    const tmpl = new TemplateManager(opts);

    spinner.start(chalk.dim("Setting up base config..."));
    await generateBaseFiles(opts, targetDir, tmpl);
    spinner.succeed(chalk.green("Base config files"));

    spinner.start(chalk.dim(`Scaffolding ${opts.pattern} architecture...`));
    if (opts.pattern === "modular") {
      await generateModularStructure(opts, targetDir, tmpl);
    } else {
      await generateMvcStructure(opts, targetDir, tmpl);
    }
    spinner.succeed(chalk.green(`${opts.pattern.toUpperCase()} architecture`));

    if (opts.orm === "prisma") {
      spinner.start(chalk.dim("Configuring Prisma..."));
      await generatePrisma(opts, targetDir, tmpl);
      spinner.succeed(chalk.green("Prisma"));
    } else if (opts.orm === "sequelize") {
      spinner.start(chalk.dim("Configuring Sequelize..."));
      await generateSequelize(opts, targetDir, tmpl);
      spinner.succeed(chalk.green("Sequelize"));
    }

    if (opts.logger !== "none") {
      spinner.start(chalk.dim(`Configuring ${opts.logger}...`));
      await generateLogger(opts, targetDir, tmpl);
      spinner.succeed(chalk.green(`${opts.logger} logger`));
    }

    if (opts.testing !== "none") {
      spinner.start(chalk.dim(`Configuring ${opts.testing}...`));
      await generateTesting(opts, targetDir, tmpl);
      spinner.succeed(chalk.green(opts.testing));
    }

    if (opts.docker) {
      spinner.start(chalk.dim("Adding Docker files..."));
      await generateDocker(opts, targetDir, tmpl);
      spinner.succeed(chalk.green("Docker + docker-compose"));
    }

    if (opts.auth !== "none") {
      spinner.start(chalk.dim(`Configuring ${opts.auth} authentication...`));
      await generateAuth(opts, targetDir, tmpl);
      spinner.succeed(chalk.green(`${opts.auth.toUpperCase()} Auth`));
    }

    if (opts.cache !== "none") {
      spinner.start(chalk.dim(`Configuring ${opts.cache} caching...`));
      await generateCache(opts, targetDir, tmpl);
      spinner.succeed(chalk.green(`${opts.cache.toUpperCase()} Cache`));
    }

    if (opts.openapi) {
      spinner.start(chalk.dim("Generating OpenAPI docs..."));
      await generateOpenApi(opts, targetDir, tmpl);
      spinner.succeed(chalk.green("OpenAPI (Swagger)"));
    }

    if (!opts.skipPolish) {
      // Final polish: Format everything with Biome
      spinner.start(chalk.dim("Polishing code with Biome..."));
      try {
        await execa(
          "npx",
          ["--yes", "@biomejs/biome@2.4.13", "format", "--write", "."],
          { cwd: targetDir },
        );
        spinner.succeed(chalk.green("Code polished and formatted"));
      } catch (_err) {
        spinner.warn(chalk.yellow("Polishing skipped (Biome failed)"));
      }
    }

    if (opts.installDeps) {
      spinner.start(
        chalk.dim(`Installing dependencies with ${opts.packageManager}...`),
      );
      try {
        await execa(opts.packageManager, ["install"], {
          cwd: targetDir,
          env: { ...process.env, NODE_ENV: undefined }, // Ensure we install devDeps
        });
        spinner.succeed(chalk.green("Dependencies installed"));
      } catch (err) {
        spinner.fail(
          chalk.red(
            `Failed to install dependencies with ${opts.packageManager}`,
          ),
        );
        console.error(chalk.dim((err as Error).message));
        throw err;
      }

      if (opts.orm === "prisma") {
        spinner.start(chalk.dim("Generating Prisma client..."));
        try {
          // Use npx --yes to ensure it runs without prompts and is reliable across environments
          await execa("npx", ["--yes", "prisma", "generate"], {
            cwd: targetDir,
          });
          spinner.succeed(chalk.green("Prisma client generated"));
        } catch (_err) {
          spinner.warn(
            chalk.yellow(
              "Prisma client generation skipped (manual run required)",
            ),
          );
          console.log(
            chalk.dim(
              '  You can run "npx prisma generate" manually once your network is stable.',
            ),
          );
        }
      }
    }

    displaySuccess(opts.projectName, opts.packageManager, opts.installDeps);
  } catch (err) {
    spinner.fail(chalk.red("Scaffolding failed"));
    displayError((err as Error).message);
    process.exit(1);
  }
}
