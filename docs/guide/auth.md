---
title: "Authentication Strategies: JWT & Sessions | Create Express Forge"
description: "Implement secure authentication in Express.js. Choose between stateless JWT (Cookies/Headers) or stateful Sessions with pre-configured middleware."
head:
  - - link
    - rel: canonical
      href: https://create-express-forge.js.org/guide/auth
  - - meta
    - property: og:title
      content: "JWT & Session Auth for Express.js | Create Express Forge"
  - - meta
    - property: og:description
      content: "Battle-tested authentication strategies for production Express.js apps. JWT vs Sessions, Cookie security, and Middleware usage."
  - - meta
    - property: og:url
      content: https://create-express-forge.js.org/guide/auth
---

# Authentication

Create Express Forge provides two battle-tested authentication strategies: **JWT** (JSON Web Tokens) and **Sessions**.

## Strategies

### 🔐 JWT (Stateless)
The modern standard for web APIs. Highly scalable and perfect for mobile apps and SPAs.
- **Middleware**: `src/middleware/auth.ts`
- **Storage Options**:
  - **🍪 Cookie**: More secure against XSS. Uses `httpOnly` and `secure` flags.
  - **📨 Header**: Standard `Authorization: Bearer <token>`. Recommended for mobile apps.
- **Config**: Set `JWT_SECRET` and `JWT_EXPIRES_IN` in your `.env`.

### 🍪 Session (Stateful)
Traditional cookie-based authentication. Excellent for server-side rendered apps or when you need built-in session management.
- **Middleware**: `src/middleware/auth.ts`
- **Config**: Set `SESSION_SECRET` in your `.env`.

## Using the Auth Middleware

To protect a route, simply add the `auth` middleware to your route definition.

```typescript
import { auth } from '../middleware/auth.js';
import { todosController } from '../modules/todos/todos.controller.js';

// Protected route
router.get('/', auth, todosController.getTodos);
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
3.  **HTTP-Only Cookies**: If using sessions, Create Express Forge pre-configures cookies to be `httpOnly` to prevent XSS attacks.
