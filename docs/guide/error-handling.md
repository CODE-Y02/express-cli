# Error Handling

`create-express-forge` implements a centralized error handling mechanism to ensure consistent API responses and simplify your route logic.

## Centralized Middleware

The generated app includes a global error handler located in `src/middleware/error.ts`. This middleware catches all errors thrown in your application and formats them into a standard JSON response.

### Standard Response Format:
```json
{
  "status": "error",
  "message": "User not found",
  "stack": "..." // Only in development
}
```

## The ApiError Class

Instead of throwing generic errors, use the provided `ApiError` class to specify HTTP status codes.

```typescript
import { ApiError } from '../utils/ApiError';

throw new ApiError(404, 'User not found');
```

## Async Handler

To avoid `try/catch` blocks in every route, all controllers are wrapped in an `asyncHandler`. This automatically catches rejected promises and passes them to the global error handler.

```typescript
export const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getById(req.params.id);
  res.json(user);
});
```
