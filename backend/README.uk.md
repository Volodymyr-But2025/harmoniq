[English](README.md) | **Українська**

# Harmoniq API

[![Original](https://img.shields.io/badge/Original-hlieb--kotiun%2Fdevforge--backend-181717?logo=github)](https://github.com/hlieb-kotiun/devforge-backend)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?logo=nodedotjs&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://mongoosejs.com/)

REST API для Harmoniq: статті, автори, збережені статті, аватари та сесії на cookies.

Частина монорепозиторію [harmoniq](https://github.com/Volodymyr-But2025/harmoniq). Запуск і деплой: [кореневий README](../README.uk.md).

## Fork

Копія для портфоліо: **[hlieb-kotiun/devforge-backend](https://github.com/hlieb-kotiun/devforge-backend)**. Product name: **Harmoniq**. Team: **DevForge**.

## Stack

- Node.js, Express 5
- MongoDB / Mongoose
- Celebrate / Joi
- Cloudinary (завантаження зображень)
- bcrypt, httpOnly cookies (`accessToken`, `refreshToken`, `sessionId`)

## Getting started

З кореня монорепозиторію:

```bash
cp backend/.env.example backend/.env
npm install --prefix backend
npm run dev --prefix backend
```

У `.env.example` стоїть `PORT=5000`. Якщо `PORT` не задано, сервер слухає `3000`.

У development CORS також дозволяє `http://localhost:3000` і `http://localhost:3001`.

### Environment variables

| Variable | Description |
| --- | --- |
| `PORT` | Порт сервера (`5000` у `.env.example`) |
| `MONGO_URL` | Рядок підключення до MongoDB |
| `NODE_ENV` | `development` або `production` |
| `CLIENT_URL` | Дозволені origin фронтенду (через кому) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

Не комітьте `.env`.

Опційний демо-набір (користувачі `@harmoniq.seed`, пароль `SeedPass123`):

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

`POST` / `PATCH` `/articles` приймають `multipart/form-data` з полем `img`. Аватар — поле `avatar`.

## Project structure

```
src/
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

Next.js-клієнт і BFF: [../frontend](../frontend/README.uk.md).
