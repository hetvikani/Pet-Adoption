# 🐾 Pet Adoption Management System (React + NestJS)

A production-ready, full-stack **Pet Adoption Management System** built with **React (Vite + Tailwind CSS)**, **NestJS (TypeScript)**, and **MongoDB (Mongoose ODM)** with JWT Authentication & Role-Based Access Control (RBAC).

---

## 🚀 Features by Role

### 1. 🌐 Visitor (Public)
- **Browse Available Pets**: Public gallery of pets currently available for adoption.
- **Search**: Real-time debounce search by pet name or breed.
- **Filter**: Filter pets by **Species** (Dog, Cat, Rabbit, Bird), **Breed**, and **Age Range** (Min / Max years).
- **Pagination**: Smooth page navigation with page indicators.
- **Pet Details Page**: In-depth view featuring pet photos, age, gender, size, medical/vaccination records, and location.

### 2. 👤 Registered User
- **Authentication**: Secure sign-up and login with password hashing via `bcryptjs` and session tokens via `@nestjs/jwt` with Passport.
- **Adoption Applications**:
  - Interactive multi-field adoption application form (housing type, fenced yard status, other pets, prior animal experience, reason for adoption).
  - Validation prevents duplicate applications for the same pet.
  - Validation prevents applying for pets that are already `pending` or `adopted`.
- **User Dashboard**:
  - Track submitted adoption applications.
  - View real-time review status (`Pending Review`, `Approved`, `Rejected`).
  - Read personalized shelter notes/feedback.
- **In-App Notifications**: Real-time alert notifications when applications are approved or updated by the shelter.

### 3. 🛡️ Admin
- **Pet Inventory Management (CRUD)**:
  - **Create**: Add new pets with custom images/URLs, species, breed, age, size, gender, description, and fee.
  - **Edit**: Update pet bios, photos, and health status.
  - **Delete**: Remove pets from inventory (with cascading cleanup of related applications).
  - **Manual Status Control**: Switch pet status (`available`, `pending`, `adopted`) anytime.
- **Application Review Workflow**:
  - Inspect all applications across all pets with status filters (`all`, `pending`, `approved`, `rejected`).
  - View applicant housing details and reasons for adopting.
  - **One-Click Approval**: Approving an application **automatically marks the pet as `adopted`**, marks competing pending applications as rejected with explanation, and generates applicant notifications.
  - **One-Click Rejection**: Rejects application with custom feedback notes.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS v3, React Router v6, Axios, Lucide React |
| **Backend** | NestJS 10, TypeScript, Mongoose ODM, Passport JWT, Class Validator |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt.js, RBAC Guards |
| **API Docs** | OpenAPI 3.0 Specification (`backend-nestjs/swagger.json`) |

---

## 📋 Default Credentials

For quick testing, the database seed script generates pre-configured accounts:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@gmail.com` | `AdminPassword123!` |
| **User (Het Vikani)** | `het@gmail.com` | `UserPassword123!` |

*(A 1-click credential filler is also provided directly on the Login page!)*

---

## ⚡ Quick Start Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally on `mongodb://127.0.0.1:27017`

### 1. Backend Setup

```bash
cd backend-nestjs

# Install dependencies
npm install

# Create environment configuration (or copy .env.example)
copy .env.example .env

# Seed database with sample pets and demo accounts
npm run seed

# Start NestJS backend in development mode (runs on port 5000)
npm run start:dev
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server (runs on port 5173)
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## ⚙️ Environment Variables

### Backend (`backend-nestjs/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/pet_adoption
JWT_SECRET=super_secret_jwt_key_for_pet_adoption_2026_xyz!@#
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📖 REST API Reference

The complete OpenAPI specification is provided in [`backend-nestjs/swagger.json`](./backend-nestjs/swagger.json).

### Authentication
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Login & receive JWT token
- `GET /api/auth/me` — Get authenticated user details
- `PUT /api/auth/profile` — Update user profile

### Pets
- `GET /api/pets` — Get pets with search (`search`), filter (`species`, `breed`, `minAge`, `maxAge`, `status`), and pagination (`page`, `limit`)
- `GET /api/pets/:id` — Get single pet details
- `POST /api/pets` — Add new pet *(Admin only)*
- `PUT /api/pets/:id` — Update pet info *(Admin only)*
- `PATCH /api/pets/:id/status` — Update pet status manually *(Admin only)*
- `DELETE /api/pets/:id` — Delete pet *(Admin only)*

### Adoption Applications
- `POST /api/applications` — Submit application for an available pet *(User only)*
- `GET /api/applications/my` — Get authenticated user's submitted applications
- `GET /api/applications` — List all applications with filter *(Admin only)*
- `PATCH /api/applications/:id/status` — Approve or reject application *(Admin only)*

### Notifications
- `GET /api/notifications` — In-app notification updates
- `PATCH /api/notifications/:id/read` — Mark notification read
- `PATCH /api/notifications/mark-all-read` — Mark all read

