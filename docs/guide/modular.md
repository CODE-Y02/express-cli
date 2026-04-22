# Modular Architecture

The **Modular** pattern is the recommended architecture for most projects. It organizes your code by **Domain/Feature** rather than technical layers.

## Structure

Each feature lives in its own folder under `src/modules/`. This makes it easy to scale and maintain as your project grows.

```text
src/
├── modules/
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.routes.ts
│   │   ├── users.schema.ts    # Validation logic
│   │   └── index.ts           # Public exports
│   └── auth/
│       ├── auth.controller.ts
│       └── ...
├── config/                  # Shared configurations
└── middleware/              # Shared middleware
```

## Benefits

1.  **Encapsulation**: Everything related to a feature is in one place.
2.  **Scalability**: Adding a new feature is as simple as creating a new folder.
3.  **Readability**: Clear boundaries between different parts of the application.
