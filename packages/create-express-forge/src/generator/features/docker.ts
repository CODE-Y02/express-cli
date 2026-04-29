import path from "node:path";
import type { CliOptions } from "../../types.js";
import type { TemplateManager } from "../../utils/template-manager.js";

export async function generateDocker(
  _opts: CliOptions,
  dir: string,
  tmpl: TemplateManager,
): Promise<void> {
  await tmpl.renderTemplateFile(
    "features/docker/Dockerfile.eta",
    path.join(dir, "Dockerfile"),
  );
  await tmpl.renderTemplateFile(
    "features/docker/docker-compose.yml.eta",
    path.join(dir, "docker-compose.yml"),
  );

  const dockerIgnore = `node_modules\ndist\n.env\n*.log\nlogs/\ncoverage\n.git\n.turbo\n`;
  const { writeFile } = await import("../../utils/file.js");
  await writeFile(path.join(dir, ".dockerignore"), dockerIgnore);
}
