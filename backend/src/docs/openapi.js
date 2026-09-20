/** OpenAPI 3.0 specification for Harmoniq REST API. */

const errorMessage = {
  type: 'object',
  properties: {
    message: { type: 'string', example: 'Missing access token' },
  },
};

const objectId = {
  type: 'string',
  pattern: '^[a-fA-F0-9]{24}$',
  example: '507f1f77bcf86cd799439011',
};

const userSchema = {
  type: 'object',
  properties: {
    _id: objectId,
    username: { type: 'string', example: 'demo.user' },
    email: { type: 'string', format: 'email', example: 'demo@harmoniq.seed' },
    avatarUrl: { type: 'string', nullable: true },
    articlesAmount: { type: 'integer', example: 3 },
  },
};

const articleSchema = {
  type: 'object',
  properties: {
    _id: objectId,
    title: { type: 'string', example: 'Getting started with Harmoniq' },
    desc: { type: 'string' },
    date: { type: 'string', format: 'date', example: '2025-01-15' },
    author: { type: 'string', example: 'Demo Author' },
    img: { type: 'string', nullable: true },
    ownerId: objectId,
  },
};

export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Harmoniq API',
    version: '1.0.0',
    description:
      'REST API for Harmoniq: articles, authors, bookmarks, avatars, and httpOnly cookie sessions.\n\n' +
      '**Auth:** call `POST /auth/login` from Swagger UI (same origin). The browser stores ' +
      '`accessToken`, `refreshToken`, and `sessionId` cookies. Private endpoints then send those cookies automatically (`withCredentials`).',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local development (PORT from .env.example)',
    },
    {
      url: 'https://harmoniq-rp1j.onrender.com',
      description: 'Production (Render)',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Register, login, refresh, logout' },
    { name: 'Users', description: 'Authors, profile, avatar, saved articles' },
    { name: 'Articles', description: 'Article CRUD and listings' },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'accessToken',
        description:
          'httpOnly cookie set by login/register. `sessionId` is also required; `refreshToken` is used by refresh/logout.',
      },
    },
    schemas: {
      ErrorMessage: errorMessage,
      User: userSchema,
      Article: articleSchema,
      RegisterBody: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: { type: 'string', minLength: 2, maxLength: 32 },
          email: { type: 'string', format: 'email', maxLength: 64 },
          password: { type: 'string', minLength: 8, maxLength: 64 },
        },
      },
      LoginBody: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', maxLength: 64 },
          password: { type: 'string', minLength: 8, maxLength: 64 },
        },
      },
    },
    responses: {
      Unauthorized: {
        description: 'Missing or invalid session cookies',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorMessage' },
          },
        },
      },
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorMessage' },
          },
        },
      },
      ValidationError: {
        description: 'Celebrate / Joi validation failed',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorMessage' },
          },
        },
      },
    },
  },
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterBody' },
            },
          },
        },
        responses: {
          201: { description: 'User registered; session cookies set' },
          400: { $ref: '#/components/responses/ValidationError' },
          409: {
            description: 'Email already in use',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorMessage' },
              },
            },
          },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Log in',
        description:
          'Sets httpOnly cookies: `accessToken`, `refreshToken`, `sessionId`.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginBody' },
            },
          },
        },
        responses: {
          200: { description: 'Logged in; session cookies set' },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh session',
        description: 'Uses `refreshToken` and `sessionId` cookies.',
        security: [{ cookieAuth: [] }],
        responses: {
          200: { description: 'New access token cookies set' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Log out',
        description: 'Clears session cookies.',
        security: [{ cookieAuth: [] }],
        responses: {
          200: { description: 'Logged out' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'List users',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', minimum: 1, default: 1 },
          },
          {
            name: 'perPage',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          },
        ],
        responses: {
          200: {
            description: 'Paginated users',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/User' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/users/me': {
      get: {
        tags: ['Users'],
        summary: 'Current user profile',
        security: [{ cookieAuth: [] }],
        responses: {
          200: {
            description: 'Current user',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/users/top-creators': {
      get: {
        tags: ['Users'],
        summary: 'Top creators by article count',
        responses: {
          200: {
            description: 'Top creators list',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/User' },
                },
              },
            },
          },
        },
      },
    },
    '/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'User by id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: objectId,
          },
        ],
        responses: {
          200: {
            description: 'User',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          400: { $ref: '#/components/responses/ValidationError' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/users/me/avatar': {
      patch: {
        tags: ['Users'],
        summary: 'Upload avatar',
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['avatar'],
                properties: {
                  avatar: {
                    type: 'string',
                    format: 'binary',
                    description: 'Image file',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Avatar updated' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/saved-articles': {
      get: {
        tags: ['Users'],
        summary: 'List saved articles',
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', minimum: 1, default: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 6 },
          },
        ],
        responses: {
          200: { description: 'Paginated saved articles' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/saved-articles/{id}': {
      post: {
        tags: ['Users'],
        summary: 'Save an article',
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Article id',
            schema: objectId,
          },
        ],
        responses: {
          200: { description: 'Article saved' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Users'],
        summary: 'Remove a saved article',
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Article id',
            schema: objectId,
          },
        ],
        responses: {
          200: { description: 'Article removed from saved' },
          401: { $ref: '#/components/responses/Unauthorized' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/articles': {
      get: {
        tags: ['Articles'],
        summary: 'List articles',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', minimum: 1, default: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, default: 6 },
          },
          {
            name: 'filter',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['all', 'popular'],
              default: 'all',
            },
          },
        ],
        responses: {
          200: {
            description: 'Paginated articles',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Article' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Articles'],
        summary: 'Create article',
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['title', 'desc', 'date', 'author'],
                properties: {
                  title: { type: 'string', minLength: 3, maxLength: 48 },
                  desc: { type: 'string', minLength: 100, maxLength: 4000 },
                  date: {
                    type: 'string',
                    pattern: '^\\d{4}-\\d{2}-\\d{2}$',
                    example: '2025-01-15',
                  },
                  author: { type: 'string', minLength: 2, maxLength: 50 },
                  img: {
                    type: 'string',
                    format: 'binary',
                    description: 'Cover image (optional)',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Article created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Article' },
              },
            },
          },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/articles/{id}': {
      get: {
        tags: ['Articles'],
        summary: 'Article by id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: objectId,
          },
        ],
        responses: {
          200: {
            description: 'Article',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Article' },
              },
            },
          },
          400: { $ref: '#/components/responses/ValidationError' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      patch: {
        tags: ['Articles'],
        summary: 'Update own article',
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: objectId,
          },
        ],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string', minLength: 3, maxLength: 48 },
                  desc: { type: 'string', minLength: 100, maxLength: 4000 },
                  date: {
                    type: 'string',
                    pattern: '^\\d{4}-\\d{2}-\\d{2}$',
                  },
                  img: { type: 'string', format: 'binary' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Article updated' },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: {
            description: 'Not the owner',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorMessage' },
              },
            },
          },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Articles'],
        summary: 'Delete own article',
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: objectId,
          },
        ],
        responses: {
          200: { description: 'Article deleted' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: {
            description: 'Not the owner',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorMessage' },
              },
            },
          },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
    '/articles/author/{ownerId}': {
      get: {
        tags: ['Articles'],
        summary: 'Articles by author',
        parameters: [
          {
            name: 'ownerId',
            in: 'path',
            required: true,
            schema: objectId,
          },
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', minimum: 1, default: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, default: 12 },
          },
        ],
        responses: {
          200: { description: 'Paginated articles by author' },
          400: { $ref: '#/components/responses/ValidationError' },
        },
      },
    },
  },
};
