# Docker

When you select Docker, the CLI generates a production-ready Docker setup.

## What Gets Generated

### `Dockerfile` — Multi-stage Build

```dockerfile
# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=builder /app/dist ./dist
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1
CMD ["node", "dist/server.js"]
```

### `docker-compose.yml`

If you selected a database (PostgreSQL/MySQL), docker-compose includes the DB service with:
- Persistent volumes
- Health checks
- `depends_on` with health condition

## Usage

```bash
# Build and run
docker compose up --build

# Run in background
docker compose up -d --build

# View logs
docker compose logs -f app

# Stop
docker compose down
```

## Environment Variables

Docker reads from your `.env` file. Key variables:

```env
PORT=3000
NODE_ENV=production
DATABASE_URL=postgresql://user:password@db:5432/mydb
```

::: tip
In docker-compose, the database hostname is `db` (the service name), not `localhost`.
:::
