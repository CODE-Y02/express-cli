import path from 'path';
import fs from 'fs-extra';
import type { CliOptions } from '../../types.js';

export async function generateOpenApi(opts: CliOptions, targetDir: string): Promise<void> {
  if (!opts.openapi) return;

  const docsDir = path.join(targetDir, 'src/docs');
  await fs.ensureDir(docsDir);

  await fs.writeFile(
    path.join(docsDir, 'swagger.ts'),
    `import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import type { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '${opts.projectName} API',
      version: '1.0.0',
      description: 'API documentation for ${opts.projectName}',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        ${
          opts.auth === 'jwt'
            ? opts.jwtStorage === 'cookie'
              ? "cookieAuth: { type: 'apiKey', in: 'cookie', name: 'token' }"
              : "bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }"
            : ''
        }
      }
    },
    ${opts.auth === 'jwt' ? `security: [{ ${opts.jwtStorage === 'cookie' ? "'cookieAuth'" : "'bearerAuth'"}: [] }],` : ''}
  },
  apis: ['./src/app.ts', './src/modules/**/*.routes.ts', './src/routes/**/*.ts'],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  // Always expose the OpenAPI spec as JSON for debugging or external tools
  app.get('/docs.json', (_req, res) => res.json(specs));

  ${
    opts.openapiUI
      ? `app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
  console.log('📜 API Docs available at http://localhost:3000/docs');
  console.log('📜 API Spec available at http://localhost:3000/docs.json');`
      : `console.log('📜 API Spec available at http://localhost:3000/docs.json (UI disabled)');`
  }
};
`
  );
}
