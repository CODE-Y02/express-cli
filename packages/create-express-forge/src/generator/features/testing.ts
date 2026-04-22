import path from 'path';
import type { CliOptions } from '../../types.js';
import { writeFile } from '../../utils/file.js';

export async function generateTesting(opts: CliOptions, dir: string): Promise<void> {
  const testDir = path.join(dir, 'src', '__tests__');
  const healthPath = opts.pattern === 'modular' ? '/api/health' : '/api/v1/health';

  if (opts.testing === 'vitest') {
    await writeFile(path.join(dir, 'vitest.config.ts'),
      `import { defineConfig } from 'vitest/config';\nexport default defineConfig({ test: { globals: true, environment: 'node', coverage: { provider: 'v8', reporter: ['text', 'html', 'lcov'] } } });\n`);
    await writeFile(path.join(testDir, 'health.test.ts'),
      `import { describe, it, expect } from 'vitest';\nimport request from 'supertest';\nimport { app } from '../app.js';\n\ndescribe('Health', () => {\n  it('GET ${healthPath} → 200', async () => {\n    const res = await request(app).get('${healthPath}');\n    expect(res.status).toBe(200);\n    expect(res.body.success).toBe(true);\n    expect(res.body.data.status).toBe('ok');\n  });\n});\n`);
  } else if (opts.testing === 'jest') {
    await writeFile(path.join(dir, 'jest.config.ts'),
      `import type { Config } from 'jest';\nconst config: Config = { preset: 'ts-jest/presets/default-esm', testEnvironment: 'node', extensionsToTreatAsEsm: ['.ts'], moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' } };\nexport default config;\n`);
    await writeFile(path.join(testDir, 'health.test.ts'),
      `import request from 'supertest';\nimport { app } from '../app.js';\n\ndescribe('Health', () => {\n  it('GET ${healthPath} → 200', async () => {\n    const res = await request(app).get('${healthPath}');\n    expect(res.status).toBe(200);\n    expect(res.body.success).toBe(true);\n  });\n});\n`);
  }
}
