# Deployment

Express Forge provides production-ready configurations to help you ship your API with confidence.

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
4. Set the start command to `npm start`.

## 🛡️ Production Checklist

Before going live, ensure:
- [ ] **Environment Variables**: `NODE_ENV` is set to `production`.
- [ ] **Database**: Migrations have been run on the production database.
- [ ] **Logging**: Log level is set appropriately (e.g., `info` or `error`).
- [ ] **Security**: CORS is restricted to your frontend domain.
- [ ] **Rate Limiting**: Configured for your production traffic.
