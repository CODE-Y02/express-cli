---
title: "AI Integration & MCP | Create Express Forge"
description: "Build AI-Native Express.js apps. Learn how to use the Create Express Forge MCP server and LLM context files for better AI-assisted development."
head:
  - - link
    - rel: canonical
      href: https://code-y02.github.io/express-cli/guide/ai-integration
  - - meta
    - property: og:title
      content: "AI-Native Express.js Development | Create Express Forge"
  - - meta
    - property: og:description
      content: "Supercharge your development with MCP and LLM-friendly documentation. Built for Cursor, Claude, and Antigravity."
  - - meta
    - property: og:url
      content: https://code-y02.github.io/express-cli/guide/ai-integration
---

# AI Integration & MCP

Create Express Forge v4 is built to be "AI-Native". This means every project you scaffold comes with built-in infrastructure to help AI coding assistants (like Cursor, Claude, or Antigravity) understand and work with your codebase more effectively.

## Model Context Protocol (MCP)

We provide a dedicated MCP server that allows AI tools to interface directly with your project's documentation and scaffolding logic.

### Using the MCP Server

You can add our MCP server to your favorite AI IDE (like Cursor) or agent:

- **Server Name**: `Create Express Forge MCP`
- **Command**: `npx -y @create-express-forge/mcp`

Once connected, your AI assistant can:
- Fetch the latest documentation for any feature.
- Explain the project architecture.
- Help you generate new modules following the project's specific patterns.

## LLM Context Files

Every scaffolded project includes a set of `.txt` and `.json` files in the `docs/public` (or equivalent) directory that are specifically optimized for Large Language Models.

### `llms.txt`
Located at the root of your documentation, this file provides a high-level summary of the project, its tech stack, and key patterns. AI assistants use this as a "map" to understand your code.

### `ai.json`
A machine-readable manifest that describes the project's features, available commands, and documentation structure.

## How it Helps

1. **Hallucination-Free Code**: By providing the AI with direct access to our documentation via MCP, it is less likely to suggest deprecated APIs or incorrect patterns.
2. **Instant Onboarding**: New developers using AI tools can understand the entire architecture just by asking the assistant to "summarize the project structure using the MCP server".
3. **Automated Documentation**: Our build process automatically keeps these LLM context files in sync with your source code.

## Configuration

You can customize the AI behavior by modifying the `ai.json` file in your project root or by updating the MCP server settings.

::: tip PRO TIP
If you are using Cursor, add `https://expressforge.com/llms.txt` to your `@docs` to give the AI agent full knowledge of the framework!
:::
