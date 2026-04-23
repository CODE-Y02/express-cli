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
  const redisService = opts.cache === 'redis' ? buildRedisService() : '';
  
  const dependsOn: string[] = [];
  if (hasDb) dependsOn.push('db');
  if (opts.cache === 'redis') dependsOn.push('redis');

  const dependsOnTpl = dependsOn.length > 0 
    ? `\n    depends_on:${dependsOn.map(s => `\n      ${s}:\n        condition: service_healthy`).join('')}`
    : '';

  const volumes: string[] = [];
  if (hasDb) volumes.push('  db_data:');
  if (opts.cache === 'redis') volumes.push('  redis_data:');

  const volumesTpl = volumes.length > 0
    ? `\nvolumes:\n${volumes.join('\n')}\n`
    : '';

  await writeFile(path.join(dir, 'docker-compose.yml'),
    `version: '3.9'

services:
  app:
    build: .
    restart: unless-stopped
    ports:
      - "\${PORT:-3000}:3000"
    env_file: .env
    environment:
      NODE_ENV: \${NODE_ENV:-development}${dependsOnTpl}
${dbService}${redisService}${volumesTpl}`);
}

function buildDbService(db: string): string {
  if (db === 'postgresql') {
    return `
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: \${POSTGRES_USER:-user}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD:-password}
      POSTGRES_DB: \${POSTGRES_DB:-mydb}
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${POSTGRES_USER:-user}"]
      interval: 10s
      timeout: 5s
      retries: 5
`;
  }
  if (db === 'mysql') {
    return `
  db:
    image: mysql:8.0
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: \${MYSQL_ROOT_PASSWORD:-root}
      MYSQL_DATABASE: \${MYSQL_DATABASE:-mydb}
      MYSQL_USER: \${MYSQL_USER:-user}
      MYSQL_PASSWORD: \${MYSQL_PASSWORD:-password}
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
`;
  }
  return '';
}

function buildRedisService(): string {
  return `
  redis:
    image: redis:7-alpine
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
`;
}
