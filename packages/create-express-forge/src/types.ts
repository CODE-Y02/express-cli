export type Pattern = 'modular' | 'mvc';
export type ORM = 'prisma' | 'sequelize' | 'none';
export type Database = 'postgresql' | 'mysql' | 'sqlite' | 'none';
export type LoggerLib = 'winston' | 'pino' | 'none';
export type TestingLib = 'vitest' | 'jest' | 'none';

export interface CliOptions {
  projectName: string;
  pattern: Pattern;
  orm: ORM;
  database: Database;
  logger: LoggerLib;
  testing: TestingLib;
  docker: boolean;
  installDeps: boolean;
}
