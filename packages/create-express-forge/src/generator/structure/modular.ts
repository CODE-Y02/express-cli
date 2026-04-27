import path from "node:path";
import type { CliOptions } from "../../types.js";
import type { TemplateManager } from "../../utils/template-manager.js";

export async function generateModularStructure(
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

  // Health module
  await tmpl.renderTemplateFile(
    "structure/modular/modules/health/health.schema.ts.eta",
    path.join(src, "modules", "health", "health.schema.ts"),
  );
  await tmpl.renderTemplateFile(
    "structure/modular/modules/health/health.routes.ts.eta",
    path.join(src, "modules", "health", "health.routes.ts"),
  );
  await tmpl.renderTemplateFile(
    "structure/modular/modules/health/health.controller.ts.eta",
    path.join(src, "modules", "health", "health.controller.ts"),
  );

  // Todos module
  await tmpl.renderTemplateFile(
    "structure/modular/modules/todos/todos.schema.ts.eta",
    path.join(src, "modules", "todos", "todos.schema.ts"),
  );
  await tmpl.renderTemplateFile(
    "structure/modular/modules/todos/todos.service.ts.eta",
    path.join(src, "modules", "todos", "todos.service.ts"),
  );
  await tmpl.renderTemplateFile(
    "structure/modular/modules/todos/todos.controller.ts.eta",
    path.join(src, "modules", "todos", "todos.controller.ts"),
  );
  await tmpl.renderTemplateFile(
    "structure/modular/modules/todos/todos.routes.ts.eta",
    path.join(src, "modules", "todos", "todos.routes.ts"),
  );

  if (opts.auth === "jwt") {
    await tmpl.renderTemplateFile(
      "structure/modular/modules/auth/auth.schema.ts.eta",
      path.join(src, "modules", "auth", "auth.schema.ts"),
    );
    await tmpl.renderTemplateFile(
      "structure/modular/modules/auth/auth.controller.ts.eta",
      path.join(src, "modules", "auth", "auth.controller.ts"),
    );
    await tmpl.renderTemplateFile(
      "structure/modular/modules/auth/auth.routes.ts.eta",
      path.join(src, "modules", "auth", "auth.routes.ts"),
    );
  }
}
