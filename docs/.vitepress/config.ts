import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'create-express-forge',
  description: '⚡ Production-ready Express backends in seconds',
  
  // Important for GitHub Pages deployment
  base: '/express-cli/',
  
  themeConfig: {
    logo: '/logo.svg',
    
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Reference', link: '/reference/cli-options' },
      { text: 'GitHub', link: 'https://github.com/CODE-Y02/express-cli' }
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' }
        ]
      },
      {
        text: 'Architecture',
        items: [
          { text: 'Modular Pattern', link: '/guide/modular' },
          { text: 'Architecture vs MVC', link: '/guide/architecture' }
        ]
      },
      {
        text: 'Features',
        items: [
          { text: 'Error Handling', link: '/guide/error-handling' },
          { text: 'Prisma ORM', link: '/guide/prisma' },
          { text: 'Docker', link: '/guide/docker' },
          { text: 'Testing', link: '/guide/testing' },
          { text: 'Logging', link: '/guide/logging' }
        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'CLI Options', link: '/reference/cli-options' },
          { text: 'Environment Variables', link: '/reference/env-vars' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/CODE-Y02/express-cli' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 Yatharth Lakhate'
    }
  }
});
