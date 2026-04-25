import path from 'path';
import { execa } from 'execa';
import fs from 'fs-extra';
import type { CliOptions } from '../../types.js';
import { writeFile } from '../../utils/file.js';

export async function generatePrisma(opts: CliOptions, dir: string): Promise<void> {
  const provider = opts.database === 'mysql' ? 'mysql' : opts.database === 'sqlite' ? 'sqlite' : 'postgresql';
  const dbUrl = opts.database === 'sqlite' ? 'file:./dev.db' : opts.database === 'mysql' ? 'mysql://user:password@localhost:3306/mydb' : 'postgresql://user:password@localhost:5432/mydb';

  try {
    // Initialize prisma folder using latest CLI pattern
    const npxCmd = opts.packageManager === 'bun' ? 'bunx' : 'npx';
    await execa(npxCmd, ['prisma', 'init', '--datasource-provider', provider], { cwd: dir });
  } catch (err) {
    // Fallback
    await fs.ensureDir(path.join(dir, 'prisma'));
  }

  await writeFile(path.join(dir, 'prisma', 'schema.prisma'),
    `generator client {
  provider = "prisma-client-js"
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
  todos     Todo[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model Todo {
  id          String   @id @default(cuid())
  title       String
  description String?
  completed   Boolean  @default(false)
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("todos")
}

enum Role {
  USER
  ADMIN
}` : ''}
`);

  await writeFile(path.join(dir, 'prisma', 'seed.ts'),
    `import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: 'password123', // In real app, hash this!
      role: 'ADMIN',
    },
  });

  console.log({ admin });
  console.log('✅ Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
`);

  await writeFile(path.join(dir, 'src', 'config', 'database.ts'),
    `import { PrismaClient } from '@prisma/client';\n\nexport const prisma = new PrismaClient({\n  log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],\n});\n`);

  // Patch .env with correct DATABASE_URL if init didn't do it right or we want to ensure our format
  const { readFile, writeFile: fsWrite } = await import('fs/promises');
  for (const f of [path.join(dir, '.env'), path.join(dir, '.env.example')]) {
    try {
      const c = await readFile(f, 'utf-8');
      if (c.includes('DATABASE_URL=')) {
        await fsWrite(f, c.replace(/DATABASE_URL=.*/, `DATABASE_URL="${dbUrl}"`), 'utf-8');
      } else {
        await fsWrite(f, c + `\nDATABASE_URL="${dbUrl}"\n`, 'utf-8');
      }
    } catch { /* ignore */ }
  }
}
