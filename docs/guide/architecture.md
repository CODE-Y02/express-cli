# Architecture Patterns

Express Forge supports two main architecture patterns to fit your project's needs. Choosing the right one is crucial for long-term maintainability.

## 📦 Modular Architecture (Recommended)

This is the default and recommended pattern for medium to large applications. It organizes code by **features** (modules) rather than technical roles (controllers, models).

### Why choose Modular?
- **Scalability**: Each module is self-contained, making it easier to manage as the app grows.
- **Isolation**: Changes to one feature are less likely to break another.
- **Team-Friendly**: Different developers can work on different modules without merge conflicts.

### Structure:
```text
src/
  modules/
    users/
      users.controller.ts  # Request handling
      users.service.ts     # Business logic
      users.routes.ts      # Route definitions
      users.schema.ts      # Validation schemas
    products/
      ...
```

---

## 🏛 MVC Architecture

A classic Model-View-Controller pattern. Best for smaller projects or those who prefer a traditional separation of concerns based on technical layers.

### Why choose MVC?
- **Familiarity**: Most developers are familiar with this pattern from frameworks like Rails or Django.
- **Simplicity**: For very small apps, it might be quicker to navigate.

### Structure:
```text
src/
  controllers/  # All controllers in one place
  models/       # Database models
  routes/       # All route definitions
  services/     # Business logic
```

## Which one should I use?

If you are building a production API that you expect to grow over time, **Modular Architecture** is almost always the better choice. It prevents the "Fat Controller" and "Fat Model" syndromes by keeping related logic close together.

