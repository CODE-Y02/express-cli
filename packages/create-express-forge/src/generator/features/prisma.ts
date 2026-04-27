import path from "node:path";
import type { CliOptions } from "../../types.js";
import type { TemplateManager } from "../../utils/template-manager.js";

export async function generatePrisma(
  _opts: CliOptions,
  dir: string,
  tmpl: TemplateManager,
): Promise<void> {
  // We no longer need to run `npx prisma init` during scaffolding which slows it down.
  // We just copy the configured files directly.

  await tmpl.renderTemplateFile(
    "features/prisma/schema.prisma.eta",
    path.join(dir, "prisma", "schema.prisma"),
  );
  await tmpl.renderTemplateFile(
    "features/prisma/seed.ts.eta",
    path.join(dir, "prisma", "seed.ts"),
  );
  await tmpl.renderTemplateFile(
    "features/prisma/database.ts.eta",
    path.join(dir, "src", "config", "database.ts"),
  );
}
