# Error Handling

Every generated project includes a **global centralized error handler** — the most important middleware in the stack.

## How It Works

```
Route handler throws → asyncHandler catches → errorHandler formats response
```

### asyncHandler

Wraps async route handlers so you never need `try/catch`:

```ts
// ❌ Without asyncHandler
router.get('/', async (req, res, next) => {
  try {
    const users = await UserService.findAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// ✅ With asyncHandler
router.get('/', asyncHandler(async (req, res) => {
  const users = await UserService.findAll();
  ApiResponse.success(res, users);
}));
```

### ApiError

Custom error class with static factory methods:

```ts
throw ApiError.notFound('User not found');       // 404
throw ApiError.unauthorized('Invalid token');     // 401
throw ApiError.forbidden('Admin only');           // 403
throw ApiError.badRequest('Invalid input', []);   // 400
throw ApiError.conflict('Email taken');            // 409
throw ApiError.internal('Something broke');        // 500
```

### Global Error Handler

Catches everything and returns consistent JSON:

```json
{
  "success": false,
  "message": "User not found",
  "stack": "..." // only in development
}
```

It handles:
- **`ApiError`** → uses the statusCode and message
- **`ZodError`** → 400 with formatted validation errors
- **Unknown errors** → 500 with stack trace in dev

### ApiResponse

Consistent success responses:

```ts
ApiResponse.success(res, data, 'Users fetched');      // 200
ApiResponse.created(res, user, 'User created');        // 201
ApiResponse.noContent(res);                             // 204
ApiResponse.paginated(res, items, { total, page, limit, pages });
```
