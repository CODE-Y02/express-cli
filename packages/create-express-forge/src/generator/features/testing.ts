import path from "node:path";
import type { CliOptions } from "../../types.js";
import type { TemplateManager } from "../../utils/template-manager.js";

export async function generateTesting(
  opts: CliOptions,
  dir: string,
  tmpl: TemplateManager,
): Promise<void> {
  const testDir = path.join(dir, "src", "__tests__");

  if (opts.testing === "vitest") {
    await tmpl.renderTemplateFile(
      "features/testing/vitest.config.ts.eta",
      path.join(dir, "vitest.config.ts"),
    );
    await tmpl.renderTemplateFile(
      "features/testing/smoke.test.ts.eta",
      path.join(testDir, "smoke.test.ts"),
    );
  } else if (opts.testing === "jest") {
    await tmpl.renderTemplateFile(
      "features/testing/jest.config.js.eta",
      path.join(dir, "jest.config.js"),
    );
    await tmpl.renderTemplateFile(
      "features/testing/smoke.test.ts.eta",
      path.join(testDir, "smoke.test.ts"),
    );
  }
}
