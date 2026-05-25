# CampusCompare — Implementation Plan

## Goal

Build **CampusCompare**, a production-grade full-stack college discovery and comparison platform where students can search, filter, compare, and save colleges.

**Stack**: React + Vite + TypeScript + TailwindCSS (frontend) | Express.js + TypeScript + Prisma + PostgreSQL (backend)

---

## User Review Required

> [!IMPORTANT]
> **PostgreSQL Database**: You need a running PostgreSQL instance. Please confirm one of:
> - Local PostgreSQL installation (provide the connection string format)
> - Neon/Supabase cloud PostgreSQL (provide the `DATABASE_URL`)
> - Docker-based PostgreSQL (`docker run -e POSTGRES_PASSWORD=... -p 5432:5432 postgres`)
>
> I need the `DATABASE_URL` to run Prisma migrations. I'll use a placeholder in `.env.example` but need a real DB for testing.

> [!IMPORTANT]
> **Monorepo Structure**: The instructions specify `campuscompare/client/` and `campuscompare/server/` but your workspace has `Backend/` and `Frontend/` folders. I will follow the instructions and create:
> - `f:\Codes\Assignment\CampusCompare\client\` (frontend)
> - `f:\Codes\Assignment\CampusCompare\server\` (backend)
>
> The existing empty `Backend/`, `Frontend/`, and `Docs/` folders will be left as-is (or removed if you prefer).

> [!WARNING]
> **TailwindCSS Version**: The instructions use TailwindCSS but don't specify a version. TailwindCSS v4 has a significantly different configuration approach (no `tailwind.config.js`, CSS-based config). I'll use **TailwindCSS v3** since the instructions reference `tailwind.config.js` explicitly. Confirm if you want v4 instead.

---

## Open Questions

1. **Should I remove the empty `Backend/`, `Frontend/`, `Docs/` folders** to keep the workspace clean, or leave them?
2. **Do you have a PostgreSQL connection string ready**, or should I set up the project to work with a local default (`postgresql://postgres:password@localhost:5432/campuscompare`)?
3. **TailwindCSS v3 or v4?** (I recommend v3 based on the config file references in your instructions)

---

## Architecture Overview

```mermaid
graph TB
    subgraph "Frontend - React + Vite"
        A[Browser] --> B[React Router]
        B --> C[Pages]
        C --> D[Components]
        C --> E[TanStack Query]
        C --> F[Zustand Stores]
        E --> G[Axios API Services]
    end
    
    subgraph "Backend - Express.js"
        G -->|HTTP + Cookies| H[Express Router]
        H --> I[Middleware Chain]
        I --> J[Controllers]
        J --> K[Services]
        K --> L[Prisma ORM]
    end
    
    subgraph "Database"
        L --> M[(PostgreSQL)]
    end
```

---

## Proposed Changes

### Phase 1 — Repository Setup & Scaffolding

#### [NEW] Root Files
- [.gitignore](file:///f:/Codes/Assignment/CampusCompare/.gitignore) — Node, env, build artifacts
- [README.md](file:///f:/Codes/Assignment/CampusCompare/README.md) — Initial project README

#### [NEW] `client/` — Vite React TypeScript App
Scaffold using `npm create vite@latest client -- --template react-ts`, then install all frontend dependencies:
- react-router-dom, axios, @tanstack/react-query, zustand
- react-hook-form, zod, @hookform/resolvers
- lucide-react, react-hot-toast, recharts, clsx, tailwind-merge
- tailwindcss@3, postcss, autoprefixer

Configure:
- [tailwind.config.js](file:///f:/Codes/Assignment/CampusCompare/client/tailwind.config.js)
- [postcss.config.js](file:///f:/Codes/Assignment/CampusCompare/client/postcss.config.js)
- [src/index.css](file:///f:/Codes/Assignment/CampusCompare/client/src/index.css) — Tailwind directives + design system
- [.env.example](file:///f:/Codes/Assignment/CampusCompare/client/.env.example)

#### [NEW] `server/` — Express TypeScript App
Initialize with `npm init -y`, then install all backend dependencies:
- express, cors, helmet, morgan, cookie-parser, dotenv, argon2, jsonwebtoken, zod
- @prisma/client, prisma (dev), typescript, ts-node-dev (dev)
- All `@types/*` packages

Configure:
- [tsconfig.json](file:///f:/Codes/Assignment/CampusCompare/server/tsconfig.json)
- [package.json](file:///f:/Codes/Assignment/CampusCompare/server/package.json) — scripts for dev, build, seed
- [.env.example](file:///f:/Codes/Assignment/CampusCompare/server/.env.example)

---

### Phase 2 — Backend Foundation (8 files)

#### [NEW] [env.ts](file:///f:/Codes/Assignment/CampusCompare/server/src/config/env.ts)
- Load and validate environment variables with Zod

#### [NEW] [prisma.ts](file:///f:/Codes/Assignment/CampusCompare/server/src/config/prisma.ts)
- Singleton Prisma client instance

#### [NEW] [app.ts](file:///f:/Codes/Assignment/CampusCompare/server/src/app.ts)
- Express app setup: CORS, Helmet, Morgan, cookie-parser, JSON parsing, routes, error middleware

#### [NEW] [server.ts](file:///f:/Codes/Assignment/CampusCompare/server/src/server.ts)
- Start HTTP server on configured port

#### [NEW] Middleware files:
- [auth.middleware.ts](file:///f:/Codes/Assignment/CampusCompare/server/src/middlewares/auth.middleware.ts) — JWT cookie verification, user attachment
- [error.middleware.ts](file:///f:/Codes/Assignment/CampusCompare/server/src/middlewares/error.middleware.ts) — Centralized error handler
- [validate.middleware.ts](file:///f:/Codes/Assignment/CampusCompare/server/src/middlewares/validate.middleware.ts) — Zod schema validation
- [role.middleware.ts](file:///f:/Codes/Assignment/CampusCompare/server/src/middlewares/role.middleware.ts) — Role-based access control

#### [NEW] Utility files:
- [asyncHandler.ts](file:///f:/Codes/Assignment/CampusCompare/server/src/utils/asyncHandler.ts) — Async error wrapper
- [apiResponse.ts](file:///f:/Codes/Assignment/CampusCompare/server/src/utils/apiResponse.ts) — Standardized response helpers
- [generateToken.ts](file:///f:/Codes/Assignment/CampusCompare/server/src/utils/generateToken.ts) — JWT sign + cookie setter
- [slugify.ts](file:///f:/Codes/Assignment/CampusCompare/server/src/utils/slugify.ts) — URL-safe slug generation

---

### Phase 3 — Database Schema, Migration & Seed

#### [NEW] [schema.prisma](file:///f:/Codes/Assignment/CampusCompare/server/prisma/schema.prisma)
- Full schema as specified: User, College, Course, Review, SavedCollege, SavedComparison
- All indexes, enums, relations

#### [NEW] [seed.ts](file:///f:/Codes/Assignment/CampusCompare/server/prisma/seed.ts)
- 30+ realistic Indian colleges with courses, fees, placements
- Real-looking mock data (IIT Delhi, NIT Raipur, VIT Vellore, etc.)
- 3-5 courses per college
- Proper slugs, tags, facilities, exams

**Commands**: `npx prisma migrate dev --name init`, `npx prisma generate`, `npx prisma db seed`

---

### Phase 4 — Auth APIs (6 files)

#### [NEW] [auth.validator.ts](file:///f:/Codes/Assignment/CampusCompare/server/src/validators/auth.validator.ts)
- Zod schemas for register (name, email, password≥6) and login (email, password)

#### [NEW] [auth.service.ts](file:///f:/Codes/Assignment/CampusCompare/server/src/services/auth.service.ts)
- `register()`: check duplicate, hash with Argon2, create user
- `login()`: find user, verify Argon2, return user
- `getMe()`: fetch user by ID (no password)

#### [NEW] [auth.controller.ts](file:///f:/Codes/Assignment/CampusCompare/server/src/controllers/auth.controller.ts)
- Register, Login, Me, Logout handlers
- Set/clear HTTP-only cookies

#### [NEW] [auth.routes.ts](file:///f:/Codes/Assignment/CampusCompare/server/src/routes/auth.routes.ts)
- `POST /register`, `POST /login`, `GET /me`, `POST /logout`

---

### Phase 5 — College APIs (6 files)

#### [NEW] [college.validator.ts](file:///f:/Codes/Assignment/CampusCompare/server/src/validators/college.validator.ts)
- Query params validation: search, city, state, course, collegeType, fees range, rating, sort enum, page, limit

#### [NEW] [college.service.ts](file:///f:/Codes/Assignment/CampusCompare/server/src/services/college.service.ts)
- `getColleges()`: dynamic Prisma `where` builder with search (name, shortName, city, state, popularCourses, tags), filters, sorting, pagination
- `getCollegeBySlug()`: include courses, reviews with user info
- `getRelatedColleges()`: same state/type, exclude current

#### [NEW] [college.controller.ts](file:///f:/Codes/Assignment/CampusCompare/server/src/controllers/college.controller.ts)
#### [NEW] [college.routes.ts](file:///f:/Codes/Assignment/CampusCompare/server/src/routes/college.routes.ts)
- `GET /`, `GET /:slug`, `GET /:slug/related`

---

### Phase 6 — Compare, Saved, Review, Admin APIs (16 files)

#### Compare
- [compare.service.ts](file:///f:/Codes/Assignment/CampusCompare/server/src/services/compare.service.ts) — Fetch 2-3 colleges by IDs with courses
- [compare.controller.ts](file:///f:/Codes/Assignment/CampusCompare/server/src/controllers/compare.controller.ts)
- [compare.routes.ts](file:///f:/Codes/Assignment/CampusCompare/server/src/routes/compare.routes.ts) — `GET /compare?ids=...`

#### Saved Colleges
- [saved.validator.ts](file:///f:/Codes/Assignment/CampusCompare/server/src/validators/saved.validator.ts)
- [saved.service.ts](file:///f:/Codes/Assignment/CampusCompare/server/src/services/saved.service.ts) — Save, list, remove (with duplicate prevention)
- [saved.controller.ts](file:///f:/Codes/Assignment/CampusCompare/server/src/controllers/saved.controller.ts)
- [saved.routes.ts](file:///f:/Codes/Assignment/CampusCompare/server/src/routes/saved.routes.ts) — `POST /`, `GET /`, `DELETE /:collegeId`

#### Reviews
- [review.validator.ts](file:///f:/Codes/Assignment/CampusCompare/server/src/validators/review.validator.ts)
- [review.service.ts](file:///f:/Codes/Assignment/CampusCompare/server/src/services/review.service.ts) — Create review + update college rating/count
- [review.controller.ts](file:///f:/Codes/Assignment/CampusCompare/server/src/controllers/review.controller.ts)
- [review.routes.ts](file:///f:/Codes/Assignment/CampusCompare/server/src/routes/review.routes.ts) — `POST /:collegeId`, `GET /:collegeId`

#### Admin
- [admin.service.ts](file:///f:/Codes/Assignment/CampusCompare/server/src/services/admin.service.ts) — CRUD for colleges and courses
- [admin.controller.ts](file:///f:/Codes/Assignment/CampusCompare/server/src/controllers/admin.controller.ts)
- [admin.routes.ts](file:///f:/Codes/Assignment/CampusCompare/server/src/routes/admin.routes.ts) — Protected with admin role middleware

---

### Phase 7 — Frontend Foundation & Layout (~15 files)

#### [NEW] Core setup
- [api.ts](file:///f:/Codes/Assignment/CampusCompare/client/src/services/api.ts) — Axios instance with baseURL + withCredentials
- [auth.service.ts](file:///f:/Codes/Assignment/CampusCompare/client/src/services/auth.service.ts)
- [college.service.ts](file:///f:/Codes/Assignment/CampusCompare/client/src/services/college.service.ts)
- [compare.service.ts](file:///f:/Codes/Assignment/CampusCompare/client/src/services/compare.service.ts)
- [saved.service.ts](file:///f:/Codes/Assignment/CampusCompare/client/src/services/saved.service.ts)
- [review.service.ts](file:///f:/Codes/Assignment/CampusCompare/client/src/services/review.service.ts)

#### [NEW] Stores
- [authStore.ts](file:///f:/Codes/Assignment/CampusCompare/client/src/stores/authStore.ts) — Zustand auth state
- [compareStore.ts](file:///f:/Codes/Assignment/CampusCompare/client/src/stores/compareStore.ts) — Compare tray (add/remove/clear, max 3)

#### [NEW] Layout Components
- [Navbar.tsx](file:///f:/Codes/Assignment/CampusCompare/client/src/components/layout/Navbar.tsx) — Logo, nav links, auth buttons, mobile menu
- [Footer.tsx](file:///f:/Codes/Assignment/CampusCompare/client/src/components/layout/Footer.tsx)
- [PageContainer.tsx](file:///f:/Codes/Assignment/CampusCompare/client/src/components/layout/PageContainer.tsx)
- [ProtectedRoute.tsx](file:///f:/Codes/Assignment/CampusCompare/client/src/components/layout/ProtectedRoute.tsx)
- [AdminRoute.tsx](file:///f:/Codes/Assignment/CampusCompare/client/src/components/layout/AdminRoute.tsx)

#### [NEW] UI Components
- Button, Input, Select, Card, Badge, Loader, Skeleton, EmptyState, ErrorState, Modal, Pagination

#### [NEW] Routing
- [App.tsx](file:///f:/Codes/Assignment/CampusCompare/client/src/App.tsx) — TanStack QueryProvider, Toaster, Router
- [routes/index.tsx](file:///f:/Codes/Assignment/CampusCompare/client/src/routes/index.tsx) — All routes with lazy loading

---

### Phase 8 — College UI (~10 files)

#### [NEW] College Components
- CollegeCard, CollegeList, CollegeSearch, CollegeFilters, CollegeSort
- CollegeDetailHeader, CollegeStats, CourseTable, PlacementSection, SimilarColleges, SaveCollegeButton

#### [NEW] Pages
- [CollegesPage.tsx](file:///f:/Codes/Assignment/CampusCompare/client/src/pages/CollegesPage.tsx) — Search bar, filter sidebar, sort, card grid, pagination
- [CollegeDetailsPage.tsx](file:///f:/Codes/Assignment/CampusCompare/client/src/pages/CollegeDetailsPage.tsx) — Hero, stats, overview, courses, placements, reviews
- [HomePage.tsx](file:///f:/Codes/Assignment/CampusCompare/client/src/pages/HomePage.tsx) — Hero section, search, featured colleges, CTA sections

---

### Phase 9 — Compare UI (~5 files)

- [CompareTray.tsx](file:///f:/Codes/Assignment/CampusCompare/client/src/components/compare/CompareTray.tsx) — Fixed bottom tray
- [CompareTable.tsx](file:///f:/Codes/Assignment/CampusCompare/client/src/components/compare/CompareTable.tsx) — Side-by-side with highlights
- [CompareEmptyState.tsx](file:///f:/Codes/Assignment/CampusCompare/client/src/components/compare/CompareEmptyState.tsx)
- [ComparePage.tsx](file:///f:/Codes/Assignment/CampusCompare/client/src/pages/ComparePage.tsx)

---

### Phase 10 — Auth UI (~5 files)

- [LoginForm.tsx](file:///f:/Codes/Assignment/CampusCompare/client/src/components/auth/LoginForm.tsx)
- [RegisterForm.tsx](file:///f:/Codes/Assignment/CampusCompare/client/src/components/auth/RegisterForm.tsx)
- [LoginPage.tsx](file:///f:/Codes/Assignment/CampusCompare/client/src/pages/LoginPage.tsx)
- [RegisterPage.tsx](file:///f:/Codes/Assignment/CampusCompare/client/src/pages/RegisterPage.tsx)
- [AuthProvider.tsx](file:///f:/Codes/Assignment/CampusCompare/client/src/components/auth/AuthProvider.tsx)

---

### Phase 11 — Saved Colleges UI (~2 files)

- [SavedCollegesPage.tsx](file:///f:/Codes/Assignment/CampusCompare/client/src/pages/SavedCollegesPage.tsx) — Protected, list saved, remove, empty state

---

### Phase 12 — Admin UI (Optional, ~4 files)

- AdminDashboardPage, college CRUD forms — only after core is complete

---

### Phase 13 — Polish

- Loading skeletons on all data-fetching pages
- Empty states with illustrations
- Error states with retry
- Mobile responsive: collapsible filter sidebar, responsive cards, mobile compare tray
- Toast notifications for all actions
- 404 page

---

### Phase 14 — README & Deployment

- Complete README with all sections specified
- Deployment guides for Vercel (frontend), Render/Railway (backend), Neon/Supabase (DB)

---

## Verification Plan

### Automated Tests
```bash
# Backend
cd server
npm run build                    # TypeScript compiles without errors
npx prisma migrate dev --name init  # Migration runs successfully
npx prisma db seed               # Seed completes without errors

# Frontend  
cd client
npm run build                    # Vite build succeeds
```

### Manual Verification
- **College Listing**: Search, filter by state/fees/rating/type, sort, pagination all work
- **College Detail**: All sections render with real data
- **Compare**: Add 2-3 colleges → compare tray appears → compare page shows side-by-side with highlights
- **Auth**: Register → login → cookie set → `/me` returns user → logout clears cookie
- **Saved**: Login → save college → appears on `/saved` → remove works → duplicate prevented
- **Responsive**: Test on mobile viewport (375px), tablet (768px), desktop (1440px)
- **Edge Cases**: Empty search, invalid page, 404 slug, expired token, duplicate save

### API Testing
Test all endpoints with sample curl commands:
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{"name":"Test","email":"test@test.com","password":"password123"}'

# Colleges with filters
curl "http://localhost:5000/api/colleges?search=IIT&state=Delhi&sort=rating_desc&page=1&limit=12"

# Compare
curl "http://localhost:5000/api/compare?ids=id1,id2"
```

---

## Execution Approach

Given the massive scope (~80+ files), I will use **parallel subagents** to build the backend and frontend concurrently:

1. **Backend subagent**: Phases 2-6 (foundation → auth → college → compare/saved/review APIs)
2. **Frontend subagent**: Phases 7-11 (layout → college UI → compare → auth → saved)
3. **Main agent**: Orchestration, seed data, integration testing, polish, README

This parallelization will significantly speed up development while maintaining code quality.
