---
layout: home

hero:
  name: create-express-forge
  text: Production-ready Express backends in seconds
  tagline: Interactive CLI that scaffolds TypeScript + Express.js with Prisma, Docker, testing, logging, and centralized error handling — all configured and ready to ship.
  image:
    src: /logo.svg
    alt: create-express-forge
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/CODE-Y02/express-cli

features:
  - icon: ⚡
    title: Zero to API in 30 seconds
    details: Interactive prompts guide you through architecture, ORM, database, logger, testing, and Docker — then scaffold everything instantly.
  - icon: 🔒
    title: Secure by default
    details: Helmet, CORS, rate limiting, and Zod request validation are built into every generated project. No extra config needed.
  - icon: 🛡️
    title: Global Error Handling
    details: Centralized error handler catches ApiError, ZodError, and unknown errors. asyncHandler wraps routes — no try/catch needed.
  - icon: 🔷
    title: Prisma-first ORM
    details: Auto-generates Prisma schema, seed file, singleton client with hot-reload support, and all migration scripts.
  - icon: 🐳
    title: Docker ready
    details: Multi-stage Dockerfile with healthcheck + docker-compose with the correct database service — PostgreSQL or MySQL.
  - icon: 🧪
    title: Tests included
    details: Vitest or Jest pre-configured with a working health-check integration test using Supertest.
---
