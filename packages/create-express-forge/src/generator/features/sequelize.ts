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
    `import { Sequelize } from 'sequelize-typescript';
import { env } from './env.js';
import { User } from '../models/User.model.js';
import { Todo } from '../models/Todo.model.js';

export const sequelize = new Sequelize(env.DATABASE_URL, {
  dialect: '${dialect}' as const,
  logging: env.NODE_ENV === 'development' ? console.log : false,
  models: [User, Todo],
  modelMatch: (filename, member) => {
    return filename.substring(0, filename.indexOf('.model')) === member.toLowerCase();
  },
});

export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully via Sequelize');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
}
`);

  await writeFile(path.join(dir, 'src', 'models', 'User.model.ts'),
    `import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, PrimaryKey, Default, Unique, HasMany } from 'sequelize-typescript';
import { Todo } from './Todo.model.js';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Unique
  @Column({ type: DataType.STRING, allowNull: false })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  @Column({ type: DataType.ENUM('USER', 'ADMIN'), defaultValue: 'USER' })
  declare role: string;

  @HasMany(() => Todo)
  declare todos: Todo[];

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
`);

  await writeFile(path.join(dir, 'src', 'models', 'Todo.model.ts'),
    `import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, PrimaryKey, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User.model.js';

@Table({ tableName: 'todos', timestamps: true })
export class Todo extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare title: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: string;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  declare completed: boolean;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare userId: string;

  @BelongsTo(() => User)
  declare user: User;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
`);
}
