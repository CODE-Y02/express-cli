# Getting Started
 
Express Forge is designed to get you up and running with a production-grade Express backend in seconds.

## Quick Start

The fastest way to create a new project is using `npx`. You don't even need to install the CLI globally!

```bash
npx create-express-forge@latest [project-name]
```

### Instant Scaffolding

If you want to skip the prompts and use the recommended defaults, use the `--yes` flag:

```bash
npx create-express-forge@latest my-api --yes
```

## Step-by-Step Guide

### 1. Initialize Project
Run the command and follow the interactive prompts. You'll be asked to:
- Give your project a **name**.
- Select your preferred **package manager** (npm, pnpm, yarn).
- Choose an **architecture** (Modular or MVC).
- Select an **ORM** (Prisma, Sequelize, or none).
- Choose a **Testing Framework** (Vitest or Jest).

### 2. Enter Directory
```bash
cd my-awesome-api
```

### 3. Start Development
```bash
npm run dev
```

Your API will now be running at `http://localhost:3000` with hot-reloading enabled.

## Next Steps

- Explore the [Architecture Patterns](./architecture) to understand how your code is organized.
- Check out the [Core Features](./features) to see what's included out of the box.
- Configure your environment variables in the `.env` file.
