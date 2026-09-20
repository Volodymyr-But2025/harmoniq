**English** | [Українська](README.uk.md)

# Harmoniq API

[![Original](https://img.shields.io/badge/Original-hlieb--kotiun%2Fdevforge--backend-181717?logo=github)](https://github.com/hlieb-kotiun/devforge-backend)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?logo=nodedotjs&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://mongoosejs.com/)

REST API for Harmoniq: articles, authors, saved articles, avatars, and cookie-based sessions.

Part of the [harmoniq](https://github.com/Volodymyr-But2025/harmoniq) monorepo. Setup and deploy: [root README](../README.md).

Live demo: [harmoniq-azure.vercel.app](https://harmoniq-azure.vercel.app) · API: [harmoniq-rp1j.onrender.com](https://harmoniq-rp1j.onrender.com)

## Fork

Portfolio copy of **[hlieb-kotiun/devforge-backend](https://github.com/hlieb-kotiun/devforge-backend)**. Product name: **Harmoniq**. Team: **DevForge**.

## Stack

- Node.js, Express 5
- MongoDB / Mongoose
- Celebrate / Joi
- Cloudinary (image uploads)
- bcrypt, httpOnly cookies (`accessToken`, `refreshToken`, `sessionId`)

## Run

From the monorepo root:

```bash
cp backend/.env.example backend/.env
npm install --prefix backend
npm run dev --prefix backend
```

`.env.example` uses `PORT=5000`. If `PORT` is unset, the server falls back to `3000`.

In development, CORS also allows `http://localhost:3000` and `http://localhost:3001`.

### Environment variables

| Variable | Description |
| --- | --- |
| `PORT` | Server port (`5000` in `.env.example`) |
| `MONGO_URL` | MongoDB connection string |
| `NODE_ENV` | `development` or `production` |
| `CLIENT_URL` | Allowed frontend origin(s), comma-separated |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

Do not commit `.env`.

Optional demo data (users with `@harmoniq.seed`, password `SeedPass123`):

```bash
npm run seed --prefix backend
```

## Endpoints

### Auth

| Method | Path | Auth |
| --- | --- | --- |
| `POST` | `/auth/register` | — |
| `POST` | `/auth/login` | — |
| `POST` | `/auth/refresh` | cookies |
| `POST` | `/auth/logout` | cookies |

### Users

| Method | Path | Auth |
| --- | --- | --- |
| `GET` | `/users` | — |
| `GET` | `/users/me` | yes |
| `GET` | `/users/top-creators` | — |
| `GET` | `/users/:id` | — |
| `PATCH` | `/users/me/avatar` | yes |
| `GET` | `/saved-articles` | yes |
| `POST` | `/saved-articles/:id` | yes |
| `DELETE` | `/saved-articles/:id` | yes |

### Articles

| Method | Path | Auth |
| --- | --- | --- |
| `GET` | `/articles` | — |
| `GET` | `/articles/:id` | — |
| `GET` | `/articles/author/:ownerId` | — |
| `POST` | `/articles` | yes |
| `PATCH` | `/articles/:id` | yes (owner) |
| `DELETE` | `/articles/:id` | yes (owner) |

`POST` / `PATCH` `/articles` accept `multipart/form-data` with image field `img`. Avatar upload uses field `avatar`.

## API docs (Swagger)

Interactive OpenAPI UI (cookie sessions work after `POST /auth/login` in the same browser):

- Local: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
- Production: [https://harmoniq-rp1j.onrender.com/api-docs](https://harmoniq-rp1j.onrender.com/api-docs)
- Raw JSON: `/api-docs.json`

## Structure

```
src/
  docs/          OpenAPI spec + Swagger UI setup
  routes/        HTTP routes
  controllers/   Request handlers
  models/        Mongoose schemas
  validations/   Celebrate / Joi schemas
  middleware/    Auth, upload, errors, logger
  services/      Auth helpers, Cloudinary
  db/            MongoDB connection
  scripts/       Seed and maintenance
```

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Nodemon |
| `npm start` | Production server |
| `npm run lint` | ESLint |
| `npm run seed` | Demo users and articles |
| `npm run recalculate-articles` | Recalculate `articlesAmount` per user |

## Related

Next.js client and BFF: [../frontend](../frontend/README.md).
