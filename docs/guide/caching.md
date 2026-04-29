---
title: "Caching in Express.js: Redis & Node-Cache | Create Express Forge"
description: "Boost your API performance with built-in caching. Learn how to configure Redis for distributed systems or Node-Cache for in-memory speed."
head:
  - - link
    - rel: canonical
      href: https://create-express-forge.js.org/guide/caching
  - - meta
    - property: og:title
      content: "Redis & In-Memory Caching for Express | Create Express Forge"
  - - meta
    - property: og:description
      content: "Performance-first caching strategies for Express.js. Configure Redis or Node-Cache in seconds with Create Express Forge."
  - - meta
    - property: og:url
      content: https://create-express-forge.js.org/guide/caching
---

# Caching

Create Express Forge provides a flexible caching layer to boost your API performance and reduce database load. You can choose between **Redis** (distributed) or **Node-Cache** (in-memory) during the scaffolding process.

## Supported Drivers

### 🔴 Redis
Recommended for production environments and distributed systems where multiple server instances need to share a cache.
- **Requirement**: A running Redis instance.
- **Config**: Set `REDIS_URL` in your `.env` file.

### 💾 Node-Cache
An in-memory caching solution that requires zero external dependencies. Perfect for simple applications or single-server setups.
- **Requirement**: None.
- **Config**: Automatic.

## Usage

The caching logic is encapsulated in `src/cache/index.ts`. It provides a unified interface regardless of the driver you chose.

### Getting a Value
```typescript
import { cache } from '../cache/index.js';

const user = await cache.get('user:123');
if (user) {
  return JSON.parse(user);
}
```

### Setting a Value
You can optionally set a Time-To-Live (TTL) in seconds.
```typescript
import { cache } from '../cache/index.js';

// Cache for 1 hour (3600 seconds)
await cache.set('user:123', JSON.stringify(userData), 3600);
```

### Deleting a Value
```typescript
import { cache } from '../cache/index.js';

await cache.del('user:123');
```

## Best Practices
1.  **Cache Invalidation**: Always delete or update the cache when the underlying data in the database changes.
2.  **Serialization**: Since Redis only stores strings, ensure you `JSON.stringify()` your objects before setting and `JSON.parse()` when getting.
3.  **Pro Fail-Fast**: In production, Create Express Forge strictly validates Redis connectivity on startup. If Redis is down, the app fails early to prevent inconsistent states. In development, it provides a clear warning and continues.
