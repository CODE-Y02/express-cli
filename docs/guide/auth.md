# Authentication

Express Forge provides two battle-tested authentication strategies: **JWT** (JSON Web Tokens) and **Sessions**.

## Strategies

### 🔐 JWT (Stateless)
The modern standard for web APIs. Highly scalable and perfect for mobile apps and SPAs.
- **Middleware**: `src/middlewares/auth.middleware.ts`
- **Config**: Set `JWT_SECRET` in your `.env`.

### 🍪 Session (Stateful)
Traditional cookie-based authentication. Excellent for server-side rendered apps or when you need built-in session management.
- **Middleware**: `src/middlewares/auth.middleware.ts`
- **Config**: Set `SESSION_SECRET` in your `.env`.

## Using the Auth Middleware

To protect a route, simply add the `auth` middleware to your route definition.

```typescript
import { auth } from '../middlewares/auth.middleware.js';
import { userController } from '../controllers/user.controller.js';

// Protected route
router.get('/profile', auth, userController.getProfile);
```

## Accessing the User

Once a user is authenticated, their information is attached to the `req.user` object (for JWT) or `req.session.user` (for Sessions).

```typescript
export const getProfile = (req: Request, res: Response) => {
  const user = req.user; // For JWT
  return ApiResponse.success(res, user);
};
```

## Security Best Practices
1.  **Secret Management**: Never commit your `JWT_SECRET` or `SESSION_SECRET` to version control. Use `.env` files.
2.  **HTTPS**: Always serve your API over HTTPS in production to protect tokens and session cookies.
3.  **HTTP-Only Cookies**: If using sessions, Express Forge pre-configures cookies to be `httpOnly` to prevent XSS attacks.
