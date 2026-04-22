import path from 'path';
import type { CliOptions } from '../../types.js';
import { writeFile } from '../../utils/file.js';

export async function generateLogger(opts: CliOptions, dir: string): Promise<void> {
  const loggerDir = path.join(dir, 'src', 'logger');
  if (opts.logger === 'winston') {
    await writeFile(path.join(loggerDir, 'index.ts'),
      `import winston from 'winston';\nimport 'winston-daily-rotate-file';\nconst { combine, timestamp, printf, colorize, errors } = winston.format;\nconst devFmt = combine(colorize({ all: true }), timestamp({ format: 'HH:mm:ss' }), errors({ stack: true }), printf(({ level, message, timestamp: ts, stack }) => \`\${ts as string} [\${level}]: \${(stack as string | undefined) ?? (message as string)}\`));\nconst prodFmt = combine(timestamp(), errors({ stack: true }), winston.format.json());\nexport const logger = winston.createLogger({\n  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',\n  format: process.env.NODE_ENV === 'production' ? prodFmt : devFmt,\n  transports: [new winston.transports.Console(), ...(process.env.NODE_ENV === 'production' ? [new winston.transports.DailyRotateFile({ filename: 'logs/app-%DATE%.log', datePattern: 'YYYY-MM-DD', zippedArchive: true, maxSize: '20m', maxFiles: '14d' })] : [])],\n  exceptionHandlers: [new winston.transports.Console()],\n  rejectionHandlers: [new winston.transports.Console()],\n});\n`);
  } else if (opts.logger === 'pino') {
    await writeFile(path.join(loggerDir, 'index.ts'),
      `import pino from 'pino';\nexport const logger = pino({\n  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',\n  ...(process.env.NODE_ENV !== 'production' && { transport: { target: 'pino-pretty', options: { colorize: true, translateTime: 'HH:MM:ss Z', ignore: 'pid,hostname' } } }),\n});\n`);
    await writeFile(path.join(dir, 'src', 'middleware', 'httpLogger.ts'),
      `import pinoHttp from 'pino-http';\nimport { logger } from '../logger/index.js';\nexport const httpLogger = pinoHttp({ logger });\n`);
  }
}
