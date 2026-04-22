# Architecture Patterns

`create-express-forge` supports two main architecture patterns to fit your project's needs.

## 📦 Modular Architecture (Recommended)

This is the default and recommended pattern for medium to large applications. It organizes code by **features** rather than technical roles.

### Structure:
```text
src/
  modules/
    users/
      users.controller.ts
      users.service.ts
      users.routes.ts
    products/
      ...
```

## 🏛 MVC Architecture

A classic Model-View-Controller pattern. Best for smaller projects or those who prefer a traditional separation of concerns.

### Structure:
```text
src/
  controllers/
  models/
  routes/
  services/
```
