# CampusCompare — AI Coding Agent Instructions

## 0. Project Context

You are building **CampusCompare**, a full-stack college discovery and comparison platform.

This project is based on **Track B — College Discovery Platform** from the assignment. The goal is to build a production-grade MVP where users can search colleges, filter results, view detailed college pages, compare colleges, and save colleges after login.

The selected role is:

```txt
Full Stack Engineer
```

The selected project track is:

```txt
Track B — College Discovery Platform
```

The product is inspired by college discovery platforms such as Careers360 and Collegedunia, but this project should be built as a clean MVP, not as a full marketplace clone.

---

## 1. Final Tech Stack Decision

Use this stack only:

```txt
Frontend:
React + Vite + TypeScript + TailwindCSS

Backend:
Node.js + Express.js + TypeScript

Database:
PostgreSQL

ORM:
Prisma ORM

Authentication:
JWT + HTTP-only Cookies

Password Hashing:
Argon2

Deployment:
Frontend: Vercel
Backend: Render / Railway
Database: Neon / Supabase / Railway PostgreSQL
```

## 1.1 Important Clarification

Do **not** build this project using Next.js.

Do **not** use Next.js API Routes.

Do **not** use MongoDB.

Do **not** use a no-code or prompt-to-app generator.

We are using a separated frontend and backend architecture:

```txt
React frontend
   ↓
Express REST API backend
   ↓
Prisma ORM
   ↓
PostgreSQL database
```

## 1.2 How to Explain Express in README / Loom

Use this explanation:

```txt
I built the project using React for the frontend and Node.js with Express.js for the backend. I kept the backend as a separate REST API service to clearly demonstrate backend architecture using routes, controllers, services, middleware, validation, authentication, and Prisma-based database access. PostgreSQL and Prisma are used for structured relational data handling.
```

---

# 2. Project Name

```txt
CampusCompare
```

## One-Line Description

```txt
CampusCompare is a full-stack college discovery platform where students can search colleges, apply filters, view detailed college information, compare colleges side-by-side, and save colleges after login.
```

---

# 3. Main Features

Build these 4 features completely:

```txt
1. College listing with search, filters, sorting, and pagination
2. College detail page
3. Compare 2–3 colleges side-by-side
4. Authentication + saved colleges
```

Optional features only after the main features are complete:

```txt
5. Admin dashboard for adding/editing college data
6. Reviews system
7. Basic predictor tool
```

Priority should always be:

```txt
Quality > Quantity
```

---

# 4. High-Level System Design

```txt
User Browser
   ↓
React + Vite Frontend
   ↓
Axios / TanStack Query
   ↓
Node.js + Express.js REST API
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

# 5. Monorepo Folder Structure

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

# 6. Frontend Setup

Create the frontend using Vite:

```bash
npm create vite@latest client -- --template react-ts
cd client
```

Install dependencies:

```bash
npm install react-router-dom axios @tanstack/react-query zustand
npm install react-hook-form zod @hookform/resolvers
npm install lucide-react react-hot-toast recharts clsx tailwind-merge
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## Frontend Libraries

| Library | Purpose |
|---|---|
| React | UI library |
| Vite | Frontend build tool |
| TypeScript | Type safety |
| TailwindCSS | Styling |
| React Router DOM | Routing |
| Axios | API calls |
| TanStack Query | Server state, caching, loading and error handling |
| Zustand | Compare tray and lightweight global state |
| React Hook Form | Forms |
| Zod | Form validation |
| Lucide React | Icons |
| React Hot Toast | Toast notifications |
| Recharts | Charts for placement/rating if needed |
| clsx + tailwind-merge | Clean conditional class handling |

---

# 7. Backend Setup

Create backend:

```bash
mkdir server
cd server
npm init -y
```

Install dependencies:

```bash
npm install express cors helmet morgan cookie-parser dotenv argon2 jsonwebtoken zod
npm install @prisma/client
npm install -D typescript ts-node-dev prisma
npm install -D @types/express @types/cors @types/morgan @types/cookie-parser @types/jsonwebtoken @types/node
```

Create TypeScript config:

```bash
npx tsc --init
```

Recommended `server/package.json` scripts:

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "ts-node-dev prisma/seed.ts"
  }
}
```

---

# 8. Environment Variables

## client/.env.example

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## server/.env.example

```env
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
JWT_SECRET="replace-this-with-strong-secret"
JWT_EXPIRES_IN="7d"
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

# 9. Prisma Database Schema

Create:

```txt
server/prisma/schema.prisma
```

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

# 10. Database Commands

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

Open Prisma Studio:

```bash
npx prisma studio
```

---

# 11. Seed Data Requirements

Create at least:

```txt
25–40 colleges
3–5 courses per college
Some reviews for selected colleges
1 admin user
2 normal users
```

Each college should include:

```txt
name
slug
city
state
collegeType
feesMin
feesMax
rating
placementAverage
placementHighest
popularCourses
examsAccepted
facilities
description
courses
```

Use real-looking demo data, but do not claim exact rankings or official stats unless verified.

---

# 12. Backend Architecture Pattern

Use this pattern:

```txt
Route → Controller → Service → Prisma
```

## Route

Defines URL and middleware only.

## Controller

Handles request and response.

## Service

Contains business logic and Prisma queries.

## Validator

Contains Zod schemas.

## Middleware

Handles authentication, validation, roles, and errors.

## Utils

Contains reusable helpers.

---

# 13. Backend Files to Create

```txt
server/src/config/env.ts
server/src/config/prisma.ts

server/src/middlewares/auth.middleware.ts
server/src/middlewares/error.middleware.ts
server/src/middlewares/validate.middleware.ts
server/src/middlewares/role.middleware.ts

server/src/utils/asyncHandler.ts
server/src/utils/apiResponse.ts
server/src/utils/generateToken.ts
server/src/utils/slugify.ts

server/src/validators/auth.validator.ts
server/src/validators/college.validator.ts
server/src/validators/review.validator.ts
server/src/validators/saved.validator.ts

server/src/routes/auth.routes.ts
server/src/routes/college.routes.ts
server/src/routes/compare.routes.ts
server/src/routes/saved.routes.ts
server/src/routes/review.routes.ts
server/src/routes/admin.routes.ts

server/src/controllers/auth.controller.ts
server/src/controllers/college.controller.ts
server/src/controllers/compare.controller.ts
server/src/controllers/saved.controller.ts
server/src/controllers/review.controller.ts
server/src/controllers/admin.controller.ts

server/src/services/auth.service.ts
server/src/services/college.service.ts
server/src/services/compare.service.ts
server/src/services/saved.service.ts
server/src/services/review.service.ts
server/src/services/admin.service.ts
```

---

# 14. Express App Requirements

Create `server/src/app.ts`.

Must include:

```txt
express.json()
cookieParser()
cors with CLIENT_URL and credentials true
helmet()
morgan()
routes
not found handler
global error handler
```

CORS must support cookies:

```ts
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
```

---

# 15. API Response Format

All APIs must follow this format.

## Success

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

## Pagination

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

## Error

```json
{
  "success": false,
  "message": "Something went wrong",
  "errors": []
}
```

---

# 16. Backend API Endpoints

## Auth APIs

```txt
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/logout
```

## College APIs

```txt
GET    /api/colleges
GET    /api/colleges/:slug
GET    /api/colleges/:slug/related
```

## Compare APIs

```txt
GET    /api/compare?ids=id1,id2,id3
```

## Saved College APIs

```txt
POST   /api/saved-colleges
GET    /api/saved-colleges
DELETE /api/saved-colleges/:collegeId
```

## Review APIs

```txt
POST   /api/reviews/:collegeId
GET    /api/reviews/:collegeId
```

## Admin APIs

Optional but recommended after core features:

```txt
POST   /api/admin/colleges
PUT    /api/admin/colleges/:id
DELETE /api/admin/colleges/:id
POST   /api/admin/courses
PUT    /api/admin/courses/:id
DELETE /api/admin/courses/:id
```

---

# 17. Authentication Requirements

Use:

```txt
JWT + HTTP-only cookie
Argon2 password hashing
```

## Register Flow

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

## Login Flow

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

## Auth Middleware

Middleware must:

```txt
Read token from cookie
Verify JWT
Find user from database
Attach user to req.user
Reject invalid or expired token
```

## Cookie Settings

Development:

```ts
httpOnly: true,
secure: false,
sameSite: "lax"
```

Production:

```ts
httpOnly: true,
secure: true,
sameSite: "none"
```

---

# 18. College Search and Filter Requirements

## Endpoint

```txt
GET /api/colleges
```

## Query Params

Support:

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

## Example

```txt
GET /api/colleges?search=mca&state=Chhattisgarh&minRating=4&page=1&limit=12&sort=rating_desc
```

## Backend Logic

```txt
If search exists:
  Search in college name, shortName, city, state, popularCourses, tags

If city exists:
  Filter by city

If state exists:
  Filter by state

If course exists:
  Filter by popularCourses or Course table

If collegeType exists:
  Filter by collegeType

If minFees/maxFees exist:
  Filter by feesMin and feesMax

If minRating exists:
  Filter rating >= minRating

If minPlacement exists:
  Filter placementAverage >= minPlacement

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

---

# 19. Frontend Pages

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

# 20. Frontend Routing

Use React Router.

Routes:

```txt
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

Admin routes require `ADMIN` role.

---

# 21. Frontend Components

## Layout

```txt
Navbar
Footer
PageContainer
ProtectedRoute
AdminRoute
```

## UI

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

## College

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

## Compare

```txt
CompareTray
CompareTable
CompareEmptyState
CompareMetricRow
```

## Auth

```txt
LoginForm
RegisterForm
AuthProvider
```

---

# 22. Frontend API Services

Create:

```txt
src/services/api.ts
src/services/auth.service.ts
src/services/college.service.ts
src/services/compare.service.ts
src/services/saved.service.ts
src/services/review.service.ts
src/services/admin.service.ts
```

## Axios Config

Use:

```ts
baseURL: import.meta.env.VITE_API_BASE_URL,
withCredentials: true
```

`withCredentials: true` is required because authentication uses HTTP-only cookies.

---

# 23. State Management

Use **TanStack Query** for server data:

```txt
College list
College detail
Compare data
Saved colleges
Current user
Reviews
```

Use **Zustand** for local/global UI state:

```txt
Compare tray
Auth user snapshot if needed
Filter UI state if needed
```

Recommended stores:

```txt
authStore
compareStore
filterStore optional
```

---

# 24. College Listing Page Requirements

Route:

```txt
/colleges
```

Must include:

```txt
Navbar
Search bar
Filter sidebar
Sort dropdown
College card grid
Pagination
Compare tray
Footer
```

Each college card must show:

```txt
College image
Name
City and state
College type
Rating
Fees range
Average placement
Popular courses
View Details button
Compare button
Save button
```

States to handle:

```txt
Loading
Error
Empty result
No internet/API failure
Disabled button while action is running
```

---

# 25. College Detail Page Requirements

Route:

```txt
/colleges/:slug
```

Must include:

```txt
College hero/banner
Quick stats
Overview
Courses offered
Fee structure
Placement details
Reviews
Facilities
Similar colleges
Save button
Compare button
```

Quick stats:

```txt
Rating
Fees range
Average placement
Highest placement
College type
Established year
Exams accepted
```

Backend:

```txt
GET /api/colleges/:slug
```

Return:

```txt
College basic info
Courses
Reviews
Safe user info for reviews
```

---

# 26. Compare Colleges Feature

## Store

Use Zustand:

```txt
compareStore
├── compareItems
├── addToCompare
├── removeFromCompare
├── clearCompare
└── isInCompare
```

## Rules

```txt
Minimum 2 colleges required for comparison
Maximum 3 colleges allowed
Duplicate colleges not allowed
Show toast if user tries to add more than 3
Show compare tray when at least 1 college is selected
```

## Compare Page

Route:

```txt
/compare?ids=id1,id2,id3
```

API:

```txt
GET /api/compare?ids=id1,id2,id3
```

Compare fields:

```txt
Name
Location
College type
Established year
Rating
Fees min/max
Average placement
Highest placement
Popular courses
Exams accepted
Facilities
```

Highlight:

```txt
Lowest fees
Highest rating
Highest average placement
Highest highest-placement value
```

---

# 27. Saved Colleges Feature

Route:

```txt
/saved
```

Protected page.

If not logged in:

```txt
Redirect to /login
or show login required message
```

APIs:

```txt
POST /api/saved-colleges
GET /api/saved-colleges
DELETE /api/saved-colleges/:collegeId
```

Save flow:

```txt
User clicks Save
   ↓
If not logged in, show toast and redirect
   ↓
If logged in, send POST request with collegeId
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

Requirements:

```txt
Prevent duplicate saved colleges
Show saved state on card if possible
Allow remove from saved page
Show empty state if user has no saved colleges
```

---

# 28. Review Feature

Optional, but useful.

User can:

```txt
View reviews on college detail page
Add review after login
```

Review fields:

```txt
Rating
Title
Comment
Placement rating
Faculty rating
Campus rating
Value for money rating
```

APIs:

```txt
GET  /api/reviews/:collegeId
POST /api/reviews/:collegeId
```

Only logged-in users can submit reviews.

After adding a review, update:

```txt
College rating
Review count
```

---

# 29. Admin Feature

Optional after core features.

Admin can:

```txt
Add college
Edit college
Delete college
Add course
Edit course
Delete course
```

Admin pages:

```txt
/admin
/admin/colleges
/admin/colleges/new
/admin/colleges/:id/edit
```

Admin APIs must be protected by role middleware.

---

# 30. Validation

Use Zod.

## Auth Validation

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

## College Query Validation

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

## Review Validation

Validate:

```txt
rating between 1 and 5
comment required
title optional
```

---

# 31. Error Handling

Use centralized backend error middleware.

Handle:

```txt
Validation errors
Unauthorized errors
Forbidden errors
Not found errors
Duplicate saved college
Database errors
Unknown server errors
```

Frontend should show:

```txt
User-friendly toast
Error state component
No raw stack trace
```

---

# 32. Security

Backend:

```txt
Use Helmet
Use CORS with allowed client URL
Use HTTP-only cookies
Hash passwords with Argon2
Never return password in API response
Validate all incoming data
Protect private routes
Protect admin routes
Use environment variables
Do not commit .env
```

Frontend:

```txt
Do not store JWT in localStorage
Use withCredentials: true
Handle unauthorized response globally if possible
```

---

# 33. Performance

Backend:

```txt
Use pagination for college listing
Add Prisma indexes
Avoid fetching unnecessary data
Use select/include carefully
Limit compare to 3 colleges
```

Frontend:

```txt
Use TanStack Query caching
Debounce search input
Avoid unnecessary re-renders
Use skeleton loading
```

---

# 34. UI/UX Requirements

Design style:

```txt
Clean education-tech design
White background
Blue/indigo primary color
Soft gray sections
Rounded cards
Subtle shadows
Clear spacing
Fully responsive layout
```

Must have:

```txt
Mobile responsive layout
Filter sidebar collapses on mobile
Compare tray works on mobile
Buttons have disabled/loading states
Toast notifications
Empty states
Error states
Skeleton loaders
```

Avoid:

```txt
Too many animations
Complex UI before core features work
Hardcoded fake results in frontend
Unclear filter UX
Broken mobile layout
```

---

# 35. In-Depth User Workflows

## 35.1 Guest Discovery Workflow

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

## 35.2 Compare Workflow

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

## 35.3 Saved College Workflow

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

## 35.4 Login Workflow

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

## 35.5 Admin Workflow

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

# 36. Feature Acceptance Criteria

## College Listing

Must work:

```txt
Search by text
Filter by state
Filter by city
Filter by course
Filter by fees
Filter by rating
Sort by rating/fees/placement
Pagination
Loading/error/empty states
```

## College Detail

Must show:

```txt
College info
Courses
Placements
Fees
Reviews or review placeholder
Save button
Compare button
```

## Compare

Must support:

```txt
Add college
Remove college
Min 2, max 3 colleges
Side-by-side comparison
Best-value highlight
```

## Auth

Must support:

```txt
Register
Login
Logout
Get current user
Protected routes
```

## Saved Colleges

Must support:

```txt
Save
Remove
List saved colleges
Prevent duplicates
User-specific data only
```

---

# 37. Development Phases

Follow these phases strictly.

## Phase 1 — Repository Setup

```txt
Create monorepo
Create client using Vite React TypeScript
Create server using Express TypeScript
Add TailwindCSS
Add root README
```

## Phase 2 — Backend Foundation

```txt
Setup Express app
Setup CORS
Setup Helmet
Setup Morgan
Setup cookie parser
Setup error middleware
Setup Prisma
Connect PostgreSQL
```

## Phase 3 — Database

```txt
Create Prisma schema
Run migration
Create seed file
Seed 25–40 colleges
Test database with Prisma Studio
```

## Phase 4 — Auth APIs

```txt
Register
Login
Me
Logout
Auth middleware
Role middleware
```

## Phase 5 — College APIs

```txt
Get colleges with search/filter/sort/pagination
Get college by slug
Related colleges
```

## Phase 6 — Saved and Compare APIs

```txt
Save college
Get saved colleges
Remove saved college
Compare colleges
```

## Phase 7 — Frontend Layout

```txt
Navbar
Footer
Home page
Basic routing
API service setup
TanStack Query provider
Toast provider
```

## Phase 8 — College UI

```txt
College listing page
Search
Filters
Cards
Pagination
Detail page
```

## Phase 9 — Compare UI

```txt
Zustand compare store
Compare tray
Compare page
Compare table
Best-value highlight
```

## Phase 10 — Auth UI

```txt
Login page
Register page
Auth state
Protected route
Logout
```

## Phase 11 — Saved Colleges UI

```txt
Save button integration
Saved page
Remove saved college
Empty state
```

## Phase 12 — Optional Admin UI

Only after core features are complete.

## Phase 13 — Polish

```txt
Loading states
Empty states
Error states
Mobile responsive
README
Screenshots
Loom script
```

## Phase 14 — Deployment

```txt
Deploy frontend to Vercel
Deploy backend to Render/Railway
Deploy PostgreSQL to Neon/Supabase
Configure environment variables
Test production end-to-end
```

---

# 38. Edge Cases

## Search/Filter

```txt
No matching colleges
Invalid page number
Invalid fees range
Invalid rating value
Empty search query
```

## Compare

```txt
Less than 2 colleges selected
More than 3 colleges selected
Duplicate college selected
Invalid college ID in URL
```

## Auth

```txt
Email already registered
Wrong password
Expired token
Unauthorized saved route access
```

## Saved Colleges

```txt
Duplicate save attempt
Remove college that is not saved
User tries to save without login
```

## Backend

```txt
Database connection failure
Validation error
Unknown server error
```

---

# 39. README Requirements

README must include:

```txt
Project name
Project description
Selected track and role
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

## Tradeoffs Section

Use:

```txt
I used React with Vite for the frontend and Node.js with Express.js for the backend to build a clean separated full-stack architecture. The backend follows a REST API structure with routes, controllers, services, middleware, validation, Prisma ORM, and PostgreSQL.
```

---

# 40. Loom Video Script

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

Key lines:

```txt
I chose fewer features and implemented them deeply instead of building many incomplete features.

All college data comes from PostgreSQL through Express APIs using Prisma, not from hardcoded frontend data.

Search, filtering, sorting, and pagination are handled by the backend.

The comparison flow is handled with frontend state and backend structured data.

Saved colleges are user-specific and protected through JWT authentication.
```

---

# 41. Final Deliverables

Final submission must include:

```txt
Live frontend URL
Live backend API URL
GitHub repository URL
Loom video link
README with setup and architecture
```

---

# 42. Final Checklist

Verify before submission:

```txt
[ ] Home page works
[ ] College listing works
[ ] Search works
[ ] Filters work
[ ] Sorting works
[ ] Pagination works
[ ] College detail page works
[ ] Compare tray works
[ ] Compare page works
[ ] Register works
[ ] Login works
[ ] Logout works
[ ] Current user API works
[ ] Save college works
[ ] Saved colleges page works
[ ] Remove saved college works
[ ] Backend validation works
[ ] Error middleware works
[ ] PostgreSQL connected
[ ] Prisma schema migrated
[ ] Seed data added
[ ] Frontend deployed
[ ] Backend deployed
[ ] Production env variables configured
[ ] README completed
[ ] Loom video recorded
```

---

# 43. Future Improvements

Mention these:

```txt
College predictor based on exam and rank
Advanced recommendation engine
Admin analytics dashboard
User review moderation
College application tracking
Discussion/Q&A forum
Advanced comparison charts
Verified college dataset integration
```

---

# 44. Final Instruction to AI Coding Agent

Build the project step-by-step in this priority order:

```txt
1. Backend foundation
2. Database schema and seed
3. Auth APIs
4. College APIs
5. Saved and compare APIs
6. Frontend layout
7. College listing/detail UI
8. Compare UI
9. Auth UI
10. Saved colleges UI
11. Polish
12. Deployment
13. README and Loom notes
```

Do not skip the core features.

Do not overbuild optional features before the required MVP is complete.

The final project should feel like a clean, working, production-oriented full-stack MVP using:

```txt
React + Vite + TypeScript + TailwindCSS
Node.js + Express.js + TypeScript
PostgreSQL + Prisma ORM
```
