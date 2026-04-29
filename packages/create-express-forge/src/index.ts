import { createRequire } from "node:module";
import { Command } from "commander";

const require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const pkg = require("../package.json") as { version: string };

import { runCLI } from "./prompts.js";

const program = new Command();

program
  .name("create-express-forge")
  .description(
    "⚡ Scaffold production-ready Express.js TypeScript backends in seconds",
  )
  .version(pkg.version)
  .option("-y, --yes", "Use default options for all prompts")
  .option("--pattern <pattern>", "Architecture pattern (modular, mvc)")
  .option("--orm <orm>", "ORM to use (prisma, sequelize, none)")
  .option("--db <database>", "Database type (postgresql, mysql, sqlite, none)")
  .option("--logger <logger>", "Logging library (winston, pino, none)")
  .option("--test <testing>", "Testing framework (vitest, jest, none)")
  .option("--docker <docker>", "Include Docker setup (true, false)")
  .option("--install <install>", "Auto-install dependencies (true, false)")
  .argument("[project-name]", "Name of the project")
  .action(
    async (
      projectName?: string,
      options?: Record<string, string | boolean | undefined>,
    ) => {
      await runCLI(projectName, options);
    },
  );

program.parse(process.argv);
