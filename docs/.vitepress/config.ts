import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'create-express-forge',
  description: '⚡ Scaffold production-ready Express.js TypeScript backends in seconds',
  base: '/express-cli/',
  // cleanUrls: true, // Disable this to troubleshoot routing issues on GitHub Pages
  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#7C3AED' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'create-express-forge' }],
    ['meta', { property: 'og:description', content: 'Scaffold production-ready Express.js TypeScript backends in seconds' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'create-express-forge',

    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Reference', link: '/reference/cli-options' },
      {
        text: 'v0.1.x',
        items: [
          { text: 'v0.1.x (current)', link: '/' },
          { text: 'Changelog', link: 'https://github.com/CODE-Y02/express-cli/blob/main/packages/create-express-forge/CHANGELOG.md' },
        ],
      },
      {
        text: 'Links',
        items: [
          { text: 'npm', link: 'https://www.npmjs.com/package/create-express-forge' },
          { text: 'GitHub', link: 'https://github.com/CODE-Y02/express-cli' },
          { text: 'Issues', link: 'https://github.com/CODE-Y02/express-cli/issues' },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is this?', link: '/guide/what-is-this' },
            { text: 'Getting Started', link: '/guide/getting-started' },
          ],
        },
        {
          text: 'Architecture',
          items: [
            { text: 'Modular Pattern', link: '/guide/modular' },
            { text: 'MVC Pattern', link: '/guide/mvc' },
          ],
        },
        {
          text: 'Features',
          items: [
            { text: 'Error Handling', link: '/guide/error-handling' },
            { text: 'Prisma ORM', link: '/guide/prisma' },
            { text: 'Docker', link: '/guide/docker' },
            { text: 'Testing', link: '/guide/testing' },
            { text: 'Logging', link: '/guide/logging' },
          ],
        },
      ],
      '/reference/': [
        {
          text: 'Reference',
          items: [
            { text: 'CLI Options', link: '/reference/cli-options' },
            { text: 'Generated Structure', link: '/reference/generated-structure' },
            { text: 'Environment Variables', link: '/reference/env-vars' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/CODE-Y02/express-cli' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/create-express-forge' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 Yatharth Lakhate',
    },

    search: {
      provider: 'local',
    },

    editLink: {
      pattern: 'https://github.com/CODE-Y02/express-cli/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
  },
});
