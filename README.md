<div align="center">
  <div style="background-color: #4F46E5; padding: 10px; border-radius: 12px; display: inline-block; margin-bottom: 20px;">
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  </div>
  
  <h1>🎓 CampusCompare</h1>
  <p><strong>A Modern, High-Performance Platform for Discovering and Comparing Colleges</strong></p>

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#environment-variables">Environment Variables</a> •
    <a href="#api-endpoints">API Endpoints</a>
  </p>
</div>

---

## 📖 Overview

**CampusCompare** is a comprehensive full-stack web application designed to help students discover, evaluate, and compare higher education institutions. With a beautifully animated, responsive UI and a robust, secure backend, the platform provides everything from deep college insights and student reviews to an intuitive side-by-side comparison tool.

## ✨ Features

### For Students
- **Smart Search & Filtering:** Filter colleges by state, city, fees, rating, courses, and institution type.
- **Side-by-Side Comparison:** Select up to 3 colleges and compare their fees, placements, ratings, and facilities in a clean table view.
- **Save & Shortlist:** Click the heart icon to save colleges to your personalized dashboard for later viewing.
- **Reviews & Ratings:** Read detailed reviews left by alumni and students, covering placements, campus life, faculty, and value for money.

### For Administrators
- **Admin Dashboard:** Secure portal to manage the database of colleges.
- **CRUD Operations:** Create, update, and delete colleges and their respective courses.
- **Cloudinary Integration:** Upload and manage college campus imagery directly from the admin panel.

### Security & UX
- **Secure Authentication:** JWT-based HTTP-only cookies with Argon2 password hashing.
- **Rate Limiting & XSS Protection:** Hardened backend APIs to prevent spam and cross-site attacks.
- **Framer Motion UI:** Buttery-smooth page transitions, animated drawers, and micro-interactions for a premium feel.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework:** React 18 with TypeScript (Bootstrapped via Vite)
- **Styling:** TailwindCSS + Custom Design Tokens (Glassmorphism, smooth radiuses)
- **State Management:** Zustand (Local state) & TanStack React Query (Server state)
- **Routing:** React Router v6
- **Animations:** Framer Motion
- **Icons:** Lucide React

### Backend (Server)
- **Runtime:** Node.js with Express.js (TypeScript)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod
- **Authentication:** JSON Web Tokens (JWT) & Argon2
- **File Uploads:** Multer & Cloudinary

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **PostgreSQL** database running locally or on the cloud
- **Cloudinary** account (for image uploads)

### 2. Installation

Clone the repository and install dependencies for both the frontend and backend.

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Environment Variables

Create `.env` files in both the `client` and `server` directories based on the templates below.

#### Backend (`server/.env`)
```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/campuscompare?schema=public"

# Authentication
JWT_SECRET="your_super_secret_jwt_key_here"
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

#### Frontend (`client/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Database Setup

Navigate to the `server` directory and run the Prisma commands to construct the database schema and populate it with initial data.

```bash
cd server

# Generate Prisma Client
npx prisma generate

# Run migrations to build the tables
npx prisma migrate dev --name init

# Seed the database with 28 premium placeholder colleges
npm run prisma:seed
```

### 5. Run the Application

You'll need two terminal windows to run the frontend and backend concurrently.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 📁 Project Structure

```
CampusCompare/
├── client/                     # React Frontend
│   ├── public/                 # Static assets
│   └── src/
│       ├── components/         # Reusable UI elements & layouts
│       ├── hooks/              # Custom React Query & Auth hooks
│       ├── pages/              # Route-level components
│       ├── services/           # Axios API services
│       ├── stores/             # Zustand state management
│       ├── types/              # TypeScript interfaces
│       └── utils/              # Helper formatting functions
│
└── server/                     # Express Backend
    ├── prisma/                 # Database schema & seed scripts
    └── src/
        ├── config/             # Cloudinary, Env, Prisma configurations
        ├── controllers/        # Route logic handlers
        ├── middlewares/        # Auth, Validation, Error Handling
        ├── routes/             # API route definitions
        ├── services/           # Core business logic & DB queries
        ├── types/              # Express overrides & custom types
        └── utils/              # Token generation, Responses, Slugifiers
```

---

## 🔒 Security Implementations

- **Password Hashing:** Argon2 is used over bcrypt for memory-hard, highly secure password hashing.
- **Cookie Hardening:** JWTs are delivered exclusively via `httpOnly`, `SameSite=Strict` cookies. Tokens are inaccessible to client-side JS.
- **Input Validation:** Every single incoming request payload is strictly validated using Zod schemas before hitting the controllers.
- **Rate Limiting:** IP-based rate limiting is applied globally to prevent brute-force and Denial of Service (DoS) attacks.
- **Helmet:** HTTP response headers are hardened to restrict Cross-Origin Resource Sharing (CORS) exploits.

---
*Built with ❤️ for students, by students.*
