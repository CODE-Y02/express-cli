import type { PackageJson } from "pkg-types";
import type { CliOptions } from "../types.js";

export function buildPackageJson(opts: CliOptions): PackageJson {
  const { projectName, orm, database, logger, testing, cache, auth, openapi } =
    opts;

  const deps: Record<string, string> = {
    express: "^5.2.1",
    cors: "^2.8.5",
    helmet: "^8.0.0",
    compression: "^1.7.5",
    dotenv: "^16.4.5",
    "express-rate-limit": "^7.4.0",
    zod: "^3.24.1",
  };

  const devDeps: Record<string, string> = {
    typescript: "^5.6.2",
    tsx: "^4.19.1",
    tsup: "^8.3.0",
    "@types/node": "^22.7.5",
    "@types/express": "^5.0.0",
    "@types/cors": "^2.8.17",
    "@types/compression": "^1.7.5",
    "@biomejs/biome": "^1.9.4",
  };

  if (orm === "prisma") {
    deps["@prisma/client"] = "^6.2.1";
    devDeps.prisma = "^6.2.1";
  } else if (orm === "sequelize") {
    deps.sequelize = "^6.37.3";
    deps["sequelize-typescript"] = "^2.1.6";
    deps["reflect-metadata"] = "^0.2.2";
    devDeps["sequelize-cli"] = "^6.6.2";
    if (database === "postgresql") deps.pg = "^8.13.0";
    else if (database === "mysql") deps.mysql2 = "^3.11.2";
    else if (database === "sqlite") deps.sqlite3 = "^5.1.7";
  }

  if (logger === "winston") {
    deps.winston = "^3.19.0";
    deps["winston-daily-rotate-file"] = "^5.0.0";
  } else if (logger === "pino") {
    deps.pino = "^10.3.1";
    deps["pino-http"] = "^10.3.0";
    devDeps["pino-pretty"] = "^11.2.2";
  }

  if (testing === "vitest") {
    devDeps.vitest = "^4.1.5";
    devDeps["@vitest/coverage-v8"] = "^4.1.5";
    devDeps.supertest = "^7.0.0";
    devDeps["@types/supertest"] = "^6.0.2";
  } else if (testing === "jest") {
    devDeps.jest = "^29.7.0";
    devDeps["ts-jest"] = "^29.2.5";
    devDeps["@types/jest"] = "^29.5.13";
    devDeps.supertest = "^7.0.0";
    devDeps["@types/supertest"] = "^6.0.2";
  }

  if (cache === "redis") {
    deps.redis = "^4.7.0";
  } else if (cache === "node-cache") {
    deps["node-cache"] = "^5.1.2";
  }

  if (auth === "jwt" || auth === "session") {
    deps.bcrypt = "^5.1.1";
    devDeps["@types/bcrypt"] = "^5.0.2";
  }

  if (auth === "jwt") {
    deps.jsonwebtoken = "^9.0.2";
    devDeps["@types/jsonwebtoken"] = "^9.0.7";
    if (opts.jwtStorage === "cookie") {
      deps["cookie-parser"] = "^1.4.6";
      devDeps["@types/cookie-parser"] = "^1.4.7";
    }
  } else if (auth === "session") {
    deps["express-session"] = "^1.18.0";
    deps["cookie-parser"] = "^1.4.6";
    devDeps["@types/express-session"] = "^1.18.0";
    devDeps["@types/cookie-parser"] = "^1.4.7";
  }

  if (openapi) {
    deps["swagger-jsdoc"] = "^6.2.8";
    deps["swagger-ui-express"] = "^5.0.1";
    devDeps["@types/swagger-jsdoc"] = "^6.0.4";
    devDeps["@types/swagger-ui-express"] = "^4.1.6";
  }

  const scripts: Record<string, string> = {
    dev: "tsx watch src/server.ts",
    build: "tsup src/server.ts --format esm",
    start: "node dist/server.js",
    "check-types": "tsc --noEmit",
    lint: "biome lint .",
    format: "biome format --write .",
  };

  if (orm === "prisma") {
    scripts["db:generate"] = "prisma generate";
    scripts["db:migrate"] = "prisma migrate dev";
    scripts["db:push"] = "prisma db push";
    scripts["db:studio"] = "prisma studio";
    scripts["db:seed"] = "tsx prisma/seed.ts";
    scripts.postinstall = "prisma generate";
  }

  if (testing === "vitest") {
    scripts.test = "vitest run";
    scripts["test:watch"] = "vitest";
    scripts["test:coverage"] = "vitest run --coverage";
  } else if (testing === "jest") {
    scripts.test = "jest";
    scripts["test:watch"] = "jest --watch";
    scripts["test:coverage"] = "jest --coverage";
  }

  return {
    name: projectName,
    version: "0.1.0",
    description: "",
    type: "module",
    scripts,
    dependencies: deps,
    devDependencies: devDeps,
    engines: { node: ">=18.0.0" },
  };
}
