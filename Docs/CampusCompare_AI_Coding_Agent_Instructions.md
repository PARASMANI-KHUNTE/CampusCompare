# CampusCompare — AI Coding Agent Instructions

## 0. Project Context

You are building **CampusCompare**, a full-stack college discovery and comparison platform.

This project is based on **Track B — College Discovery Platform** from the assignment. The goal is to build a production-grade MVP where users can search colleges, filter results, view detailed college pages, compare colleges, and save colleges after login.

The selected role is **Full Stack Engineer**.

The selected track is **Track B — College Discovery Platform**.

The assignment expects a product similar in concept to:
- Careers360
- Collegedunia

But the goal is **not** to build a full marketplace. The goal is to choose **3–4 core features** and execute them extremely well.

---

## 1. Important Stack Decision

The assignment prefers:

- Next.js
- React
- TypeScript
- TailwindCSS
- Node.js
- Next.js API Routes or NestJS
- PostgreSQL
- Prisma ORM

For this project, use the following modified stack:

### Final Stack

```txt
Frontend: React + Vite + TypeScript + TailwindCSS
Backend: Node.js + Express.js + TypeScript
Database: PostgreSQL
ORM: Prisma
Authentication: JWT + HTTP-only Cookies
Password Hashing: Argon2
Deployment: Vercel + Render/Railway + Neon/Supabase PostgreSQL
```

### Why Express is Used

Use this explanation in README and Loom:

> The assignment recommends Node.js with Next.js API Routes or NestJS. I chose Express.js with TypeScript because I wanted to keep the backend as a separate, clean REST API service while still following the required Node.js, TypeScript, PostgreSQL, and Prisma stack. This separation makes the backend easier to organize using routes, controllers, services, middleware, validators, and Prisma-based data access.

### Do Not Use

Do not use MongoDB for this assignment because the assignment expects PostgreSQL and Prisma.

Do not use no-code or prompt-to-app generators.

---

## 2. Final Product Summary

### Project Name

```txt
CampusCompare
```

### One-Line Description

```txt
CampusCompare is a full-stack college discovery platform where students can search colleges, filter results, view detailed college information, compare colleges side-by-side, and save colleges after login.
```

### Core Features

Build these features completely:

1. College listing with search, filters, sorting, and pagination
2. College detail page
3. Compare 2–3 colleges side-by-side
4. Authentication + saved colleges

Optional, only if core features are complete:

5. Admin dashboard for adding/editing college data
6. Reviews system
7. Basic predictor tool

---

## 3. High-Level System Design

```txt
User Browser
   ↓
React + Vite Frontend
   ↓
Axios / TanStack Query
   ↓
Express.js REST API
   ↓
Controllers
   ↓
Services
   ↓
Prisma ORM
   ↓
PostgreSQL Database
```

---

## 4. Monorepo Folder Structure

Create this structure:

```txt
campuscompare/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── college/
│   │   │   ├── compare/
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── stores/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── utils/
│   │   ├── types/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── README.md
└── .gitignore
```

---

## 5. Frontend Tech and Libraries

Install and use:

```bash
npm create vite@latest client -- --template react-ts
cd client

npm install react-router-dom axios @tanstack/react-query zustand
npm install react-hook-form zod @hookform/resolvers
npm install lucide-react react-hot-toast recharts clsx tailwind-merge
npm install -D tailwindcss postcss autoprefixer
```

### Frontend Library Purpose

| Library | Purpose |
|---|---|
| React | UI library |
| Vite | Frontend build tool |
| TypeScript | Type safety |
| TailwindCSS | Styling |
| React Router DOM | Client-side routing |
| Axios | API calls |
| TanStack Query | Server state, caching, loading/error handling |
| Zustand | Local/global state such as compare tray and auth state |
| React Hook Form | Forms |
| Zod | Form validation |
| Lucide React | Icons |
| React Hot Toast | Toast notifications |
| Recharts | Charts for placement/rating if needed |
| clsx + tailwind-merge | Conditional class handling |

---

## 6. Backend Tech and Libraries

Install and use:

```bash
mkdir server
cd server
npm init -y

npm install express cors helmet morgan cookie-parser dotenv argon2 jsonwebtoken zod
npm install @prisma/client
npm install -D typescript ts-node-dev prisma
npm install -D @types/express @types/cors @types/morgan @types/cookie-parser @types/jsonwebtoken @types/node
```

### Backend Library Purpose

| Library | Purpose |
|---|---|
| Express.js | REST API server |
| TypeScript | Type safety |
| Prisma | ORM |
| PostgreSQL | Relational database |
| Zod | Request validation |
| Argon2 | Password hashing |
| JWT | Authentication |
| cookie-parser | Read HTTP-only cookies |
| CORS | Frontend-backend communication |
| Helmet | Security headers |
| Morgan | Request logs |
| dotenv | Environment variables |

---

## 7. Environment Variables

### client/.env.example

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### server/.env.example

```env
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
JWT_SECRET="replace-this-with-strong-secret"
JWT_EXPIRES_IN="7d"
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

## 8. Backend Prisma Schema

Create `server/prisma/schema.prisma`.

Use this schema:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  USER
  ADMIN
}

enum CollegeType {
  GOVERNMENT
  PRIVATE
  DEEMED
  AUTONOMOUS
}

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  role      UserRole @default(USER)
  avatarUrl String?

  savedColleges SavedCollege[]
  reviews       Review[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model College {
  id                String      @id @default(cuid())
  name              String
  slug              String      @unique
  shortName         String?
  description       String
  overview          String?

  city              String
  state             String
  address           String?
  collegeType       CollegeType
  ownership         String?
  establishedYear   Int?
  approvedBy        String[]
  affiliatedTo      String?
  accreditation     String[]

  imageUrl          String?
  gallery           String[]

  feesMin           Int
  feesMax           Int
  rating            Float       @default(0)
  reviewCount       Int         @default(0)

  placementAverage  Int?
  placementHighest  Int?

  examsAccepted     String[]
  popularCourses    String[]
  facilities        String[]
  tags              String[]

  courses           Course[]
  reviews           Review[]
  savedBy           SavedCollege[]

  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt

  @@index([name])
  @@index([city])
  @@index([state])
  @@index([rating])
  @@index([feesMin])
  @@index([feesMax])
}

model Course {
  id            String   @id @default(cuid())
  collegeId     String

  name          String
  category      String
  degree        String?
  duration      String
  fees          Int
  eligibility   String?
  examsAccepted String[]
  seats         Int?

  college       College  @relation(fields: [collegeId], references: [id], onDelete: Cascade)

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([collegeId])
  @@index([name])
  @@index([category])
}

model Review {
  id                   String   @id @default(cuid())
  collegeId             String
  userId                String

  rating                Int
  title                 String?
  comment               String

  placementRating       Int?
  facultyRating         Int?
  campusRating          Int?
  valueForMoneyRating   Int?

  college               College  @relation(fields: [collegeId], references: [id], onDelete: Cascade)
  user                  User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  @@index([collegeId])
  @@index([userId])
}

model SavedCollege {
  id        String   @id @default(cuid())
  userId    String
  collegeId String

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  college   College  @relation(fields: [collegeId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())

  @@unique([userId, collegeId])
  @@index([userId])
  @@index([collegeId])
}

model SavedComparison {
  id          String   @id @default(cuid())
  userId      String
  title       String?
  collegeIds  String[]

  createdAt   DateTime @default(now())
}
```

---

## 9. Database Migration Commands

Run:

```bash
cd server
npx prisma init
npx prisma migrate dev --name init
npx prisma generate
```

Seed database:

```bash
npx prisma db seed
```

---

## 10. Required Seed Data

Create at least **25–40 colleges**.

Each college should have:

- Name
- Slug
- City
- State
- College type
- Fees min/max
- Rating
- Average placement
- Highest placement
- Popular courses
- Exams accepted
- Facilities
- 3–5 courses

Use real-looking but safe mock data.

Example colleges:

- Guru Ghasidas Vishwavidyalaya
- Delhi Technological University
- IIT Delhi
- NIT Raipur
- Banaras Hindu University
- Pune Institute of Computer Technology
- VIT Vellore
- SRM University
- Amity University
- Chandigarh University

Do not claim exact real-world ranking unless verified. Use seed/demo data.

---

## 11. Backend Architecture Rules

Use this backend pattern:

```txt
Route → Controller → Service → Prisma
```

### Route

Only defines URL and middleware.

### Controller

Handles request and response.

### Service

Contains business logic and database queries.

### Validator

Contains Zod schemas.

### Middleware

Handles authentication, validation, errors, roles.

### Utils

Reusable helper functions.

---

## 12. Backend Files to Create

### Config

```txt
server/src/config/env.ts
server/src/config/prisma.ts
```

### Middlewares

```txt
server/src/middlewares/auth.middleware.ts
server/src/middlewares/error.middleware.ts
server/src/middlewares/validate.middleware.ts
server/src/middlewares/role.middleware.ts
```

### Utils

```txt
server/src/utils/asyncHandler.ts
server/src/utils/apiResponse.ts
server/src/utils/generateToken.ts
server/src/utils/slugify.ts
```

### Validators

```txt
server/src/validators/auth.validator.ts
server/src/validators/college.validator.ts
server/src/validators/review.validator.ts
server/src/validators/saved.validator.ts
```

### Routes

```txt
server/src/routes/auth.routes.ts
server/src/routes/college.routes.ts
server/src/routes/compare.routes.ts
server/src/routes/saved.routes.ts
server/src/routes/review.routes.ts
server/src/routes/admin.routes.ts
```

### Controllers

```txt
server/src/controllers/auth.controller.ts
server/src/controllers/college.controller.ts
server/src/controllers/compare.controller.ts
server/src/controllers/saved.controller.ts
server/src/controllers/review.controller.ts
server/src/controllers/admin.controller.ts
```

### Services

```txt
server/src/services/auth.service.ts
server/src/services/college.service.ts
server/src/services/compare.service.ts
server/src/services/saved.service.ts
server/src/services/review.service.ts
server/src/services/admin.service.ts
```

---

## 13. API Response Format

All APIs must follow this format.

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Paginated Response

```json
{
  "success": true,
  "message": "Colleges fetched successfully",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "totalPages": 9
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Something went wrong",
  "errors": []
}
```

---

## 14. Backend API Endpoints

### Auth APIs

```txt
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/logout
```

### College APIs

```txt
GET    /api/colleges
GET    /api/colleges/:slug
GET    /api/colleges/:slug/related
```

### Compare APIs

```txt
GET    /api/compare?ids=id1,id2,id3
```

### Saved College APIs

```txt
POST   /api/saved-colleges
GET    /api/saved-colleges
DELETE /api/saved-colleges/:collegeId
```

### Review APIs

```txt
POST   /api/reviews/:collegeId
GET    /api/reviews/:collegeId
```

### Admin APIs

Optional but recommended:

```txt
POST   /api/admin/colleges
PUT    /api/admin/colleges/:id
DELETE /api/admin/colleges/:id
POST   /api/admin/courses
PUT    /api/admin/courses/:id
DELETE /api/admin/courses/:id
```

---

## 15. Authentication Requirements

Use **JWT + HTTP-only cookie**.

### Register Flow

```txt
User submits name, email, password
   ↓
Validate input using Zod
   ↓
Check if email already exists
   ↓
Hash password using Argon2
   ↓
Create user in PostgreSQL
   ↓
Generate JWT
   ↓
Set token in HTTP-only cookie
   ↓
Return user object without password
```

### Login Flow

```txt
User submits email and password
   ↓
Validate input using Zod
   ↓
Find user by email
   ↓
Verify password using Argon2
   ↓
Generate JWT
   ↓
Set token in HTTP-only cookie
   ↓
Return user object without password
```

### Auth Middleware

Middleware should:

- Read token from cookie
- Verify JWT
- Find user from database
- Attach user to `req.user`
- Reject invalid/expired token

### Cookie Settings

Development:

```ts
httpOnly: true
secure: false
sameSite: "lax"
```

Production:

```ts
httpOnly: true
secure: true
sameSite: "none"
```

---

## 16. College Search and Filter Requirements

### Endpoint

```txt
GET /api/colleges
```

### Query Params

Support these query params:

```txt
search
city
state
course
collegeType
minFees
maxFees
minRating
minPlacement
sort
page
limit
```

### Example

```txt
GET /api/colleges?search=mca&state=Chhattisgarh&minRating=4&page=1&limit=12&sort=rating_desc
```

### Backend Logic

Implement this logic:

```txt
If search exists:
  search in college name, shortName, city, state, popularCourses, tags

If city exists:
  filter by city

If state exists:
  filter by state

If course exists:
  filter by popularCourses or related Course table

If collegeType exists:
  filter by collegeType

If minFees/maxFees exist:
  filter by feesMin and feesMax

If minRating exists:
  rating >= minRating

If minPlacement exists:
  placementAverage >= minPlacement

Apply sorting:
  rating_desc
  fees_asc
  fees_desc
  placement_desc
  newest

Apply pagination:
  skip = (page - 1) * limit
  take = limit
```

### Response

Return:

- Colleges
- Pagination metadata
- Applied filters if useful

---

## 17. College Listing Page Requirements

Route:

```txt
/colleges
```

### UI Sections

- Navbar
- Search bar
- Filter sidebar
- Sort dropdown
- College card grid
- Pagination
- Compare tray
- Footer

### Each College Card Must Show

- College image
- Name
- City and state
- College type
- Rating
- Fees range
- Average placement
- Popular courses
- View Details button
- Compare button
- Save button

### States to Handle

- Loading state
- Error state
- Empty result state
- No internet/API failure state
- Disabled button while action is running

---

## 18. College Detail Page Requirements

Route:

```txt
/colleges/:slug
```

### UI Sections

- College hero/banner
- Quick stats
- Overview
- Courses offered
- Fee structure
- Placement details
- Reviews
- Facilities
- Similar colleges
- Save button
- Compare button

### Quick Stats

Show:

- Rating
- Fees range
- Average placement
- Highest placement
- College type
- Established year
- Exams accepted

### Backend

Use:

```txt
GET /api/colleges/:slug
```

Return college with:

- Courses
- Reviews
- Review users where safe
- Saved status if user is logged in, optional

---

## 19. Compare Colleges Feature

### Frontend State

Use Zustand store:

```txt
compareStore
├── compareItems
├── addToCompare
├── removeFromCompare
├── clearCompare
└── isInCompare
```

### Rules

- Minimum 2 colleges needed to compare
- Maximum 3 colleges allowed
- Duplicate colleges not allowed
- Show toast if user tries to add more than 3
- Show compare tray when at least 1 college is selected

### Compare Tray

Show at bottom of screen:

```txt
College A | College B | Add one more | Compare Now
```

### Compare Page Route

```txt
/compare?ids=id1,id2,id3
```

### Compare API

```txt
GET /api/compare?ids=id1,id2,id3
```

### Compare Fields

Show side-by-side:

- Name
- Location
- College type
- Established year
- Rating
- Fees min/max
- Average placement
- Highest placement
- Popular courses
- Exams accepted
- Facilities

### Highlight Best Values

Highlight:

- Lowest fees
- Highest rating
- Highest average placement
- Highest highest-placement value

---

## 20. Saved Colleges Feature

### Route

```txt
/saved
```

### Protected Page

Only logged-in users can access.

If not logged in:

- Redirect to `/login`
- Or show login required message

### APIs

```txt
POST /api/saved-colleges
GET /api/saved-colleges
DELETE /api/saved-colleges/:collegeId
```

### Save College Flow

```txt
User clicks Save
   ↓
If not logged in:
  Redirect to login or show toast
   ↓
If logged in:
  Send POST request with collegeId
   ↓
Backend verifies JWT
   ↓
Backend checks duplicate save
   ↓
Create SavedCollege record
   ↓
Return success
   ↓
Frontend updates UI and shows toast
```

### Requirements

- Prevent duplicate saved colleges
- Show saved state on card if possible
- Allow remove from saved page
- Show empty state if user has no saved colleges

---

## 21. Review Feature

This is useful but can be optional if time is short.

### User Can

- View reviews on college detail page
- Add review after login

### Review Fields

- Rating
- Title
- Comment
- Placement rating
- Faculty rating
- Campus rating
- Value for money rating

### APIs

```txt
GET  /api/reviews/:collegeId
POST /api/reviews/:collegeId
```

### Rule

Only logged-in users can submit reviews.

After adding a review, update:

- College rating
- Review count

---

## 22. Admin Feature

Optional but recommended because it helps data management.

### Admin Can

- Add college
- Edit college
- Delete college
- Add course
- Edit course
- Delete course

### Admin Protection

Only users with role `ADMIN` can access admin APIs.

### Admin Pages

```txt
/admin
/admin/colleges
/admin/colleges/new
/admin/colleges/:id/edit
```

---

## 23. Frontend Pages to Build

Create these pages:

```txt
src/pages/HomePage.tsx
src/pages/CollegesPage.tsx
src/pages/CollegeDetailsPage.tsx
src/pages/ComparePage.tsx
src/pages/SavedCollegesPage.tsx
src/pages/LoginPage.tsx
src/pages/RegisterPage.tsx
src/pages/AdminDashboardPage.tsx
src/pages/NotFoundPage.tsx
```

---

## 24. Frontend Components to Build

### Layout

```txt
Navbar
Footer
PageContainer
ProtectedRoute
AdminRoute
```

### UI

```txt
Button
Input
Select
Card
Badge
Loader
Skeleton
EmptyState
ErrorState
Modal
Pagination
```

### College

```txt
CollegeCard
CollegeList
CollegeSearch
CollegeFilters
CollegeSort
CollegeDetailHeader
CollegeStats
CourseTable
PlacementSection
ReviewList
ReviewForm
SimilarColleges
SaveCollegeButton
```

### Compare

```txt
CompareTray
CompareTable
CompareEmptyState
CompareMetricRow
```

### Auth

```txt
LoginForm
RegisterForm
AuthProvider
```

---

## 25. Frontend Routing

Use React Router.

Routes:

```tsx
/
 /colleges
 /colleges/:slug
 /compare
 /saved
 /login
 /register
 /admin
 /admin/colleges
 /admin/colleges/new
 /admin/colleges/:id/edit
 *
```

Protected routes:

```txt
/saved
/admin/*
```

Admin routes should require admin role.

---

## 26. Frontend API Services

Create API service files:

```txt
src/services/api.ts
src/services/auth.service.ts
src/services/college.service.ts
src/services/compare.service.ts
src/services/saved.service.ts
src/services/review.service.ts
src/services/admin.service.ts
```

### Axios Config

Use:

```ts
baseURL: import.meta.env.VITE_API_BASE_URL
withCredentials: true
```

This is required for HTTP-only cookie auth.

---

## 27. State Management

### Use TanStack Query For

- College list
- College detail
- Compare data
- Saved colleges
- Current user

### Use Zustand For

- Compare tray
- UI state if needed
- Auth user state if not using only TanStack Query

### Store Names

```txt
authStore
compareStore
filterStore optional
```

---

## 28. UI/UX Requirements

### Style Direction

Use a clean education-tech design:

- White background
- Blue/indigo primary color
- Soft gray sections
- Rounded cards
- Subtle shadows
- Clear spacing
- Fully responsive

### Must Have

- Mobile responsive layout
- Filter sidebar collapses on mobile
- Compare tray works on mobile
- Buttons have disabled/loading states
- Toast notifications
- Empty states
- Error states
- Skeleton loaders

### Avoid

- Too many animations
- Complex UI before core features work
- Hardcoded fake results in frontend
- Unclear filter UX
- Broken mobile layout

---

## 29. Validation Requirements

Use Zod.

### Auth Validation

Register:

```txt
name required
email valid
password minimum 6 characters
```

Login:

```txt
email valid
password required
```

### College Query Validation

Validate:

```txt
page number
limit number
minFees number
maxFees number
minRating number
sort enum
collegeType enum
```

### Review Validation

Validate:

```txt
rating between 1 and 5
comment required
title optional
```

---

## 30. Error Handling

Use centralized backend error middleware.

Handle:

- Validation errors
- Unauthorized errors
- Forbidden errors
- Not found errors
- Duplicate saved college
- Database errors
- Unknown server errors

Frontend should show:

- User-friendly toast
- Error state component
- No raw stack trace

---

## 31. Security Requirements

Backend:

- Use Helmet
- Use CORS with allowed client URL
- Use HTTP-only cookie
- Hash passwords with Argon2
- Never return password in API response
- Validate all incoming data
- Protect private routes
- Protect admin routes
- Use environment variables
- Do not commit `.env`

Frontend:

- Do not store JWT in localStorage
- Use `withCredentials: true`
- Handle unauthorized response globally if possible

---

## 32. Performance Requirements

Backend:

- Use pagination for college listing
- Add Prisma indexes
- Avoid fetching unnecessary data
- Use select/include carefully
- Limit compare to 3 colleges

Frontend:

- Use TanStack Query caching
- Debounce search input
- Avoid unnecessary re-renders
- Use skeleton loading
- Use lazy route loading if possible

---

## 33. In-Depth User Workflows

### 33.1 Guest Discovery Workflow

```txt
User opens homepage
   ↓
User sees search bar and popular college categories
   ↓
User searches "MCA colleges"
   ↓
Frontend navigates to /colleges?search=MCA
   ↓
Frontend calls backend with search query
   ↓
Backend returns paginated colleges
   ↓
User applies filters
   ↓
Backend returns filtered results
   ↓
User opens college detail page
```

### 33.2 Compare Workflow

```txt
User visits college listing
   ↓
User clicks Compare on College A
   ↓
College A added to compare store
   ↓
Compare tray appears
   ↓
User clicks Compare on College B
   ↓
College B added
   ↓
User clicks Compare Now
   ↓
Frontend navigates to /compare?ids=A,B
   ↓
Frontend calls compare API
   ↓
Backend returns selected college data
   ↓
Frontend renders comparison table
```

### 33.3 Saved College Workflow

```txt
User clicks Save on a college card
   ↓
If user is not logged in:
   Show toast: Please login to save colleges
   Redirect to /login
   ↓
If user is logged in:
   POST /api/saved-colleges
   ↓
Backend verifies cookie token
   ↓
Backend creates saved college if not already saved
   ↓
Frontend updates card state
   ↓
User can view saved colleges at /saved
```

### 33.4 Login Workflow

```txt
User opens /login
   ↓
User enters email and password
   ↓
Frontend validates form with Zod
   ↓
POST /api/auth/login
   ↓
Backend verifies credentials
   ↓
Backend sets HTTP-only cookie
   ↓
Frontend fetches /api/auth/me
   ↓
User is redirected to previous page or /colleges
```

### 33.5 Admin Workflow

```txt
Admin logs in
   ↓
Admin opens /admin
   ↓
Frontend checks current user role
   ↓
Admin can create or edit college data
   ↓
Backend validates admin role
   ↓
Data is stored using Prisma
   ↓
Public users can see updated data
```

---

## 34. Feature Acceptance Criteria

### College Listing

Must work:

- Search by text
- Filter by state
- Filter by city
- Filter by course
- Filter by fees
- Filter by rating
- Sort by rating/fees/placement
- Pagination
- Loading/error/empty states

### College Detail

Must show:

- College info
- Courses
- Placements
- Fees
- Reviews or review placeholder
- Save button
- Compare button

### Compare

Must support:

- Add college
- Remove college
- Min 2, max 3 colleges
- Side-by-side comparison
- Best-value highlight

### Auth

Must support:

- Register
- Login
- Logout
- Get current user
- Protected routes

### Saved Colleges

Must support:

- Save
- Remove
- List saved colleges
- Prevent duplicates
- User-specific data only

---

## 35. Development Phases

Follow these phases strictly.

### Phase 1 — Repository Setup

- Create monorepo
- Create client using Vite React TypeScript
- Create server using Express TypeScript
- Add TailwindCSS
- Add ESLint if possible
- Add root README

### Phase 2 — Backend Foundation

- Setup Express app
- Setup CORS
- Setup Helmet
- Setup Morgan
- Setup cookie parser
- Setup error middleware
- Setup Prisma
- Connect PostgreSQL

### Phase 3 — Database

- Create Prisma schema
- Run migration
- Create seed file
- Seed 25–40 colleges
- Test database with Prisma Studio

### Phase 4 — Auth APIs

- Register
- Login
- Me
- Logout
- Auth middleware
- Role middleware

### Phase 5 — College APIs

- Get colleges with search/filter/sort/pagination
- Get college by slug
- Related colleges

### Phase 6 — Saved and Compare APIs

- Save college
- Get saved colleges
- Remove saved college
- Compare colleges

### Phase 7 — Frontend Layout

- Navbar
- Footer
- Home page
- Basic routing
- API service setup
- TanStack Query provider
- Toast provider

### Phase 8 — College UI

- College listing page
- Search
- Filters
- Cards
- Pagination
- Detail page

### Phase 9 — Compare UI

- Zustand compare store
- Compare tray
- Compare page
- Compare table
- Best-value highlight

### Phase 10 — Auth UI

- Login page
- Register page
- Auth state
- Protected route
- Logout

### Phase 11 — Saved Colleges UI

- Save button integration
- Saved page
- Remove saved college
- Empty state

### Phase 12 — Admin UI

Optional after core is complete.

### Phase 13 — Polish

- Loading states
- Empty states
- Error states
- Mobile responsive
- README
- Screenshots
- Loom script

### Phase 14 — Deployment

- Deploy frontend to Vercel
- Deploy backend to Render/Railway
- Deploy PostgreSQL to Neon/Supabase
- Configure environment variables
- Test production end-to-end

---

## 36. README Requirements

README must include:

```txt
Project name
Project description
Assignment track and role
Tech stack
Features
Architecture diagram
Folder structure
Environment variables
Installation steps
Database setup
API documentation
Screenshots
Deployment links
Loom video link
Tradeoffs
Future improvements
```

### Tradeoffs Section

Include:

```txt
I used Express.js instead of Next.js API Routes/NestJS to keep the backend as a clean standalone REST API service. The rest of the stack remains aligned with the assignment expectation: TypeScript, PostgreSQL, Prisma ORM, React, and TailwindCSS.
```

---

## 37. Loom Video Script

Use this flow:

```txt
1. Introduce project: CampusCompare
2. Explain selected role: Full Stack Engineer
3. Explain selected track: College Discovery Platform
4. Explain why these 4 features were selected
5. Show homepage and college listing
6. Demonstrate search and filters
7. Open college detail page
8. Add 2–3 colleges to compare
9. Demonstrate comparison page
10. Register/login user
11. Save college and view saved page
12. Explain backend architecture
13. Explain database schema
14. Explain Prisma usage
15. Explain authentication
16. Explain edge cases handled
17. Explain tradeoffs
18. Explain future improvements
```

### Key Lines to Say

```txt
I chose fewer features and implemented them deeply instead of building many incomplete features.

All college data comes from PostgreSQL through Express APIs using Prisma, not from hardcoded frontend data.

Search, filtering, sorting, and pagination are handled by the backend.

The comparison flow is handled with frontend state and backend structured data.

Saved colleges are user-specific and protected through JWT authentication.
```

---

## 38. Edge Cases to Handle

### Search/Filter

- No matching colleges
- Invalid page number
- Invalid fees range
- Invalid rating value
- Empty search query

### Compare

- Less than 2 colleges selected
- More than 3 colleges selected
- Duplicate college selected
- Invalid college ID in URL

### Auth

- Email already registered
- Wrong password
- Expired token
- Unauthorized saved route access

### Saved Colleges

- Duplicate save attempt
- Remove college that is not saved
- User tries to save without login

### Backend

- Database connection failure
- Validation error
- Unknown server error

---

## 39. Quality Rules for AI Coding Agent

Follow these rules:

1. Do not create hardcoded frontend-only college data except temporary mock during UI building.
2. Final data must come from PostgreSQL through backend APIs.
3. Use TypeScript in both client and server.
4. Use clean folder structure.
5. Use reusable components.
6. Use proper validation on backend.
7. Use centralized error handling.
8. Use HTTP-only cookie for authentication.
9. Do not expose passwords or tokens.
10. Do not skip loading, error, and empty states.
11. Do not build unnecessary features before core features.
12. Keep UI clean and responsive.
13. Use meaningful commit messages if committing.
14. Update README as features are completed.
15. Make sure production deployment works.

---

## 40. Final Deliverables

The final submission must include:

```txt
Live frontend URL
Live backend API URL
GitHub repository URL
Loom video link
README with setup and architecture
```

---

## 41. Final Feature Checklist

Before completion, verify:

- [ ] Home page works
- [ ] College listing works
- [ ] Search works
- [ ] Filters work
- [ ] Sorting works
- [ ] Pagination works
- [ ] College detail page works
- [ ] Compare tray works
- [ ] Compare page works
- [ ] Register works
- [ ] Login works
- [ ] Logout works
- [ ] Current user API works
- [ ] Save college works
- [ ] Saved colleges page works
- [ ] Remove saved college works
- [ ] Backend validation works
- [ ] Error middleware works
- [ ] PostgreSQL connected
- [ ] Prisma schema migrated
- [ ] Seed data added
- [ ] Frontend deployed
- [ ] Backend deployed
- [ ] Production env variables configured
- [ ] README completed
- [ ] Loom video recorded

---

## 42. Future Improvements

Mention these as future improvements:

- College predictor based on exam and rank
- Advanced recommendation engine
- Admin analytics dashboard
- User reviews moderation
- College application tracking
- Discussion/Q&A forum
- Advanced comparison charts
- Better SEO with Next.js migration
- Real verified college dataset integration

---

## 43. Final Instruction to AI Coding Agent

Build this project step-by-step.

Priority order:

```txt
1. Backend foundation
2. Database schema and seed
3. Auth APIs
4. College APIs
5. Saved/compare APIs
6. Frontend layout
7. College listing/detail UI
8. Compare UI
9. Auth UI
10. Saved colleges UI
11. Polish
12. Deployment
13. README and Loom notes
```

Do not skip core features.

Do not overbuild optional features before the required MVP is complete.

The final project should feel like a clean, working, production-oriented full-stack MVP.
