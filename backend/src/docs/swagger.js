import swaggerUi from 'swagger-ui-express';
import { openApiDocument } from './openapi.js';

/**
 * Mounts Swagger UI at `/api-docs` and raw OpenAPI JSON at `/api-docs.json`.
 * @param {import('express').Express} app
 */
export function setupSwagger(app) {
  app.get('/api-docs.json', (_req, res) => {
    res.json(openApiDocument);
  });

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(openApiDocument, {
      customSiteTitle: 'Harmoniq API',
      swaggerOptions: {
        withCredentials: true,
        persistAuthorization: true,
        displayRequestDuration: true,
      },
    }),
  );
}
