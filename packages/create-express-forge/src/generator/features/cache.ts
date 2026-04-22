import path from 'path';
import fs from 'fs-extra';
import type { CliOptions } from '../../types.js';

export async function generateCache(opts: CliOptions, targetDir: string): Promise<void> {
  if (opts.cache === 'none') return;

  const cacheDir = path.join(targetDir, 'src/cache');
  await fs.ensureDir(cacheDir);

  if (opts.cache === 'redis') {
    await fs.writeFile(
      path.join(cacheDir, 'index.ts'),
      `import { createClient } from 'redis';
import { logger } from '../logger/index.js';

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => logger.error('Redis Client Error', err));

export const connectRedis = async () => {
  await client.connect();
  logger.info('🔴 Redis connected successfully');
};

export const cache = {
  get: async (key: string) => client.get(key),
  set: async (key: string, value: string, ttlSeconds?: number) => {
    if (ttlSeconds) {
      await client.set(key, value, { EX: ttlSeconds });
    } else {
      await client.set(key, value);
    }
  },
  del: async (key: string) => client.del(key),
};
`
    );
  } else if (opts.cache === 'node-cache') {
    await fs.writeFile(
      path.join(cacheDir, 'index.ts'),
      `import NodeCache from 'node-cache';
import { logger } from '../logger/index.js';

const nodeCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

logger.info('💾 In-memory cache initialized');

export const cache = {
  get: async (key: string) => nodeCache.get(key) as string | undefined,
  set: async (key: string, value: string, ttlSeconds?: number) => {
    if (ttlSeconds) {
      nodeCache.set(key, value, ttlSeconds);
    } else {
      nodeCache.set(key, value);
    }
  },
  del: async (key: string) => {
    nodeCache.del(key);
  },
};
`
    );
  }
}
