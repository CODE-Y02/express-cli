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
  // Collected during transformHead, consumed in buildEnd
  transformHead(ctx) {
    const siteUrl = "https://code-y02.github.io/express-cli";
    const slug = ctx.page.replace(/\.md$/, "").replace(/^index$/, "home");
    const title = ctx.pageData.title || ctx.title || "Create Express Forge";
    const description = ctx.pageData.description || ctx.description || "";

    // Store for buildEnd (we'll manually manage the list to avoid build-time issues)
    const ogImageUrl = `${siteUrl}/og/${slug}.png`;
    
    return [
      ["meta", { property: "og:image", content: ogImageUrl }],
      ["meta", { name: "twitter:image", content: ogImageUrl }],
    ];
  },

  async buildEnd(siteConfig) {
    console.log('\n🚀 [og-image] Generating dynamic OG images...');
    
    // We need to scrape the pages to generate images for them
    // For simplicity in this environment, we'll import the generator
    const { generateOgImages } = await import("./og-image.js");
    
    // Define the pages we want images for (matching the sidebar and guide)
    const pages = [
      { slug: "home", title: "Create Express Forge", description: "Build Better Express APIs, Faster." },
      { slug: "guide/getting-started", title: "Getting Started", description: "Scaffold your Express.js project in seconds." },
      { slug: "guide/architecture", title: "Architecture Patterns", description: "Modular vs MVC patterns for Express.js." },
      { slug: "guide/structure", title: "Project Structure", description: "Understanding the Create Express Forge directory layout." },
      { slug: "guide/features", title: "Core Features", description: "Explore JWT Auth, ORM integration, and more." },
      { slug: "guide/auth", title: "Authentication", description: "Secure your API with JWT or Session-based Auth." },
      { slug: "guide/caching", title: "Caching", description: "Boost performance with Redis or Node-Cache." },
      { slug: "guide/openapi", title: "API Documentation", description: "Type-safe OpenAPI docs with Zod." },
      { slug: "guide/ai-integration", title: "AI Integration & MCP", description: "Build AI-Native apps with MCP and LLM context." },
      { slug: "guide/deployment", title: "Deployment", description: "Production-ready Docker and CI/CD setups." },
      { slug: "guide/testing", title: "Testing Strategy", description: "Pre-configured Vitest and Jest suites." },
      { slug: "guide/troubleshooting", title: "Troubleshooting", description: "Common issues and how to resolve them." },
    ];

    await generateOgImages(siteConfig.outDir, pages);
    console.log('✅ [og-image] Done.\n');
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
    ["meta", { property: "og:description", content: "Scaffold production-ready Express.js TypeScript backends in seconds with built-in Auth, ORM, and OpenAPI support." }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:site", content: "@code_y02" }],
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
        text: "🤖 Ask AI",
        items: [
          {
            text: "✦ Perplexity (Best)",
            link: `https://www.perplexity.ai/?q=Act+as+a+Senior+Expert+on+Create+Express+Forge+v4.+Read+https://code-y02.github.io/express-cli/llms-full.txt+and+answer+my+question+STRICTLY+following+v4+standards+(Biome,+Zod-to-OpenAPI,+ESM,+Functional+Helpers).+Ignore+legacy+v3+patterns.`,
          },
          {
            text: "Ask Claude",
            link: `https://claude.ai/new?q=Please+read+the+full+v4+documentation+for+Create+Express+Forge+at+https://code-y02.github.io/express-cli/llms-full.txt.+I+need+help+with+a+v4+project.+STRICT+REQUIREMENT:+Use+Biome+for+linting+and+Zod-to-OpenAPI+for+docs.+Do+not+suggest+ESLint+or+JSDoc.`,
          },
          {
            text: "Ask ChatGPT",
            link: `https://chatgpt.com/?q=You+are+the+official+AI+assistant+for+Create+Express+Forge+v4.+Context:+https://code-y02.github.io/express-cli/llms-full.txt.+Answer+my+question+using+v4+patterns+ONLY+(Functional+ApiResponse,+Biome,+Zod-to-OpenAPI).`,
          },
          {
            text: "📄 Raw AI Context (llms-full.txt)",
            link: "https://code-y02.github.io/express-cli/llms-full.txt",
          },
          {
            text: "📘 AI Integration Guide",
            link: "/guide/ai-integration",
          },
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
            { text: "AI Integration", link: "/guide/ai-integration" },
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
