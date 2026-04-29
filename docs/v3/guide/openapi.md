# API Documentation (OpenAPI)

Create Express Forge integrates **Swagger UI** to provide interactive, live documentation for your API. This allows your frontend team or external partners to test endpoints directly from the browser.

## Getting Started

If you enabled OpenAPI during scaffolding, your documentation is available at:

- **Swagger UI**: `http://localhost:3000/docs` (Interactive)
- **OpenAPI Spec**: `http://localhost:3000/docs.json` (Raw JSON)

> [!TIP]
> The `/docs.json` endpoint is always available for external tools (like Postman), even if you chose to disable the Swagger UI during scaffolding.

## Configuration

The documentation configuration is located in `src/docs/swagger.ts`. It uses `swagger-jsdoc` to parse JSDoc comments in your route files.

## Documenting Endpoints

To add an endpoint to the Swagger UI, simply add a `@openapi` or `@swagger` block above your route definition.

### Example

```typescript
/**
 * @openapi
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     description: Returns a list of users from the database.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', userController.getAllUsers);
```

## Benefits
- **Live Testing**: Use the "Try it out" button to make real requests to your development server.
- **Auto-Sync**: Your documentation lives next to your code, making it easier to keep it updated.
- **Standardized**: Uses the OpenAPI 3.0 specification, compatible with many other tools (Postman, Insomnia, etc.).
