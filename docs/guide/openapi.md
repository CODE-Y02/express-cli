---
title: "API Documentation (OpenAPI) | Create Express Forge"
description: "Learn how to generate automated, type-safe OpenAPI (Swagger) documentation using Zod schemas with Create Express Forge."
head:
  - - link
    - rel: canonical
      href: https://code-y02.github.io/express-cli/guide/openapi
  - - meta
    - property: og:title
      content: "Type-Safe OpenAPI Docs for Express.js | Create Express Forge"
  - - meta
    - property: og:description
      content: "Zero-JSDoc documentation for your Express.js API. Sync your Zod schemas with Swagger UI effortlessly."
  - - meta
    - property: og:url
      content: https://code-y02.github.io/express-cli/guide/openapi
---

# API Documentation (OpenAPI)
 
Create Express Forge uses `@asteasolutions/zod-to-openapi` to provide interactive, type-safe documentation for your API. This ensures that your runtime validation and your API documentation are always in sync.
 
## Getting Started
 
If you enabled OpenAPI during scaffolding, your documentation is available at:
 
- **Interactive UI**: `http://localhost:3000/api-docs`
- **OpenAPI Spec**: `http://localhost:3000/api-docs.json` (Raw JSON)
 
> [!TIP]
> On server startup, the CLI automatically logs the documentation URL for easy access.
 
## Zero-JSDoc Documentation
 
Unlike traditional Express apps that rely on clunky JSDoc comments (`@openapi`), Create Express Forge uses your **Zod schemas** to generate the OpenAPI specification. This makes your documentation:
1. **DRY (Don't Repeat Yourself)**: Define your schema once, use it for validation and documentation.
2. **Type-Safe**: Any changes to your Zod schemas are automatically reflected in the Swagger UI.
3. **Clean**: Your controller files stay free of giant comment blocks.
 
## How it Works
 
### 1. The Registry
A centralized registry is located at `src/docs/registry.ts`. This registry collects all your path and component definitions.
 
### 2. Documenting a Path
Paths are registered directly in your `schema.ts` files. This keeps the documentation close to the validation logic.
 
```typescript
import { z } from 'zod';
import { registry } from '@/docs/registry.js';
 
// Define your schema
export const UserSchema = registry.register('User', z.object({
  id: z.string().uuid(),
  name: z.string(),
}));
 
// Register the path
registry.registerPath({
  method: 'get',
  path: '/users',
  summary: 'Get all users',
  responses: {
    200: {
      description: 'List of users',
      content: {
        'application/json': {
          schema: z.array(UserSchema),
        },
      },
    },
  },
});
```
 
### 3. Setting Up Swagger
The `setupSwagger` function in `src/docs/swagger.ts` generates the final OpenAPI document from the registry and attaches the Swagger UI to your Express app.
 
## Benefits
- **Live Testing**: Use the "Try it out" button to make real requests to your development server.
- **Auto-Sync**: Your documentation is built from your code, ensuring it never gets stale.
- **Standardized**: Uses the OpenAPI 3.0 specification, compatible with Postman, Insomnia, and code generators.
