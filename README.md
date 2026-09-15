**English** | [Українська](README.uk.md)

# Harmoniq

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-5-339933?logo=nodedotjs&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)](https://mongoosejs.com/)

Full-stack blog platform: articles, authors, bookmarks, avatars, and cookie sessions.

This is a **portfolio copy** of a team project. Product name: **Harmoniq**. Team: **DevForge**.

| | URL |
| --- | --- |
| Original frontend | [hlieb-kotiun/devforge-frontend](https://github.com/hlieb-kotiun/devforge-frontend) |
| Original backend | [hlieb-kotiun/devforge-backend](https://github.com/hlieb-kotiun/devforge-backend) |

Live demo links will be added after deploy (Vercel + Render).

## Monorepo

```
frontend/    Next.js 16 (App Router) + BFF proxy to Express
backend/     Express 5 REST API, MongoDB, Cloudinary
```

Vercel Root Directory: `frontend`. Render Root Directory: `backend`.

## Stack

- **Frontend:** Next.js 16, React 19, TypeScript, CSS Modules, TanStack Query, Zustand, Axios, Formik, Yup
- **Backend:** Node.js, Express 5, MongoDB / Mongoose, Celebrate / Joi, Cloudinary, httpOnly cookies
- **Node.js** 22.18.0 (see `frontend/.nvmrc`)

## Getting started

```bash
git clone https://github.com/Volodymyr-But2025/harmoniq.git
cd harmoniq
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

Fill `backend/.env`: `MONGO_URL`, Cloudinary keys, `CLIENT_URL=http://localhost:3000`.

```bash
npm run install:all
```

Two terminals:

```bash
npm run dev:backend
npm run dev:frontend
```

App: [http://localhost:3000](http://localhost:3000). API: [http://localhost:5000](http://localhost:5000).

The browser talks to `/api/*`. Next BFF proxies to Express (`BACKEND_URL`) and forwards cookies.

Optional demo users (`@harmoniq.seed`, password `SeedPass123`):

```bash
npm run seed --prefix backend
```

Do not commit `.env`.

### Environment variables

**Frontend** (`frontend/.env`)

| Variable | Description |
| --- | --- |
| `BACKEND_URL` | Server-only. Next BFF (`app/api/*`) proxies to this Express URL |
| `NEXT_PUBLIC_API_URL` | Public base URL for article / avatar images |
| `NEXT_PUBLIC_BASE_URL` | Public URL of this Next app |

**Backend** (`backend/.env`)

| Variable | Description |
| --- | --- |
| `PORT` | Server port (`5000` in `.env.example`) |
| `MONGO_URL` | MongoDB connection string |
| `NODE_ENV` | `development` or `production` |
| `CLIENT_URL` | Allowed frontend origin(s), comma-separated |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

## Deploy

### 1. Render — API

1. New → Web Service → this repository
2. Root Directory: `backend`
3. Build: `npm install` · Start: `npm start`
4. Env: `NODE_ENV=production`, `MONGO_URL`, Cloudinary keys, `CLIENT_URL` (Vercel URL, no trailing slash)

A Blueprint file `render.yaml` is in the repo root.

### 2. Vercel — UI

1. Import this repository
2. Root Directory: `frontend`
3. Framework: Next.js
4. Env:

| Variable | Value |
| --- | --- |
| `BACKEND_URL` | Render URL, no trailing slash |
| `NEXT_PUBLIC_API_URL` | Same Render URL |
| `NEXT_PUBLIC_BASE_URL` | This Vercel URL |

### 3. CORS

Set Render `CLIENT_URL` to the Vercel origin and redeploy the API.

Free Render may sleep; the first request can take 30–60s.

## Docs

- [Frontend](frontend/README.md)
- [Backend](backend/README.md)
