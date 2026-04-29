import { defineConfig } from "vitepress";

// Detect if we are running in GitHub Actions and set the base path accordingly
const rawBase = process.env.VITEPRESS_BASE || "/express-cli/";
const base = rawBase.endsWith("/") ? rawBase : `${rawBase}/`;

export default defineConfig({
  title: "Create Express Forge",
  description: "⚡ Production-ready Express backends in seconds",
  base: base,
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: "https://code-y02.github.io/express-cli",
  },

  head: [
    ["link", { rel: "icon", href: `${base}logo.svg` }],
    [
      "meta",
      {
        name: "keywords",
        content:
          "express, typescript, nodejs, backend, api, generator, scaffold, prisma, sequelize, architecture, mvc, modular, rest-api, server-boilerplate",
      },
    ],
    ["meta", { name: "author", content: "Yatharth Lakhate" }],
    ["meta", { property: "og:type", content: "website" }],
    [
      "meta",
      {
        property: "og:title",
        content: "create-express-forge | The Ultimate Express + TypeScript Generator",
      },
    ],
    [
      "meta",
      {
        property: "og:description",
        content:
          "Scaffold production-ready Express.js TypeScript backends in seconds with built-in Auth, ORM, and OpenAPI support.",
      },
    ],
    ["meta", { property: "og:image", content: `${base}og-image.png` }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:site", content: "@code_y02" }],
    ["meta", { name: "twitter:title", content: "Create Express Forge" }],
    [
      "meta",
      {
        name: "twitter:description",
        content: "⚡ Production-ready Express backends in seconds",
      },
    ],
    ["meta", { name: "twitter:image", content: `${base}og-image.png` }],
    [
      "script",
      { type: "application/ld+json" },
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Create Express Forge",
        "operatingSystem": "Node.js",
        "applicationCategory": "DeveloperApplication",
        "description": "The ultimate CLI for scaffolding production-ready Express.js TypeScript backends.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
        },
        "author": {
          "@type": "Person",
          "name": "Yatharth Lakhate",
        },
      }),
    ],
  ],

  themeConfig: {
    logo: `${base}logo.svg`,

    search: {
      provider: "local",
    },

    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "Features", link: "/guide/features" },
      { text: "Reference", link: "/reference/cli-options" },
      {
        text: "Versions",
        items: [
          { text: "v4.x (Latest)", link: "/" },
          { text: "v3.x (LTS)", link: "/v3/" },
        ],
      },
      {
        text: "⭐ Star on GitHub",
        link: "https://github.com/CODE-Y02/express-cli",
      },
    ],

    sidebar: {
      "/": [
        {
          text: "Introduction",
          items: [
            { text: "What is create-express-forge?", link: "/" },
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
      "/v3/": [
        {
          text: "v3 Docs",
          items: [
            { text: "Introduction", link: "/v3/" },
            { text: "Getting Started", link: "/v3/guide/getting-started" },
          ],
        },
        {
          text: "Core Concepts",
          items: [
            { text: "Architecture Patterns", link: "/v3/guide/architecture" },
            { text: "Project Structure", link: "/v3/guide/structure" },
            { text: "Core Features", link: "/v3/guide/features" },
            { text: "Authentication", link: "/v3/guide/auth" },
            { text: "Caching", link: "/v3/guide/caching" },
            { text: "API Documentation", link: "/v3/guide/openapi" },
          ],
        },
        {
          text: "Reference",
          items: [
            { text: "CLI Options", link: "/v3/reference/cli-options" },
            { text: "Configuration", link: "/v3/reference/config" },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/CODE-Y02/express-cli" },
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2026 Yatharth Lakhate",
    },
  },
});
