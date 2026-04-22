---
layout: home

hero:
  name: Express Forge
  text: Build Better Express APIs, Faster.
  tagline: The definitive CLI for scaffolding production-ready, enterprise-grade Express.js backends.
  image:
    src: /logo.svg
    alt: Express Forge Logo
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: Documentation
      link: /guide/architecture
    - theme: alt
      text: GitHub
      link: https://github.com/CODE-Y02/express-cli

features:
  - icon: ⚡
    title: Instant Scaffolding
    details: Go from zero to a fully structured API in under 30 seconds with our interactive CLI.
  - icon: 🛡️
    title: TypeScript Native
    details: Deeply integrated TypeScript support with strict typing and modern ESM configuration.
  - icon: 📦
    title: Modern Architecture
    details: Choose between Feature-driven Modular or traditional MVC patterns to suit your scale.
  - icon: 💾
    title: Type-safe ORM
    details: First-class support for Prisma and Sequelize with pre-configured migrations.
  - icon: 🐳
    title: Docker Ready
    details: Multi-stage Dockerfiles and docker-compose setups included for seamless deployment.
  - icon: 🧪
    title: Quality Assured
    details: Pre-configured testing suites with Vitest or Jest, including example integration tests.
---


<div class="why-section">

### 🚀 Key Benefits

- **Zero Configuration**: Sensible defaults that work out of the box.
- **Enterprise Patterns**: Modular architecture that grows with your team.
- **Developer Experience**: Auto-reloading, linting, and formatting pre-configured.
- **Security First**: Best practices for CORS, rate limiting, and environment management.

### 🛠 Built With

<div class="tech-stack">
  <span class="tech-badge">TypeScript</span>
  <span class="tech-badge">Express.js</span>
  <span class="tech-badge">Prisma</span>
  <span class="tech-badge">Docker</span>
  <span class="tech-badge">Vitest</span>
  <span class="tech-badge">Zod</span>
  <span class="tech-badge">Pino</span>
</div>

</div>

<style>
.why-section {
  max-width: 900px;
  margin: 64px auto;
  padding: 0 24px;
  text-align: center;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
}

.tech-badge {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  padding: 6px 14px;
  border-radius: 99px;
  font-size: 0.85rem;
  font-weight: 700;
  border: 1px solid var(--vp-c-brand-soft);
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.tech-badge:hover {
  background: var(--vp-c-brand-1);
  color: white;
  transform: translateY(-2px);
}

.why-section h2 {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 24px;
  background: var(--vp-home-hero-name-background);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
} 

 .why-section p {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
} 

.why-section h3 {
  margin-top: 48px;
  font-size: 1.5rem;
  text-align: left;
}

.why-section ul {
  text-align: left;
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 24px;
}

.why-section li {
  background: var(--vp-c-bg-soft);
  padding: 24px;
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
  transition: transform 0.3s ease;
}

.why-section li:hover {
  transform: scale(1.02);
  border-color: var(--vp-c-brand-1);
}

.why-section li strong {
  display: block;
  margin-bottom: 8px;
  color: var(--vp-c-brand-1);
  font-size: 1.1rem;
  font-weight: 700;
}

@media (max-width: 768px) {
  .why-section h2 {
    font-size: 2rem;
  }
  .why-section ul {
    grid-template-columns: 1fr;
  }
  .tech-stack {
    gap: 8px;
  }
  .tech-badge {
    padding: 4px 12px;
    font-size: 0.8rem;
  }
}
</style>
