export type Pattern = 'modular' | 'mvc';
export type ORM = 'prisma' | 'sequelize' | 'none';
export type Database = 'postgresql' | 'mysql' | 'sqlite' | 'none';
export type LoggerLib = 'winston' | 'pino' | 'none';
export type TestingLib = 'vitest' | 'jest' | 'none';
export type CacheLib = 'redis' | 'node-cache' | 'none';
export type AuthStrategy = 'jwt' | 'session' | 'none';
export type JwtStorage = 'cookie' | 'header';
export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export interface CliOptions {
  projectName: string;
  pattern: Pattern;
  orm: ORM;
  database: Database;
  packageManager: PackageManager;
  logger: LoggerLib;
  testing: TestingLib;
  cache: CacheLib;
  auth: AuthStrategy;
  jwtStorage?: JwtStorage;
  importAlias: boolean;
  openapi: boolean;
  openapiUI?: boolean;
  docker: boolean;
  installDeps: boolean;
}
