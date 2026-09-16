**English** | [Українська](README.uk.md)

# Harmoniq — frontend

[![Original](https://img.shields.io/badge/Original-hlieb--kotiun%2Fdevforge--frontend-181717?logo=github)](https://github.com/hlieb-kotiun/devforge-frontend)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org/)

Next.js client for Harmoniq: articles, authors, bookmarks, profile, and cookie sessions via a BFF to Express.

Part of the [harmoniq](https://github.com/Volodymyr-But2025/harmoniq) monorepo. Setup and deploy: [root README](../README.md).

Live demo: [harmoniq-azure.vercel.app](https://harmoniq-azure.vercel.app) · API: [harmoniq-rp1j.onrender.com](https://harmoniq-rp1j.onrender.com)

## Fork

Portfolio copy of **[hlieb-kotiun/devforge-frontend](https://github.com/hlieb-kotiun/devforge-frontend)**. Product name: **Harmoniq**. Team: **DevForge**.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- CSS Modules, `next/image`
- TanStack Query, Zustand, Axios
- Formik, Yup, react-hot-toast

Node.js **22.18.0** (see `.nvmrc`).

## Getting started

From the monorepo root:

```bash
cp frontend/.env.example frontend/.env
npm install --prefix frontend
npm run dev --prefix frontend
```

Open [http://localhost:3000](http://localhost:3000).

The browser talks to `/api/*`. Those routes proxy to Express (`BACKEND_URL`) and forward cookies.

### Environment variables

| Variable | Description |
| --- | --- |
| `BACKEND_URL` | Server-only. Next BFF (`app/api/*`) proxies to this Express URL |
| `NEXT_PUBLIC_API_URL` | Public base URL for article / avatar images |
| `NEXT_PUBLIC_BASE_URL` | Public URL of this Next app |

`.env.example` points at a local API (`http://localhost:5000`). On Vercel set the Render URL.

Do not commit `.env`.

## Routes

| Route | Description | Access |
| --- | --- | --- |
| `/` | Home | Public |
| `/register` | Registration | Public |
| `/login` | Login | Public |
| `/photo` | Avatar upload | Registration flow |
| `/articles` | Article list | Public |
| `/articles/[id]` | Article page | Public |
| `/articles/create` | Create article | Private |
| `/articles/[id]/edit` | Edit article | Private (owner) |
| `/authors` | Authors list | Public |
| `/authors/[id]` | Author profile | Public |
| `/profile` | My articles | Private |
| `/profile/saved` | Saved articles | Private |

## Project structure

```
app/
  api/           BFF proxies to Express
  articles/      List, details, create, edit
  authors/       Authors and profiles
  profile/       Current user (parallel routes)
  (auth-routes)/ Login and register
components/
lib/             API clients, hooks, stores
```

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint |

## Related

Express API: [../backend](../backend/README.md).
