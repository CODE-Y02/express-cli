# Testing Framework

Whether you chose Vitest or Jest, your project is pre-configured for automated testing.

## Vitest (Recommended)

Vitest is a blazing fast unit test framework powered by Vite. It is ESM-native and provides a great developer experience.

### Commands
```bash
npm test         # Run tests
npm run test:ui  # Open Vitest UI
npm run coverage # View coverage report
```

## Health-Check Test

We include a sample integration test in `src/__tests__/health.test.ts` using **Supertest** to verify that your API is running correctly.

```typescript
import request from 'supertest';
import app from '../app';

describe('Health Check', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
  });
});
```
