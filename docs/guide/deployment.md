---
title: "Deployment Guide: Docker & Production | Create Express Forge"
description: "Deploy your Express.js API with confidence. Learn how to use multi-stage Docker builds, environment variables, and production best practices."
head:
  - - link
    - rel: canonical
      href: https://create-express-forge.js.org/guide/deployment
  - - meta
    - property: og:title
      content: "Production Deployment for Express.js | Create Express Forge"
  - - meta
    - property: og:description
      content: "Step-by-step deployment guide for Create Express Forge projects. Docker, CI/CD, and production optimization."
  - - meta
    - property: og:url
      content: https://create-express-forge.js.org/guide/deployment
---

# Deployment

Create Express Forge provides production-ready configurations to help you ship your API with confidence.

## 🐳 Docker Deployment (Recommended)

The easiest way to deploy is using the provided multi-stage `Dockerfile`.

### Build Image
```bash
docker build -t my-express-api .
```

### Run Container
```bash
docker run -p 3000:3000 --env-file .env my-express-api
```

### Why Multi-stage?
Our Dockerfile uses multi-stage builds to:
1. **Reduce Image Size**: The final image only contains the compiled JavaScript and production dependencies.
2. **Security**: Source code and build tools are not included in the final production image.

## ☁️ Cloud Platforms

### Railway / Render / Fly.io
Most modern PaaS platforms will automatically detect the `Dockerfile` or the `start` script in `package.json`.

1. Connect your GitHub repository.
2. Configure your environment variables (copy from `.env`).
3. Set the build command to `npm run build` (if not using Docker).
   > **Note for Prisma users**: The generated `package.json` includes a `postinstall: "prisma generate"` script, which ensures your Prisma client is generated automatically before the build step on most PaaS platforms.
4. Set the start command to `npm start`.

## 🛡️ Production Checklist

Before going live, ensure:
- [ ] **Environment Variables**: `NODE_ENV` is set to `production`.
- [ ] **Database**: Migrations have been run on the production database.
- [ ] **Logging**: Log level is set appropriately (e.g., `info` or `error`).
- [ ] **Security**: CORS is restricted to your frontend domain.
- [ ] **Rate Limiting**: Configured for your production traffic.
