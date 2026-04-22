import path from 'path';
import type { CliOptions } from '../../types.js';
import { writeFile } from '../../utils/file.js';

export async function generateDocker(opts: CliOptions, dir: string): Promise<void> {
  const hasDb = opts.orm !== 'none' && opts.database !== 'none' && opts.database !== 'sqlite';

  await writeFile(path.join(dir, 'Dockerfile'),
    `# ── Stage 1: Builder ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
${opts.orm === 'prisma' ? 'RUN npx prisma generate\n' : ''}
# ── Stage 2: Production ───────────────────────────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=builder /app/dist ./dist
${opts.orm === 'prisma' ? 'COPY --from=builder /app/prisma ./prisma\nCOPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma\n' : ''}
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \\
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node", "dist/server.js"]
`);

  await writeFile(path.join(dir, '.dockerignore'),
    `node_modules\ndist\n.env\n*.log\nlogs/\ncoverage\n.git\n.turbo\n`);

  const dbService = buildDbService(opts.database);
  const depends = hasDb ? `\n    depends_on:\n      db:\n        condition: service_healthy` : '';
  const volumes = hasDb ? `\nvolumes:\n  db_data:\n` : '';

  await writeFile(path.join(dir, 'docker-compose.yml'),
    `version: '3.9'\n\nservices:\n  app:\n    build: .\n    restart: unless-stopped\n    ports:\n      - "\${PORT:-3000}:3000"\n    env_file: .env\n    environment:\n      NODE_ENV: \${NODE_ENV:-development}${depends}\n${hasDb ? dbService : ''}${volumes}`);
}

function buildDbService(db: string): string {
  if (db === 'postgresql') {
    return `\n  db:\n    image: postgres:16-alpine\n    restart: unless-stopped\n    environment:\n      POSTGRES_USER: \${POSTGRES_USER:-user}\n      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD:-password}\n      POSTGRES_DB: \${POSTGRES_DB:-mydb}\n    ports:\n      - "5432:5432"\n    volumes:\n      - db_data:/var/lib/postgresql/data\n    healthcheck:\n      test: ["CMD-SHELL", "pg_isready -U \${POSTGRES_USER:-user}"]\n      interval: 10s\n      timeout: 5s\n      retries: 5\n`;
  }
  if (db === 'mysql') {
    return `\n  db:\n    image: mysql:8.0\n    restart: unless-stopped\n    environment:\n      MYSQL_ROOT_PASSWORD: \${MYSQL_ROOT_PASSWORD:-root}\n      MYSQL_DATABASE: \${MYSQL_DATABASE:-mydb}\n      MYSQL_USER: \${MYSQL_USER:-user}\n      MYSQL_PASSWORD: \${MYSQL_PASSWORD:-password}\n    ports:\n      - "3306:3306"\n    volumes:\n      - db_data:/var/lib/mysql\n    healthcheck:\n      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]\n      interval: 10s\n      timeout: 5s\n      retries: 5\n`;
  }
  return '';
}
