import path from "node:path";
import type { CliOptions } from "../../types.js";
import type { TemplateManager } from "../../utils/template-manager.js";

export async function generateAuth(
  opts: CliOptions,
  targetDir: string,
  tmpl: TemplateManager,
): Promise<void> {
  if (opts.auth === "none") return;

  const authDir = path.join(targetDir, "src/middleware");

  if (opts.auth === "jwt") {
    await tmpl.renderTemplateFile(
      "features/auth/jwt-auth.middleware.ts.eta",
      path.join(authDir, "auth.middleware.ts"),
    );
  } else if (opts.auth === "session") {
    await tmpl.renderTemplateFile(
      "features/auth/session-auth.middleware.ts.eta",
      path.join(authDir, "auth.middleware.ts"),
    );
  }
}
