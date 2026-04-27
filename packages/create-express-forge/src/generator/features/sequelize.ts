import path from "node:path";
import type { CliOptions } from "../../types.js";
import type { TemplateManager } from "../../utils/template-manager.js";

export async function generateSequelize(
  opts: CliOptions,
  dir: string,
  tmpl: TemplateManager,
): Promise<void> {
  await tmpl.renderTemplateFile(
    "features/sequelize/.sequelizerc.eta",
    path.join(dir, ".sequelizerc"),
  );
  await tmpl.renderTemplateFile(
    "features/sequelize/sequelize.cjs.eta",
    path.join(dir, "src", "config", "sequelize.cjs"),
  );
  await tmpl.renderTemplateFile(
    "features/sequelize/database.ts.eta",
    path.join(dir, "src", "config", "database.ts"),
  );

  if (opts.auth !== "none") {
    await tmpl.renderTemplateFile(
      "features/sequelize/User.ts.eta",
      path.join(dir, "src", "models", "User.ts"),
    );
  }
}
