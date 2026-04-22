import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'path';
import fs from 'fs-extra';
import os from 'os';
import { generateProject } from '../src/generator/index.js';
import type { CliOptions } from '../src/types.js';

async function makeTempDir(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), 'cef-test-'));
}

const baseOpts: CliOptions = {
  projectName: 'test-app',
  pattern: 'modular',
  orm: 'none',
  database: 'none',
  logger: 'none',
  testing: 'none',
  cache: 'none',
  auth: 'none',
  openapi: false,
  docker: false,
  installDeps: false,
};

describe('generateProject – modular, no extras', () => {
  let tmpDir: string;

  beforeEach(async () => { tmpDir = await makeTempDir(); });
  afterEach(async () => { await fs.remove(tmpDir); });

  it('creates package.json', async () => {
    await generateProject(baseOpts, tmpDir);
    expect(await fs.pathExists(path.join(tmpDir, 'package.json'))).toBe(true);
  });

  it('creates src/app.ts', async () => {
    await generateProject(baseOpts, tmpDir);
    expect(await fs.pathExists(path.join(tmpDir, 'src', 'app.ts'))).toBe(true);
  });

  it('creates src/server.ts', async () => {
    await generateProject(baseOpts, tmpDir);
    expect(await fs.pathExists(path.join(tmpDir, 'src', 'server.ts'))).toBe(true);
  });

  it('creates global error handler', async () => {
    await generateProject(baseOpts, tmpDir);
    const content = await fs.readFile(path.join(tmpDir, 'src', 'middleware', 'errorHandler.ts'), 'utf-8');
    expect(content).toContain('ApiError');
    expect(content).toContain('ZodError');
  });

  it('creates .env.example', async () => {
    await generateProject(baseOpts, tmpDir);
    expect(await fs.pathExists(path.join(tmpDir, '.env.example'))).toBe(true);
  });
});

describe('generateProject – MVC pattern', () => {
  let tmpDir: string;
  beforeEach(async () => { tmpDir = await makeTempDir(); });
  afterEach(async () => { await fs.remove(tmpDir); });

  it('creates routes/index.ts', async () => {
    await generateProject({ ...baseOpts, pattern: 'mvc' }, tmpDir);
    expect(await fs.pathExists(path.join(tmpDir, 'src', 'routes', 'index.ts'))).toBe(true);
  });

  it('creates controllers/', async () => {
    await generateProject({ ...baseOpts, pattern: 'mvc' }, tmpDir);
    expect(await fs.pathExists(path.join(tmpDir, 'src', 'controllers'))).toBe(true);
  });
});

describe('generateProject – Docker', () => {
  let tmpDir: string;
  beforeEach(async () => { tmpDir = await makeTempDir(); });
  afterEach(async () => { await fs.remove(tmpDir); });

  it('creates Dockerfile and docker-compose.yml', async () => {
    await generateProject({ ...baseOpts, docker: true }, tmpDir);
    expect(await fs.pathExists(path.join(tmpDir, 'Dockerfile'))).toBe(true);
    expect(await fs.pathExists(path.join(tmpDir, 'docker-compose.yml'))).toBe(true);
  });
});
