import path from 'path';
import type { CliOptions } from '../../types.js';
import { writeFile } from '../../utils/file.js';

export async function generatePrisma(opts: CliOptions, dir: string): Promise<void> {
  const provider = opts.database === 'mysql' ? 'mysql' : opts.database === 'sqlite' ? 'sqlite' : 'postgresql';
  const dbUrl = opts.database === 'sqlite' ? 'file:./dev.db' : opts.database === 'mysql' ? 'mysql://user:password@localhost:3306/mydb' : 'postgresql://user:password@localhost:5432/mydb';

  await writeFile(path.join(dir, 'prisma', 'schema.prisma'),
    `generator client {\n  provider = "prisma-client-js"\n}\n\ndatasource db {\n  provider = "${provider}"\n  url      = env("DATABASE_URL")\n}\n\nmodel User {\n  id        String   @id @default(cuid())\n  name      String\n  email     String   @unique\n  password  String\n  role      Role     @default(USER)\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  @@map("users")\n}\n\nenum Role {\n  USER\n  ADMIN\n}\n`);

  await writeFile(path.join(dir, 'prisma', 'seed.ts'),
    `import { PrismaClient } from '@prisma/client';\nconst prisma = new PrismaClient();\nasync function main() {\n  console.log('🌱 Seeding...');\n  // add seed data here\n  console.log('✅ Done');\n}\nmain().catch(console.error).finally(() => prisma.$disconnect());\n`);

  await writeFile(path.join(dir, 'src', 'config', 'database.ts'),
    `import { PrismaClient } from '@prisma/client';\n\ndeclare global { var __prisma: PrismaClient | undefined; } // eslint-disable-line no-var\n\nexport const prisma =\n  globalThis.__prisma ??\n  new PrismaClient({\n    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],\n  });\n\nif (process.env.NODE_ENV !== 'production') globalThis.__prisma = prisma;\n`);

  // Patch .env with correct DATABASE_URL
  const { readFile, writeFile: fsWrite } = await import('fs/promises');
  for (const f of [path.join(dir, '.env'), path.join(dir, '.env.example')]) {
    try {
      const c = await readFile(f, 'utf-8');
      await fsWrite(f, c.replace(/DATABASE_URL=.*/, `DATABASE_URL="${dbUrl}"`), 'utf-8');
    } catch { /* file may not exist yet */ }
  }
}
