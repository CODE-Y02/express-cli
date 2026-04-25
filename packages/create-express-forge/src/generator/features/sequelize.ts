import path from 'path';
import type { CliOptions } from '../../types.js';
import { writeFile } from '../../utils/file.js';

export async function generateSequelize(opts: CliOptions, dir: string): Promise<void> {
  const dialect = opts.database === 'mysql' ? 'mysql' : opts.database === 'sqlite' ? 'sqlite' : 'postgres';
  
  await writeFile(path.join(dir, '.sequelizerc'),
    `const path = require('path');
module.exports = {
  config: path.resolve('src', 'config', 'sequelize.cjs'),
  'models-path': path.resolve('src', 'models'),
  'seeders-path': path.resolve('db', 'seeders'),
  'migrations-path': path.resolve('db', 'migrations'),
};
`);

  await writeFile(path.join(dir, 'src', 'config', 'sequelize.cjs'),
    `module.exports = {
  development: { use_env_variable: 'DATABASE_URL', dialect: '${dialect}', logging: console.log },
  test: { use_env_variable: 'DATABASE_URL', dialect: '${dialect}', logging: false },
  production: { use_env_variable: 'DATABASE_URL', dialect: '${dialect}', logging: false },
};
`);

  await writeFile(path.join(dir, 'src', 'config', 'database.ts'),
    `import { Sequelize } from 'sequelize-typescript';\nimport { env } from './env.js';\n${opts.auth !== 'none' ? "import { User } from '../models/User.js';\n" : ""}export const sequelize = new Sequelize(env.DATABASE_URL, { dialect: '${dialect}' as const, logging: env.NODE_ENV === 'development' ? console.log : false, models: [${opts.auth !== 'none' ? 'User' : ''}] });\nexport async function connectDB() { await sequelize.authenticate(); console.log('✅ Database connected'); }\n`);
  
  if (opts.auth !== 'none') {
    await writeFile(path.join(dir, 'src', 'models', 'User.ts'),
      `import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, PrimaryKey, Default, Unique } from 'sequelize-typescript';\n@Table({ tableName: 'users', timestamps: true })\nexport class User extends Model {\n  @PrimaryKey @Default(DataType.UUIDV4) @Column(DataType.UUID) declare id: string;\n  @Column({ type: DataType.STRING, allowNull: false }) declare name: string;\n  @Unique @Column({ type: DataType.STRING, allowNull: false }) declare email: string;\n  @Column({ type: DataType.STRING, allowNull: false }) declare password: string;\n  @CreatedAt declare createdAt: Date;\n  @UpdatedAt declare updatedAt: Date;\n}\n`);
  }
}
