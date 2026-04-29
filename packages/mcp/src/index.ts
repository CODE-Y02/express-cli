#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const DOCS_BASE = "https://create-express-forge.js.org";

const server = new McpServer({
  name: "@create-express-forge/mcp",
  version: "1.0.0",
});

// ─── Resources ─────────────────────────────────────────────────────────────

// Discovery Manifest (JSON index)
server.registerResource(
  "manifest",
  `${DOCS_BASE}/ai.json`,
  {
    description: "Machine-readable index of capabilities, CLI flags, common patterns, and documentation slugs.",
  },
  async (uri) => {
    try {
      const res = await fetch(uri.href);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.text();
      return { contents: [{ uri: uri.href, mimeType: "application/json", text: json }] };
    } catch (_e) {
      // Fallback to llms.txt if ai.json is missing
      const fallbackUrl = `${DOCS_BASE}/llms.txt`;
      const res = await fetch(fallbackUrl);
      if (!res.ok) throw new Error(`Manifest and Fallback failed: ${res.status}`);
      const text = await res.text();
      return { contents: [{ uri: fallbackUrl, mimeType: "text/plain", text }] };
    }
  },
);

// Full documentation (primary resource)
server.registerResource(
  "docs-full",
  `${DOCS_BASE}/llms-full.txt`,
  {
    description: "Full Create Express Forge API documentation, architecture guides, and CLI reference.",
  },
  async (uri) => {
    try {
      const res = await fetch(uri.href);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      return { contents: [{ uri: uri.href, mimeType: "text/plain", text }] };
    } catch (_e) {
      const fallbackUrl = `${DOCS_BASE}/llms.txt`;
      const res = await fetch(fallbackUrl);
      if (!res.ok) throw new Error(`Full Docs and Fallback failed: ${res.status}`);
      const text = await res.text();
      return { contents: [{ uri: fallbackUrl, mimeType: "text/plain", text }] };
    }
  },
);

// ─── Tools ──────────────────────────────────────────────────────────────────

/**
 * get-docs — fetch the full documentation on demand.
 */
server.registerTool(
  "get-docs",
  {
    description: "Fetch the full documentation for a specific version of Create Express Forge.",
    inputSchema: z.object({
      version: z.enum(["v4", "v3"]).default("v4").describe("Documentation version (v4 = latest, v3 = lts)"),
    }),
  },
  async ({ version }) => {
    const subPath = version === "v3" ? "/v3" : "";
    const res = await fetch(`${DOCS_BASE}${subPath}/llms-full.txt`);
    if (!res.ok) {
      return {
        content: [{ type: "text", text: `Failed to fetch ${version} documentation (HTTP ${res.status}).` }],
        isError: true,
      };
    }
    const text = await res.text();
    return {
      content: [{ type: "text", text: `# Create Express Forge ${version} Documentation\nSource: ${DOCS_BASE}${subPath}/llms-full.txt\n\n${text}` }],
    };
  }
);

/**
 * get-page — fetch a specific documentation page by slug and version.
 */
server.registerTool(
  "get-page",
  {
    description: "Fetch a specific Create Express Forge documentation page for a specific version.",
    inputSchema: z.object({
      slug: z.string().describe("Page slug, e.g. 'guide/getting-started' or 'reference/cli-options'"),
      version: z.enum(["v4", "v3"]).default("v4").describe("Documentation version"),
    }),
  },
  async ({ slug, version }) => {
    const cleanSlug = slug.replace(/^\/+|\/+$/g, "");
    const subPath = version === "v3" ? "/v3" : "";
    const url = `${DOCS_BASE}${subPath}/${cleanSlug}.md`;
    const res = await fetch(url);
    if (!res.ok) {
      return {
        content: [{ type: "text", text: `Page not found for version ${version}: ${url}. Check the 'manifest' resource for available slugs.` }],
        isError: true,
      };
    }
    const text = await res.text();
    return {
      content: [{ type: "text", text: `# Documentation (${version}): ${cleanSlug}\nSource: ${url}\n\n${text}` }],
    };
  }
);

/**
 * get-scaffold-command — helper to generate the correct npx command based on requirements.
 */
server.registerTool(
  "get-scaffold-command",
  {
    description: "Generate the correct npx create-express-forge command with appropriate flags based on project requirements.",
    inputSchema: z.object({
      version: z.enum(["v4", "v3"]).default("v4").describe("Version of the CLI to use (v4 = latest, v3 = 3.3.2)"),
      projectName: z.string().default("my-api").describe("Name of the project"),
      pattern: z.enum(["modular", "mvc"]).optional().describe("Architecture pattern"),
      orm: z.enum(["prisma", "sequelize", "none"]).optional().describe("ORM to use"),
      db: z.enum(["postgresql", "mysql", "sqlite", "none"]).optional().describe("Database type"),
      install: z.boolean().optional().describe("Whether to auto-install dependencies"),
    }),
  },
  async ({ version, projectName, pattern, orm, db, install }) => {
    const versionTag = version === "v3" ? "3.3.2" : "latest";
    let command = `npx create-express-forge@${versionTag} ${projectName}`;
    if (pattern) command += ` --pattern ${pattern}`;
    if (orm) command += ` --orm ${orm}`;
    if (db) command += ` --db ${db}`;
    if (install !== undefined) command += ` --install ${install}`;
    
    return {
      content: [
        { 
          type: "text", 
          text: `Use the following command to scaffold your project:\n\n\`\`\`bash\n${command}\n\`\`\`` 
        }
      ],
    };
  }
);

// ─── Start Server ───────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Create Express Forge MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});

