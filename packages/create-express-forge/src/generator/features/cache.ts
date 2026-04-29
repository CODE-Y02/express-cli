import path from "node:path";
import type { CliOptions } from "../../types.js";
import type { TemplateManager } from "../../utils/template-manager.js";

export async function generateCache(
  opts: CliOptions,
  targetDir: string,
  tmpl: TemplateManager,
): Promise<void> {
  if (opts.cache === "none") return;

  const cacheDir = path.join(targetDir, "src/cache");

  if (opts.cache === "redis") {
    await tmpl.renderTemplateFile(
      "features/cache/redis.ts.eta",
      path.join(cacheDir, "index.ts"),
    );
  } else if (opts.cache === "node-cache") {
    await tmpl.renderTemplateFile(
      "features/cache/node-cache.ts.eta",
      path.join(cacheDir, "index.ts"),
    );
  }
}
