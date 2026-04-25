import path from 'path';
import type { CliOptions } from '../../types.js';
import { writeFile } from '../../utils/file.js';

export async function generatePrisma(opts: CliOptions, dir: string): Promise<void> {
  const provider = opts.database === 'mysql' ? 'mysql' : opts.database === 'sqlite' ? 'sqlite' : 'postgresql';
  const dbUrl = opts.database === 'sqlite' ? 'file:./dev.db' : opts.database === 'mysql' ? 'mysql://user:password@localhost:3306/mydb' : 'postgresql://user:password@localhost:5432/mydb';

  await writeFile(path.join(dir, 'prisma', 'schema.prisma'),
    `generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "debian-openssl-1.1.x", "debian-openssl-3.0.x", "linux-musl", "linux-musl-openssl-3.0.x"]
}

datasource db {
  provider = "${provider}"
  url      = env("DATABASE_URL")
}
${opts.auth !== 'none' ? `
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@map("users")
}

enum Role {
  USER
  ADMIN
}` : ''}
`);

  await writeFile(path.join(dir, 'prisma', 'seed.ts'),
    `import { PrismaClient } from '@prisma/client';\nconst prisma = new PrismaClient();\nasync function main() {\n  console.log('🌱 Seeding...');\n  // add seed data here\n  console.log('✅ Done');\n}\nmain().catch(console.error).finally(() => prisma.$disconnect());\n`);

  await writeFile(path.join(dir, 'src', 'config', 'database.ts'),
    `import { PrismaClient } from '@prisma/client';\n\nexport const prisma = new PrismaClient({\n  log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],\n});\n`);

  // Patch .env with correct DATABASE_URL
  const { readFile, writeFile: fsWrite } = await import('fs/promises');
  for (const f of [path.join(dir, '.env'), path.join(dir, '.env.example')]) {
    try {
      const c = await readFile(f, 'utf-8');
      await fsWrite(f, c.replace(/DATABASE_URL=.*/, `DATABASE_URL="${dbUrl}"`), 'utf-8');
    } catch { /* file may not exist yet */ }
  }
}
