[English](README.md) | **Українська**

# Harmoniq

[![Live Demo](https://img.shields.io/badge/Live-Demo-2ea44f)](https://harmoniq-azure.vercel.app)
[![API](https://img.shields.io/badge/API-Render-46E3B7)](https://harmoniq-rp1j.onrender.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-5-339933?logo=nodedotjs&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)](https://mongoosejs.com/)

Full-stack платформа: статті, автори, закладки, аватари та сесії на cookies.

Це **копія для портфоліо** командного проєкту. Product name: **Harmoniq**. Team: **DevForge**.

| | URL |
| --- | --- |
| Live demo | [harmoniq-azure.vercel.app](https://harmoniq-azure.vercel.app) |
| Production API | [harmoniq-rp1j.onrender.com](https://harmoniq-rp1j.onrender.com) |
| This repo | [Volodymyr-But2025/harmoniq](https://github.com/Volodymyr-But2025/harmoniq) |
| Original frontend | [hlieb-kotiun/devforge-frontend](https://github.com/hlieb-kotiun/devforge-frontend) |
| Original backend | [hlieb-kotiun/devforge-backend](https://github.com/hlieb-kotiun/devforge-backend) |

## Монорепозиторій

```
frontend/    Next.js 16 (App Router) + BFF-проксі до Express
backend/     Express 5 REST API, MongoDB, Cloudinary
```

Vercel Root Directory: `frontend`. Render Root Directory: `backend`.

## Stack

- **Frontend:** Next.js 16, React 19, TypeScript, CSS Modules, TanStack Query, Zustand, Axios, Formik, Yup
- **Backend:** Node.js, Express 5, MongoDB / Mongoose, Celebrate / Joi, Cloudinary, httpOnly cookies
- **Node.js** 22.18.0 (див. `frontend/.nvmrc`)

## Getting started

```bash
git clone https://github.com/Volodymyr-But2025/harmoniq.git
cd harmoniq
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

У `backend/.env` заповніть `MONGO_URL`, ключі Cloudinary, `CLIENT_URL=http://localhost:3000`.

```bash
npm run install:all
```

Два термінали:

```bash
npm run dev:backend
npm run dev:frontend
```

Додаток: [http://localhost:3000](http://localhost:3000). API: [http://localhost:5000](http://localhost:5000).

Браузер ходить на `/api/*`. Next BFF проксує на Express (`BACKEND_URL`) і передає cookies.

Опційний демо-набір (користувачі `@harmoniq.seed`, пароль `SeedPass123`):

```bash
npm run seed --prefix backend
```

Не комітьте `.env`.

### Змінні середовища

**Frontend** (`frontend/.env`)

| Variable | Description |
| --- | --- |
| `BACKEND_URL` | Лише сервер. Next BFF (`app/api/*`) проксує на цей Express URL |
| `NEXT_PUBLIC_API_URL` | Публічний base URL для зображень статей / аватарів |
| `NEXT_PUBLIC_BASE_URL` | Публічний URL цього Next-застосунку |

**Backend** (`backend/.env`)

| Variable | Description |
| --- | --- |
| `PORT` | Порт сервера (`5000` у `.env.example`) |
| `MONGO_URL` | Рядок підключення до MongoDB |
| `NODE_ENV` | `development` або `production` |
| `CLIENT_URL` | Дозволені origin фронтенду (через кому) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

## Деплой

### 1. Render — API

1. New → Web Service → цей репозиторій
2. Root Directory: `backend`
3. Build: `npm install` · Start: `npm start`
4. Env: `NODE_ENV=production`, `MONGO_URL`, ключі Cloudinary, `CLIENT_URL` (URL Vercel, без слеша в кінці)

У корені є Blueprint `render.yaml`.

### 2. Vercel — UI

1. Import цього репозиторію
2. Root Directory: `frontend`
3. Framework: Next.js
4. Env:

| Variable | Value |
| --- | --- |
| `BACKEND_URL` | URL Render, без слеша в кінці |
| `NEXT_PUBLIC_API_URL` | Той самий URL Render |
| `NEXT_PUBLIC_BASE_URL` | URL цього Vercel-застосунку |

### 3. CORS

Поставте Render `CLIENT_URL` на origin Vercel і зробіть Redeploy API.

Безкоштовний Render може засинати; перший запит інколи займає 30–60 с.

## Документація

- [Frontend](frontend/README.uk.md)
- [Backend](backend/README.uk.md)
