[English](README.md) | **Українська**

# Harmoniq — frontend

[![Original](https://img.shields.io/badge/Original-hlieb--kotiun%2Fdevforge--frontend-181717?logo=github)](https://github.com/hlieb-kotiun/devforge-frontend)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org/)

Next.js-клієнт Harmoniq: статті, автори, закладки, профіль і сесії на cookies через BFF до Express.

Частина монорепозиторію [harmoniq](https://github.com/Volodymyr-But2025/harmoniq). Запуск і деплой: [кореневий README](../README.uk.md).

## Fork

Копія для портфоліо: **[hlieb-kotiun/devforge-frontend](https://github.com/hlieb-kotiun/devforge-frontend)**. Product name: **Harmoniq**. Team: **DevForge**.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- CSS Modules, `next/image`
- TanStack Query, Zustand, Axios
- Formik, Yup, react-hot-toast

Node.js **22.18.0** (див. `.nvmrc`).

## Getting started

З кореня монорепозиторію:

```bash
cp frontend/.env.example frontend/.env
npm install --prefix frontend
npm run dev --prefix frontend
```

Відкрийте [http://localhost:3000](http://localhost:3000).

Браузер ходить на `/api/*`. Ці маршрути проксують на Express (`BACKEND_URL`) і передають cookies.

### Environment variables

| Variable | Description |
| --- | --- |
| `BACKEND_URL` | Лише сервер. Next BFF (`app/api/*`) проксує на цей Express URL |
| `NEXT_PUBLIC_API_URL` | Публічний base URL для зображень статей / аватарів |
| `NEXT_PUBLIC_BASE_URL` | Публічний URL цього Next-застосунку |

`.env.example` вказує на локальний API (`http://localhost:5000`). На Vercel поставте URL Render.

Не комітьте `.env`.

## Routes

| Route | Description | Access |
| --- | --- | --- |
| `/` | Головна | Public |
| `/register` | Реєстрація | Public |
| `/login` | Вхід | Public |
| `/photo` | Аватар | Registration flow |
| `/articles` | Список статей | Public |
| `/articles/[id]` | Сторінка статті | Public |
| `/articles/create` | Створити статтю | Private |
| `/articles/[id]/edit` | Редагувати статтю | Private (owner) |
| `/authors` | Список авторів | Public |
| `/authors/[id]` | Профіль автора | Public |
| `/profile` | Мої статті | Private |
| `/profile/saved` | Збережені статті | Private |

## Project structure

```
app/
  api/           BFF-проксі до Express
  articles/      Список, деталі, створення, редагування
  authors/       Автори та профілі
  profile/       Поточний користувач (parallel routes)
  (auth-routes)/ Логін і реєстрація
components/
lib/             API-клієнти, хуки, стори
```

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint |

## Related

Express API: [../backend](../backend/README.uk.md).
