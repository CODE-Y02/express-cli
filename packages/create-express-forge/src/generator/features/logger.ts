import path from "node:path";
import type { CliOptions } from "../../types.js";
import type { TemplateManager } from "../../utils/template-manager.js";

export async function generateLogger(
  opts: CliOptions,
  dir: string,
  tmpl: TemplateManager,
): Promise<void> {
  const loggerDir = path.join(dir, "src", "logger");

  if (opts.logger === "winston") {
    await tmpl.renderTemplateFile(
      "features/logger/winston.ts.eta",
      path.join(loggerDir, "index.ts"),
    );
  } else if (opts.logger === "pino") {
    await tmpl.renderTemplateFile(
      "features/logger/pino.ts.eta",
      path.join(loggerDir, "index.ts"),
    );
    await tmpl.renderTemplateFile(
      "features/logger/pino.ts.eta",
      path.join(dir, "src", "middleware", "httpLogger.ts"),
    );
  }
}
