# Testing

The CLI supports **Vitest** (recommended) and **Jest** with Supertest for HTTP integration tests.

## Vitest

Generates `vitest.config.ts` and a sample health check test:

```ts
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';

describe('Health', () => {
  it('GET /api/health → 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ok');
  });
});
```

### Scripts

```bash
npm run test            # Run once
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage report
```

## Jest

Generates `jest.config.ts` with ESM support via `ts-jest`:

```bash
npm run test            # Run once
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage
```

## Writing Tests

### Testing a Route

```ts
import request from 'supertest';
import { app } from '../app.js';

describe('POST /api/v1/users', () => {
  it('creates a user with valid data', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send({ name: 'John', email: 'john@example.com', password: '12345678' });

    expect(res.status).toBe(201);
    expect(res.body.data.email).toBe('john@example.com');
  });

  it('rejects invalid email', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .send({ name: 'John', email: 'bad', password: '12345678' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
```
