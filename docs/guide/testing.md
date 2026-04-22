# Testing Strategy

Express Forge encourages a test-driven approach to development. We provide a pre-configured testing environment using either **Vitest** (recommended for speed) or **Jest**.

## 🧪 Types of Tests

### Unit Tests
Focused on testing individual functions or services in isolation.
- **Location**: `src/modules/**/__tests__/*.unit.spec.ts`
- **Focus**: Business logic, utility functions, validation.

### Integration Tests
Testing the full API flow, including database interactions.
- **Location**: `tests/*.int.spec.ts`
- **Focus**: HTTP status codes, API responses, database persistence.

## 🚀 Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🛠 Testing Tools

- **Supertest**: Used for making HTTP requests to your app without starting a real server.
- **Prisma Mocking**: (If using Prisma) We provide patterns for mocking the Prisma client for unit tests.
- **Test Database**: Integration tests automatically use a separate test database defined in `.env.test`.

## Example Integration Test

```typescript
import request from 'supertest';
import { app } from '../src/app';

describe('GET /health', () => {
  it('should return 200 OK', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});
```
