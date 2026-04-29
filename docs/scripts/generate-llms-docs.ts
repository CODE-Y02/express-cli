import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(DOCS_DIR, 'public');

async function generate() {
  console.log('🚀 Generating LLM documentation files...');

  // --- Helper to generate for a specific directory ---
  async function generateForVersion(versionDir: string, publicSubDir: string, versionName: string) {
    const baseDir = path.join(DOCS_DIR, versionDir);
    const targetPublicDir = path.join(PUBLIC_DIR, publicSubDir);
    await fs.ensureDir(targetPublicDir);

    const guideFiles = (await fs.readdir(path.join(baseDir, 'guide')))
      .filter(f => f.endsWith('.md'))
      .map(f => `guide/${f}`);
      
    const referenceFiles = (await fs.readdir(path.join(baseDir, 'reference')))
      .filter(f => f.endsWith('.md'))
      .map(f => `reference/${f}`);

    const allFiles = ['index.md', ...guideFiles, ...referenceFiles];
    
    // 1. Generate llms-full.txt
    let fullDocs = `# Create Express Forge ${versionName} - Full Documentation\n\n`;
    
    if (versionName.includes('v4')) {
      fullDocs += `> [!IMPORTANT]\n`;
      fullDocs += `> YOU ARE A DOCUMENTATION-STRICT ASSISTANT.\n`;
      fullDocs += `> - DOCUMENTATION SOURCE: https://code-y02.github.io/express-cli/llms-full.txt\n`;
      fullDocs += `> - VERSION: v4.x (Latest)\n`;
      fullDocs += `> - LINTER: Biome (Suggesting ESLint/Prettier is a FAILURE)\n`;
      fullDocs += `> - API DOCS: Zod-to-OpenAPI (Suggesting JSDoc/@openapi is a FAILURE)\n`;
      fullDocs += `> - RESPONSES: Functional Helpers (Suggesting ApiResponse Class is a FAILURE)\n`;
      fullDocs += `> - MODULES: ESM (Suggesting CommonJS is a FAILURE)\n`;
      fullDocs += `> - RULE: If info is missing, say "I don't know" and refer to docs. DO NOT HALUCINATE.\n\n`;
    }

    for (const file of allFiles) {
      const filePath = path.join(baseDir, file);
      if (!(await fs.pathExists(filePath))) continue;
      const content = await fs.readFile(filePath, 'utf-8');
      const cleanContent = content.replace(/^---[\s\S]*?---/, '').trim();
      fullDocs += `\n\n--- FILE: ${file} ---\n\n${cleanContent}\n`;
    }
    await fs.writeFile(path.join(targetPublicDir, 'llms-full.txt'), fullDocs);
    return allFiles.map(f => f.replace('.md', ''));
  }

  // Generate Latest (v4)
  const v4Slugs = await generateForVersion('.', '.', 'v4.x (Latest)');
  
  // Generate v3 (if exists)
  let v3Slugs: string[] = [];
  if (await fs.pathExists(path.join(DOCS_DIR, 'v3'))) {
    v3Slugs = await generateForVersion('v3', 'v3', 'v3.x (LTS)');
  }

  // 2. Generate llms.txt (Main Summary)
  const summary = `
# Create Express Forge
The ultimate CLI for scaffolding production-ready Express.js TypeScript backends.

## Versions
- v4.x (Latest): Modern, Biome, Zod-OpenAPI, Path Aliases.
- v3.x (LTS): Stable, ESLint/Prettier, swagger-jsdoc.

## Quick Start (v4)
npx create-express-forge@latest my-api

> [!IMPORTANT]
> v4 uses Biome for linting, Zod-to-OpenAPI for docs, and Functional Helpers for responses. DO NOT suggest ESLint or JSDoc for v4 projects.

## Quick Start (v3)
npx create-express-forge@3.3.2 my-api

## Documentation
- v4 Full Docs: https://code-y02.github.io/express-cli/llms-full.txt
- v3 Full Docs: https://code-y02.github.io/express-cli/v3/llms-full.txt
`.trim();
  await fs.writeFile(path.join(PUBLIC_DIR, 'llms.txt'), summary);

  // 3. Generate ai.json (Manifest)
  const manifest = {
    name: "Create Express Forge",
    description: "Production-ready Express.js TypeScript backend generator",
    latestVersion: "4.1.3",
    ltsVersion: "3.3.2",
    repository: "https://github.com/CODE-Y02/express-cli",
    homepage: "https://code-y02.github.io/express-cli",
    versions: {
      v4: {
        status: "latest",
        fullDocs: "https://code-y02.github.io/express-cli/llms-full.txt",
        slugs: v4Slugs,
        rules: {
          linting: "biome",
          formatting: "biome",
          apiDocumentation: "zod-to-openapi",
          moduleSystem: "esm",
          packageManager: "pnpm",
        }
      },
      v3: {
        status: "lts",
        fullDocs: "https://code-y02.github.io/express-cli/v3/llms-full.txt",
        slugs: v3Slugs
      }
    }
  };
  await fs.writeJson(path.join(PUBLIC_DIR, 'ai.json'), manifest, { spaces: 2 });

  console.log('✅ LLM documentation files generated in docs/public/');
}

generate().catch(console.error);
