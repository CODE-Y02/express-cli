import { defineConfig } from "vitepress";

// Detect if we are running in GitHub Actions and set the base path accordingly
const base = process.env.VITEPRESS_BASE || "/express-cli/";

export default defineConfig({
  title: "Express Forge",
  description: "⚡ Production-ready Express backends in seconds",
  base: base,
  
  // This is critical for GitHub Pages
  outDir: "./.vitepress/dist",

  head: [["link", { rel: "icon", href: `${base}logo.svg` }]],

  themeConfig: {
    logo: "/logo.svg",

    search: {
      provider: "local",
    },

    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "Features", link: "/guide/features" },
      {
        text: "Versions",
        items: [
          { text: "Latest (v2.x)", link: "https://code-y02.github.io/express-cli/" },
          { text: "Beta (Next)", link: "https://code-y02.github.io/express-cli/next/" },
          { text: "Legacy (v1.x)", link: "https://code-y02.github.io/express-cli/v1/" },
        ],
      },
      { text: "Reference", link: "/reference/cli-options" },
    ],

    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "What is Express Forge?", link: "/" },
          { text: "Getting Started", link: "/guide/getting-started" },
        ],
      },
      {
        text: "Core Concepts",
        items: [
          { text: "Architecture Patterns", link: "/guide/architecture" },
          { text: "Project Structure", link: "/guide/structure" },
          { text: "Core Features", link: "/guide/features" },
          { text: "Authentication", link: "/guide/auth" },
          { text: "Caching", link: "/guide/caching" },
          { text: "API Documentation", link: "/guide/openapi" },
        ],
      },
      {
        text: "Advanced",
        items: [
          { text: "Deployment", link: "/guide/deployment" },
          { text: "Testing Strategy", link: "/guide/testing" },
          { text: "Troubleshooting", link: "/guide/troubleshooting" },
        ],
      },
      {
        text: "Reference",
        items: [
          { text: "CLI Options", link: "/reference/cli-options" },
          { text: "Configuration", link: "/reference/config" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/CODE-Y02/express-cli" },
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2026 Yatharth Lakhate",
    },
  },
});
