import path from "node:path";
import type { CliOptions } from "../types.js";
import type { TemplateManager } from "../utils/template-manager.js";

export async function generateBaseFiles(
  _opts: CliOptions,
  dir: string,
  tmpl: TemplateManager,
): Promise<void> {
  const src = path.join(dir, "src");

  // Root files
  await tmpl.renderTemplateFile(
    "base/tsconfig.json.eta",
    path.join(dir, "tsconfig.json"),
  );
  await tmpl.renderTemplateFile(
    "base/.gitignore.eta",
    path.join(dir, ".gitignore"),
  );
  await tmpl.renderTemplateFile(
    "base/.env.example.eta",
    path.join(dir, ".env.example"),
  );
  await tmpl.renderTemplateFile(
    "base/.env.example.eta",
    path.join(dir, ".env"),
  );
  await tmpl.renderTemplateFile(
    "base/README.md.eta",
    path.join(dir, "README.md"),
  );

  // Core src files
  await tmpl.renderTemplateFile(
    "base/src/app.ts.eta",
    path.join(src, "app.ts"),
  );
  await tmpl.renderTemplateFile(
    "base/src/server.ts.eta",
    path.join(src, "server.ts"),
  );

  // Config
  await tmpl.renderTemplateFile(
    "base/src/config/env.ts.eta",
    path.join(src, "config", "env.ts"),
  );

  // Utils
  await tmpl.renderTemplateFile(
    "base/src/utils/ApiError.ts.eta",
    path.join(src, "utils", "ApiError.ts"),
  );
  await tmpl.renderTemplateFile(
    "base/src/utils/ApiResponse.ts.eta",
    path.join(src, "utils", "ApiResponse.ts"),
  );

  // Middleware
  await tmpl.renderTemplateFile(
    "base/src/middleware/errorHandler.ts.eta",
    path.join(src, "middleware", "errorHandler.ts"),
  );
  await tmpl.renderTemplateFile(
    "base/src/middleware/notFound.ts.eta",
    path.join(src, "middleware", "notFound.ts"),
  );
  await tmpl.renderTemplateFile(
    "base/src/middleware/rateLimiter.ts.eta",
    path.join(src, "middleware", "rateLimiter.ts"),
  );
  await tmpl.renderTemplateFile(
    "base/src/middleware/validate.ts.eta",
    path.join(src, "middleware", "validate.ts"),
  );

  // Types
  await tmpl.renderTemplateFile(
    "base/src/types/express.d.ts.eta",
    path.join(src, "types", "express.d.ts"),
  );
}
