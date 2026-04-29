import path from "node:path";
import { fileURLToPath } from "node:url";
import { Eta } from "eta";
import fs from "fs-extra";
import type { CliOptions } from "../types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In development (src/utils/...), templates are at ../../templates
// In production (dist/...), templates are at ./templates (copied by tsup)
const devPath = path.resolve(__dirname, "../../templates");
const prodPath = path.resolve(__dirname, "./templates");

const TEMPLATE_DIR = fs.existsSync(devPath) ? devPath : prodPath;

export class TemplateManager {
  private eta: Eta;

  constructor(private opts: CliOptions) {
    this.eta = new Eta({
      views: TEMPLATE_DIR,
      cache: false,
      autoEscape: false,
    });
  }

  /**
   * Render an Eta template string or file to a destination.
   * If sourcePath is provided, it reads from templates/.
   */
  async renderTemplateFile(
    templatePath: string,
    destPath: string,
  ): Promise<void> {
    let rendered = await this.eta.renderAsync(templatePath, this.opts);

    if (this.opts.importAlias && destPath.includes(`${path.sep}src${path.sep}`)) {
      const srcIndex = destPath.lastIndexOf(`${path.sep}src${path.sep}`);
      const srcDir = destPath.substring(0, srcIndex + 4); // path/to/src

      const importRegex = /(from\s+|import\(\s*)(['"])(\.\/|\.\.\/)([^'"]+)\2/g;
      
      rendered = rendered.replace(importRegex, (match, prefix, quote, dotPrefix, relPath) => {
        const currentDir = path.dirname(destPath);
        const absoluteImportPath = path.resolve(currentDir, dotPrefix + relPath);
        
        if (absoluteImportPath.startsWith(srcDir)) {
          let aliasPath = path.relative(srcDir, absoluteImportPath);
          aliasPath = aliasPath.split(path.sep).join('/'); // Ensure forward slashes
          return `${prefix}${quote}@/${aliasPath}${quote}`;
        }
        return match;
      });
    }

    await fs.ensureDir(path.dirname(destPath));
    await fs.writeFile(destPath, rendered, "utf-8");
  }

  /**
   * Render a raw Eta template string directly.
   */
  async renderString(
    templateString: string,
    additionalData: Record<string, unknown> = {},
  ): Promise<string> {
    return this.eta.renderStringAsync(templateString, {
      ...this.opts,
      ...additionalData,
    });
  }

  /**
   * Bulk copy an entire directory without templating (for static assets)
   */
  async copyStaticDir(sourceDir: string, destDir: string): Promise<void> {
    const fullSource = path.join(TEMPLATE_DIR, sourceDir);
    await fs.copy(fullSource, destDir, { overwrite: true });
  }
}
