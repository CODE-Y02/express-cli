import path from 'path';
import type { CliOptions } from '../types.js';
import { writeFile, writeJson } from '../utils/file.js';

function dbExampleUrl(db: string): string {
  if (db === 'mysql') return 'mysql://user:password@localhost:3306/mydb';
  if (db === 'sqlite') return 'file:./dev.db';
  return 'postgresql://user:password@localhost:5432/mydb';
}

export async function generateBaseFiles(opts: CliOptions, dir: string): Promise<void> {
  const { orm, database, logger, testing, docker, projectName } = opts;
  const hasDb = orm !== 'none' && database !== 'none';

  await writeJson(path.join(dir, 'tsconfig.json'), {
    compilerOptions: {
      target: 'ES2022',
      module: 'NodeNext',
      moduleResolution: 'NodeNext',
      outDir: './dist',
      rootDir: './src',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      declaration: true,
      sourceMap: true,
      ...(orm === 'sequelize' ? { experimentalDecorators: true, emitDecoratorMetadata: true } : {}),
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist', '**/*.test.ts'],
  });

  await writeFile(
    path.join(dir, '.gitignore'),
    `node_modules/\ndist/\n.env\n*.log\nlogs/\ncoverage/\n.DS_Store\n${orm === 'prisma' ? 'prisma/migrations/\n*.db\n' : ''}`,
  );

  const envLines = [
    '# Application',
    'NODE_ENV=development',
    'PORT=3000',
    '',
    '# CORS',
    'CORS_ORIGIN=http://localhost:3000',
    '',
    '# Rate limiter',
    'RATE_LIMIT_WINDOW_MS=900000',
    'RATE_LIMIT_MAX=100',
    '',
    ...(hasDb ? ['# Database', `DATABASE_URL="${dbExampleUrl(database)}"`, ''] : []),
  ];
  await writeFile(path.join(dir, '.env.example'), envLines.join('\n'));
  await writeFile(path.join(dir, '.env'), envLines.join('\n'));

  await writeFile(
    path.join(dir, 'README.md'),
    `# ${projectName}\n\n> Scaffolded with [create-express-forge](https://github.com/CODE-Y02/create-express-forge)\n\n## Stack\n\n- TypeScript + Express.js\n- Zod validation\n${orm === 'prisma' ? `- Prisma ORM + ${database}\n` : ''}${orm === 'sequelize' ? `- Sequelize ORM + ${database}\n` : ''}${logger !== 'none' ? `- ${logger} logger\n` : ''}${testing !== 'none' ? `- ${testing} tests\n` : ''}${docker ? '- Docker + docker-compose\n' : ''}\n## Quick Start\n\n\`\`\`bash\ncp .env.example .env\n${orm === 'prisma' ? 'npm run db:migrate\n' : ''}npm run dev\n\`\`\`\n`,
  );
}
