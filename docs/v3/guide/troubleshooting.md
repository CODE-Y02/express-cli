# Troubleshooting

Common issues and how to resolve them when using Create Express Forge.

## 💾 Database Issues

### Prisma migration failed
**Issue**: `prisma migrate dev` fails with a connection error.
**Solution**: 
1. Ensure your database container is running: `docker compose up -d`.
2. Check your `DATABASE_URL` in the `.env` file. If running locally (not in Docker), use `localhost` instead of the service name.
3. Ensure the database user has sufficient permissions.

### Sequelize connection error
**Issue**: `Unable to connect to the database`.
**Solution**: Check the `dialect` and `port` in your `.env` file. Ensure the database service is reachable from your host machine.

## 🐳 Docker Issues

### Permission Denied
**Issue**: Error when running Docker commands.
**Solution**: Run the commands with `sudo` or add your user to the `docker` group.

### Port already in use
**Issue**: `Bind for 0.0.0.0:3000 failed: port is already allocated`.
**Solution**: Another process is using port 3000. You can change the port in your `.env` file or kill the existing process.

## 🚀 Runtime Issues

### Environment variables are missing
**Issue**: Zod validation error on startup.
**Solution**: Create Express Forge validates your `.env` on startup. Ensure all required variables listed in `src/config/index.ts` are present in your `.env` file.

### Modules not found (Path Aliases)
**Issue**: TypeScript can't find modules starting with `@`.
**Solution**: This is usually handled by `tsconfig-paths`. Ensure you are starting the app with `npm run dev`. If you've added new modules, you might need to restart the dev server.

## 🧪 Testing Issues

### Tests hanging
**Issue**: Tests don't exit after completion.
**Solution**: Ensure you are closing your database connections and server in an `afterAll` hook. Create Express Forge handles this by default in the generated boilerplate.

---

Still having trouble? [Open an issue on GitHub](https://github.com/CODE-Y02/express-cli/issues)
