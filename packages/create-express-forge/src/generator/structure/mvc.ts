import path from "node:path";
import type { CliOptions } from "../../types.js";
import type { TemplateManager } from "../../utils/template-manager.js";

export async function generateMvcStructure(
  opts: CliOptions,
  dir: string,
  tmpl: TemplateManager,
): Promise<void> {
  const src = path.join(dir, "src");

  if (opts.auth !== "none") {
    await tmpl.renderTemplateFile(
      "features/auth/jwt-auth.middleware.ts.eta",
      path.join(src, "middleware", "auth.middleware.ts"),
    );
  }

  await tmpl.renderTemplateFile(
    "structure/mvc/schemas/health.schema.ts.eta",
    path.join(src, "schemas", "health.schema.ts"),
  );
  await tmpl.renderTemplateFile(
    "structure/mvc/schemas/todo.schema.ts.eta",
    path.join(src, "schemas", "todo.schema.ts"),
  );
  await tmpl.renderTemplateFile(
    "structure/mvc/services/todo.service.ts.eta",
    path.join(src, "services", "todo.service.ts"),
  );
  await tmpl.renderTemplateFile(
    "structure/mvc/controllers/health.controller.ts.eta",
    path.join(src, "controllers", "health.controller.ts"),
  );
  await tmpl.renderTemplateFile(
    "structure/mvc/controllers/todo.controller.ts.eta",
    path.join(src, "controllers", "todo.controller.ts"),
  );
  await tmpl.renderTemplateFile(
    "structure/mvc/routes/index.ts.eta",
    path.join(src, "routes", "index.ts"),
  );
  await tmpl.renderTemplateFile(
    "structure/mvc/routes/health.routes.ts.eta",
    path.join(src, "routes", "health.routes.ts"),
  );
  await tmpl.renderTemplateFile(
    "structure/mvc/routes/todo.routes.ts.eta",
    path.join(src, "routes", "todo.routes.ts"),
  );

  if (opts.auth === "jwt") {
    await tmpl.renderTemplateFile(
      "structure/mvc/schemas/auth.schema.ts.eta",
      path.join(src, "schemas", "auth.schema.ts"),
    );
    await tmpl.renderTemplateFile(
      "structure/mvc/controllers/auth.controller.ts.eta",
      path.join(src, "controllers", "auth.controller.ts"),
    );
    await tmpl.renderTemplateFile(
      "structure/mvc/routes/auth.routes.ts.eta",
      path.join(src, "routes", "auth.routes.ts"),
    );
  }
}
