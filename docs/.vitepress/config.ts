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
          { text: 'Modular vs MVC', link: '/guide/architecture' },
          { text: 'Core Features', link: '/guide/features' }
        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'CLI Options', link: '/reference/cli-options' }
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
