# create-express-forge

> ⚡ Scaffold production-ready Express.js TypeScript backends in seconds

[![npm version](https://img.shields.io/npm/v/create-express-forge.svg)](https://www.npmjs.com/package/create-express-forge)
[![CI](https://github.com/CODE-Y02/express-cli/actions/workflows/pipeline.yml/badge.svg)](https://github.com/CODE-Y02/express-cli/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Quick Start

```bash
npx create-express-forge my-api
# or scaffold in current directory
npx create-express-forge .
```

## What You Get

Interactive prompts let you choose:

| Option | Choices |
|--------|---------|
| **Architecture** | Modular (feature-based) · MVC |
| **ORM** | Prisma · Sequelize · None |
| **Database** | PostgreSQL · MySQL · SQLite · None |
| **Logger** | Winston · Pino · None |
| **Testing** | Vitest · Jest · None |
| **Docker** | Dockerfile + docker-compose |

## Generated Project Includes

- ✅ **TypeScript** + `tsx` hot-reload dev server + **Path Aliases (`@/`)**
- ✅ **Biome** — 20x faster linting and formatting (replaces ESLint/Prettier)
- ✅ **Zod** env validation on startup — fails fast on bad config
- ✅ **Global centralized error handler** — `ApiError`, `ZodError`, unknown errors all handled
- ✅ **Request validation middleware** via `validate(schema)`
- ✅ **`ApiError`** — custom class with static factories (`.notFound()`, `.unauthorized()`, etc.)
- ✅ **`ApiResponse`** — consistent JSON response helpers
- ✅ **`asyncHandler`** — wraps async routes, no try/catch needed
- ✅ **Helmet + CORS + compression + rate limiter**
- ✅ **Graceful shutdown** (SIGTERM / SIGINT)
- ✅ **Multi-stage Dockerfile** with healthcheck
- ✅ **docker-compose** with correct DB service
- ✅ **Automated OpenAPI (Swagger)** — Zero-JSDoc documentation via Zod schemas

## Repository Structure

```
create-express-forge/
├── packages/
│   ├── create-express-forge/   ← The published CLI
│   ├── typescript-config/      ← Shared internal TS config
│   └── lint-config/            ← Shared internal Biome/Lint config
├── examples/
│   └── modular-postgres-prisma/ ← Pre-generated example
└── .github/workflows/           ← CI + Release
```

## 🤖 AI & MCP Integration

Create Express Forge is designed to be AI-friendly. We provide a built-in **MCP (Model Context Protocol)** server that lets you chat with your AI assistant about the project, fetch documentation, and generate scaffolding commands.

### Using the MCP Server

1. **Build the project**: `pnpm build`
2. **Add to your MCP Client**: Add the following configuration to your client (e.g., Claude Desktop).

```json
{
  "mcpServers": {
    "create-express-forge": {
      "command": "node",
      "args": ["/absolute/path/to/express-cli/packages/mcp/dist/index.js"]
    }
  }
}
```

### LLM Documentation
We also provide machine-readable documentation files for LLMs:
- **`llms.txt`**: [Project summary](https://code-y02.github.io/express-cli/llms.txt)
- **`llms-full.txt`**: [Full documentation context](https://code-y02.github.io/express-cli/llms-full.txt)
- **`ai.json`**: [Capability manifest and CLI flags](https://code-y02.github.io/express-cli/ai.json)

## Legacy Support (v3.x)

Documentation for the legacy v3.x (LTS) version is available at [https://code-y02.github.io/express-cli/v3/](https://code-y02.github.io/express-cli/v3/).

To scaffold a project using v3.x, run:

```bash
npx create-express-forge@3.3.2 [project-name]
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Versioning & Branches

| Branch | npm tag | Description |
|--------|---------|-------------|
| `main` | `latest` | Stable releases |
| `next` | `next` | Pre-releases / beta |

## License

MIT © [Yatharth Lakhate](https://github.com/CODE-Y02)
