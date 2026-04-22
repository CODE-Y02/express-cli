import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Express Forge",
  description: "⚡ Production-ready Express backends in seconds",

  // Important for GitHub Pages deployment
  base: "/express-cli/",

  head: [["link", { rel: "icon", href: "/express-cli/logo.svg" }]],

  themeConfig: {
    logo: "/logo.svg",

    search: {
      provider: "local",
    },

    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "Features", link: "/guide/features" },
      { text: "Reference", link: "/reference/cli-options" },
    ],

    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "What is Express Forge?", link: "/" },
          { text: "Getting Started", link: "/guide/getting-started" },
          { text: "Roadmap", link: "/roadmap" },
        ],
      },
      {
        text: "Core Concepts",
        items: [
          { text: "Architecture Patterns", link: "/guide/architecture" },
          { text: "Project Structure", link: "/guide/structure" },
          { text: "Core Features", link: "/guide/features" },
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
