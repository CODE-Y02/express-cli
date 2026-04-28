---
"create-express-forge": patch
"@create-express-forge/mcp": patch
---

- Added support for scaffolding in the current directory (`.`)
- Implemented automated import alias resolution (`@/`) for scaffolded projects
- Fixed relative import bug in smoke test template
- Synchronized documentation with latest v4 features (Zod-to-OpenAPI, Biome, Pro Fail-Fast)
- Added a **High-Fidelity Personalized Welcome** message using a large gradient-styled font (powered by `figlet` and `gradient-string`) to greet users by name
- Added documentation versioning support with v3 LTS dropdown
- Enhanced documentation SEO, OpenGraph metadata, and social sharing tags
- Standardized product naming to "Create Express Forge" across docs and CLI
- Added a dedicated **MCP Server** (`@create-express-forge/mcp`) for AI-assisted scaffolding and documentation access
- Automated generation of LLM-friendly documentation files (`llms.txt`, `llms-full.txt`, `ai.json`)
- Highlighted **Ultra-Fast scaffolding** in the v3 vs v4 comparison (powered by internal refactoring)
- Updated root and package READMEs with new features and Biome integration
- Removed deprecated `cef` alias from documentation
- Fixed file paths in CONTRIBUTING.md
- Updated v3 documentation and root README to target the correct stable legacy version (`3.3.2`)
