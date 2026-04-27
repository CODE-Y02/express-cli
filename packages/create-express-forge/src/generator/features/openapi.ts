import path from "node:path";
import type { CliOptions } from "../../types.js";
import type { TemplateManager } from "../../utils/template-manager.js";

export async function generateOpenApi(
  opts: CliOptions,
  targetDir: string,
  tmpl: TemplateManager,
): Promise<void> {
  if (!opts.openapi) return;

  const docsDir = path.join(targetDir, "src/docs");
  await tmpl.renderTemplateFile(
    "features/openapi/swagger.ts.eta",
    path.join(docsDir, "swagger.ts"),
  );
  await tmpl.renderTemplateFile(
    "features/openapi/registry.ts.eta",
    path.join(docsDir, "registry.ts"),
  );
}
