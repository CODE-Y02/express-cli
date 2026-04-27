import os from "node:os";
import path from "node:path";
import fs from "fs-extra";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { generateBaseFiles } from "../src/generator/base.js";
import { generateDocker } from "../src/generator/features/docker.js";
import { generateModularStructure } from "../src/generator/structure/modular.js";
import { generateMvcStructure } from "../src/generator/structure/mvc.js";
import type { CliOptions } from "../src/types.js";
import { buildPackageJson } from "../src/utils/package-builder.js";
import { TemplateManager } from "../src/utils/template-manager.js";

vi.setConfig({ testTimeout: 10000 });

async function makeTempDir(prefix: string): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), `cef-test-${prefix}-`));
}

const baseOpts: CliOptions = {
  projectName: "test-app",
  pattern: "modular",
  orm: "none",
  database: "none",
  packageManager: "npm",
  logger: "none",
  testing: "none",
  cache: "none",
  auth: "none",
  importAlias: false,
  openapi: false,
  openapiUI: false,
  docker: false,
  installDeps: false,
};

describe("Codebase Logic: Package Builder", () => {
  it("should build a valid package.json object", () => {
    const pkg = buildPackageJson(baseOpts);
    expect(pkg.name).toBe("test-app");
    expect(pkg.dependencies).toBeDefined();
    expect(pkg.devDependencies).toHaveProperty("@biomejs/biome");
  });
});

describe("Codebase Logic: Template Rendering", () => {
  let tmpDir: string;
  let tmpl: TemplateManager;

  beforeAll(async () => {
    tmpDir = await makeTempDir("logic");
    tmpl = new TemplateManager(baseOpts);
  });

  afterAll(async () => {
    if (tmpDir) await fs.remove(tmpDir);
  });

  it("generates base configuration files", async () => {
    await generateBaseFiles(baseOpts, tmpDir, tmpl);
    expect(await fs.pathExists(path.join(tmpDir, "tsconfig.json"))).toBe(true);
    expect(await fs.pathExists(path.join(tmpDir, "src", "app.ts"))).toBe(true);
    expect(
      await fs.pathExists(
        path.join(tmpDir, "src", "middleware", "errorHandler.ts"),
      ),
    ).toBe(true);
  });

  it("generates modular architecture structure", async () => {
    const modularDir = path.join(tmpDir, "modular-test");
    await fs.ensureDir(modularDir);
    await generateModularStructure(baseOpts, modularDir, tmpl);
    expect(
      await fs.pathExists(path.join(modularDir, "src", "modules", "todos")),
    ).toBe(true);
  });

  it("generates MVC architecture structure", async () => {
    const mvcDir = path.join(tmpDir, "mvc-test");
    await fs.ensureDir(mvcDir);
    await generateMvcStructure({ ...baseOpts, pattern: "mvc" }, mvcDir, tmpl);
    expect(await fs.pathExists(path.join(mvcDir, "src", "controllers"))).toBe(
      true,
    );
    expect(
      await fs.pathExists(path.join(mvcDir, "src", "routes", "index.ts")),
    ).toBe(true);
  });

  it("generates Docker configuration", async () => {
    const dockerDir = path.join(tmpDir, "docker-test");
    await fs.ensureDir(dockerDir);
    await generateDocker(baseOpts, dockerDir, tmpl);
    expect(await fs.pathExists(path.join(dockerDir, "Dockerfile"))).toBe(true);
    expect(
      await fs.pathExists(path.join(dockerDir, "docker-compose.yml")),
    ).toBe(true);
  });
});
