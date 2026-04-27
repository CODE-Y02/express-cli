import os from "node:os";
import path from "node:path";
import { execa } from "execa";
import fs from "fs-extra";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("CLI Integration (Smoke Test)", () => {
  let testDir: string;
  const projectName = "smoke-test-app";

  afterAll(async () => {
    if (testDir && (await fs.pathExists(testDir))) {
      await fs.remove(testDir);
    }
  });

  beforeAll(async () => {
    // 1. Create a clean temp directory with unique suffix for testing
    const uniqueId = Math.random().toString(36).substring(2, 8);
    const baseTempDir = path.join(os.tmpdir(), `cef-smoke-${uniqueId}-`);
    testDir = await fs.mkdtemp(baseTempDir);

    // 2. Build the CLI to ensure dist/ exists
    await execa("npm", ["run", "build"], { cwd: process.cwd() });
  }, 120000);

  it("should scaffold a project with all defaults using --yes flag", async () => {
    const targetPath = path.join(testDir, projectName);

    // Run the CLI
    await execa(
      "node",
      [path.resolve(process.cwd(), "dist/index.js"), projectName, "--yes"],
      {
        cwd: testDir,
        env: { ...process.env, NODE_ENV: "test" },
      },
    );

    // Verify critical files
    expect(await fs.pathExists(path.join(targetPath, "package.json"))).toBe(
      true,
    );
    expect(await fs.pathExists(path.join(targetPath, "src/app.ts"))).toBe(true);
    expect(
      await fs.pathExists(path.join(targetPath, "src/config/env.ts")),
    ).toBe(true);
    expect(
      await fs.pathExists(path.join(targetPath, "src/docs/swagger.ts")),
    ).toBe(true);
    expect(await fs.pathExists(path.join(targetPath, ".env.example"))).toBe(
      true,
    );

    // Verify the TODO app boilerplate exists
    const todoServicePath = path.join(
      targetPath,
      "src/modules/todos/todos.service.ts",
    );
    expect(await fs.pathExists(todoServicePath)).toBe(true);
    const serviceContent = await fs.readFile(todoServicePath, "utf-8");
    expect(serviceContent).toContain("TodosService");
  }, 180000); // 3 minutes for scaffolding + npm install

  it("should build the generated project successfully", async () => {
    const targetPath = path.join(testDir, projectName);

    // 1. Run type checking first (more thorough than build)
    console.log("Running type check in generated project...");
    const typeCheck = await execa("npm", ["run", "check-types"], {
      cwd: targetPath,
    });
    expect(typeCheck.exitCode).toBe(0);

    // 2. Run the actual build
    console.log("Running build in generated project...");
    const build = await execa("npm", ["run", "build"], { cwd: targetPath });
    expect(build.exitCode).toBe(0);
  }, 240000); // 4 minutes for build + typecheck

  it("should pass linting checks", async () => {
    const targetPath = path.join(testDir, projectName);

    console.log("Running lint check in generated project...");
    const lint = await execa("npm", ["run", "lint"], { cwd: targetPath });
    expect(lint.exitCode).toBe(0);
  }, 60000);
});
