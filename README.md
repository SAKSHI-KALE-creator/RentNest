# 🏠 RentNest India - House Rental Web Application

> A powerful, modern, and user-centric house rental platform designed specifically for the **Indian real estate market** across major metropolitan hubs (Bengaluru, Mumbai, Delhi-NCR, Gurgaon, Hyderabad, Pune, and Chennai).

Built with the **MERN Stack** (MongoDB, Express.js, React.js, and Node.js) styled with **Bootstrap 5**, **Bootstrap Icons**, and custom CSS. Features role-based access control (Renter, Landlord, Admin), real-time search & filters, visit scheduling, rental applications, and admin moderation.

---

## 🌟 Key Features

### 🇮🇳 1. Built Exclusively for India
- **Indian Pricing & Currency:** Displayed in Indian Rupees (`₹`), with compact lakhs (`₹1.85 L`) and thousand (`₹38k`) formatting.
- **Indian Property Types & Layouts:** 1 RK, 1 BHK, 2 BHK, 3 BHK, 4 BHK, Penthouses, Builder Floors, Independent Villas, and PG/Co-Living spaces.
- **Top Indian Metros:** Bengaluru (Indiranagar, Whitefield, HSR Layout), Mumbai (Bandra, Powai), Delhi (South Ex), Gurgaon (Golf Course Road), Hyderabad (Gachibowli), Pune (Koregaon Park, Hinjewadi).
- **Indian Tenancy Tools:** 11-Month Rental Agreement guide, HRA tax exemption tips, Model Tenancy Act compliance, and 30% salary-based rent affordability calculator.

### 👥 2. Role-Based Portals & Dashboards
- **Renter / Tenant Portal:**
  - Search & filter by City, BHK, Budget slider, Furnishing, Preferred Tenants, and Amenities.
  - Interactive **Schedule Visit** and **Apply to Rent** booking workflows.
  - Track visit statuses (`Pending`, `Confirmed`, `Completed`, `Cancelled`) with landlord notes.
  - Submit verified reviews and star ratings.
- **Landlord / Property Owner Portal:**
  - Post free listings with specs, deposit terms, photos, and amenities.
  - Edit or delete listings.
  - Review tenant visit requests and rental applications.
  - Confirm or reject requests with customized instructions.
- **Admin Moderation Portal:**
  - KPI Dashboard (total listings, pending approvals, total users, bookings).
  - Moderation queue: One-click **Approve** or **Reject** owner listings before they go public.
  - User Directory: Manage roles (promote to Owner/Admin) and delete users.
  - Platform-wide bookings monitor.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 19, React Router v7, Axios, Bootstrap 5, Bootstrap Icons, Vite |
| **Backend** | Node.js, Express.js 5, JSON Web Tokens (JWT), Bcrypt.js, CORS, Morgan, Dotenv |
| **Database** | MongoDB with Mongoose ODM (Indexes, text search, schemas, aggregations) |
| **Data Scope** | 100% Indian Real Estate Data |

---

## 🚀 Quick Start Guide

### Prerequisites
1. **Node.js** (v18 or higher)
2. **MongoDB** running locally on port `27017` (e.g., `mongodb://127.0.0.1:27017`)

### 1. Installation

Both backend and frontend dependencies are installed in their respective directories:

```bash
# In backend
cd backend
npm install

# In frontend
cd ../frontend
npm install
```

### 2. Configure Environment (`backend/.env`)

A default `.env` is already configured:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/rentnest_db
JWT_SECRET=rentnest_super_secret_jwt_key_2026_india_realestate
NODE_ENV=development
```

### 3. Seed Database with Indian Real Estate Data

Populate pre-configured Indian properties, reviews, and test accounts:
```bash
npm run seed
# or
cd backend && npm run seed
```

### 4. Run the Application

You can run the full-stack app in either of two modes:

#### Option A: Unified Production Build (Single Port `5000`)
```bash
npm run build   # Builds React frontend to frontend/dist
npm start       # Starts Express which serves both API and React frontend on http://localhost:5000
```
Open your browser at **[http://localhost:5000](http://localhost:5000)**.

#### Option B: Independent Development Servers (Hot Reload)
```bash
# Terminal 1 - Backend API:
cd backend
npm run dev     # Runs on http://localhost:5000

# Terminal 2 - Frontend Vite:
cd frontend
npm run dev     # Runs on http://localhost:3000 (proxies /api to 5000)
```

---

## 🔑 Demo Login Accounts

| Role | Email Address | Password | Privileges |
|---|---|---|---|
| **Admin** | `admin@rentnest.in` | `Admin@123` | Moderate listings, manage users, view all metrics |
| **Landlord 1** | `rajesh.sharma@rentnest.in` | `Owner@123` | Post listings in Bengaluru/Mumbai, review visits |
| **Landlord 2** | `priya.nair@rentnest.in` | `Owner@123` | Post listings in Gurgaon/Hyderabad/Pune |
| **Tenant 1** | `arjun.verma@rentnest.in` | `User@123` | Schedule visits, submit applications, write reviews |
| **Tenant 2** | `sneha.patel@rentnest.in` | `User@123` | Search properties, apply to rent |

*Note: The Login page includes one-click demo login buttons for instant testing.*

---

## 📡 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` - Create new tenant or landlord account
- `POST /api/auth/login` - Authenticate with email/password & get JWT
- `GET /api/auth/me` - Get profile and user statistics (Protected)
- `PUT /api/auth/profile` - Update profile & contact information (Protected)
- `PUT /api/auth/change-password` - Update account password (Protected)

### 🏡 Properties (`/api/properties`)
- `GET /api/properties` - Filter properties by city, bhk, rent, amenities, sorting, pagination
- `GET /api/properties/featured` - Get top featured homes for homepage
- `GET /api/properties/cities-summary` - Summary of properties per Indian city
- `GET /api/properties/:id` - Single property details, owner info, and reviews
- `POST /api/properties` - Post listing (Owner/Admin only, defaults to pending moderation)
- `PUT /api/properties/:id` - Edit listing (Owner/Admin only)
- `DELETE /api/properties/:id` - Delete listing (Owner/Admin only)
- `GET /api/properties/my/listings` - Get current landlord's listings (Protected)

### 📅 Bookings & Visits (`/api/bookings`)
- `POST /api/bookings` - Submit visit request or rental application (Protected)
- `GET /api/bookings/my-bookings` - Tenant view of their requests (Protected)
- `GET /api/bookings/owner-requests` - Landlord view of received inquiries (Protected)
- `PUT /api/bookings/:id/status` - Landlord confirm or reject booking (Protected)
- `PUT /api/bookings/:id/cancel` - Tenant cancel request (Protected)

### ⭐ Reviews (`/api/reviews`)
- `GET /api/reviews/:propertyId` - Get verified reviews for a property
- `POST /api/reviews/:propertyId` - Post a rating and review (Protected)

### 🛡️ Admin Moderation (`/api/admin`)
- `GET /api/admin/dashboard` - Platform KPI analytics
- `GET /api/admin/properties` - Moderation queue of all properties
- `PUT /api/admin/properties/:id/status` - Set status to `approved` or `rejected`
- `GET /api/admin/users` - Directory of all users
- `PUT /api/admin/users/:id/role` - Update user role (`user`, `owner`, `admin`)
- `DELETE /api/admin/users/:id` - Remove user
- `GET /api/admin/bookings` - System-wide bookings monitor

---

## 📁 Project Directory Structure

```
RentNest_Project/
├── package.json               # Root scripts (start, seed, server, client, build)
├── README.md                  # Comprehensive Documentation
├── backend/
│   ├── .env                   # Database URI, JWT Secret, Port
│   ├── package.json           # Express, Mongoose, JWT, Bcryptjs, Cors
│   ├── server.js              # Express server setup & static serving
│   ├── seed.js                # Indian real estate database seeder
│   ├── config/
│   │   └── db.js              # MongoDB Mongoose connection
│   ├── models/
│   │   ├── User.js            # User model with bcrypt password hashing
│   │   ├── Property.js        # Property model with Indian address & specs
│   │   ├── Booking.js         # Visit scheduling & rental applications
│   │   └── Review.js          # Verified tenant reviews
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT protect and role authorization
│   │   └── errorMiddleware.js # Centralized 404 & error handlers
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── propertyController.js
│   │   ├── bookingController.js
│   │   ├── reviewController.js
│   │   └── adminController.js
│   └── routes/
│       ├── authRoutes.js
│       ├── propertyRoutes.js
│       ├── bookingRoutes.js
│       ├── reviewRoutes.js
│       └── adminRoutes.js
└── frontend/
    ├── package.json           # React 19, Bootstrap 5, Axios, React Router
    ├── vite.config.js         # Vite configuration with proxy to port 5000
    ├── index.html             # Plus Jakarta Sans font & SEO meta tags
    └── src/
        ├── main.jsx           # Entry point with Bootstrap bundle
        ├── App.jsx            # Router and role-based routes
        ├── index.css          # Color system, glassmorphism, card hover styles
        ├── context/
        │   └── AuthContext.jsx# Authentication state, login, register, logout
        ├── services/
        │   └── api.js         # Axios instance with JWT interceptors
        ├── utils/
        │   └── formatters.js  # Indian Rupee formatter, cities list, BHKs
        ├── components/
        │   ├── Navbar.jsx     # Navigation, city picker, user menu
        │   ├── Footer.jsx     # Indian cities links, RERA disclaimer
        │   ├── PropertyCard.jsx # Property card with badges and pricing
        │   ├── FilterBar.jsx  # Interactive search, price, amenity filters
        │   ├── RentCalculator.jsx # 30% salary affordability calculator
        │   └── ProtectedRoute.jsx # Role-aware route guard
        └── pages/
            ├── HomePage.jsx   # Hero search, city tiles, featured homes
            ├── PropertiesPage.jsx # Exploration grid with sorting & pagination
            ├── PropertyDetailsPage.jsx # Image gallery, booking form, reviews
            ├── PostPropertyPage.jsx # Add/Edit listing form
            ├── UserDashboardPage.jsx # Tenant scheduled visits & profile
            ├── OwnerDashboardPage.jsx # Landlord listings & inquiries
            ├── AdminDashboardPage.jsx # Moderation queue & user directory
            ├── CalculatorPage.jsx # Indian tenancy rules & budget tool
            ├── LoginPage.jsx  # Sign-in with quick test buttons
            ├── RegisterPage.jsx # Sign-up with role selection
            └── NotFoundPage.jsx # 404 handler
```

---

## ⚖️ Indian Real Estate Regulatory Compliance
- Compliant with guidelines of the **Model Tenancy Act (MTA)**.
- Adheres to standard 11-month residential lease protocols.
- Includes Indian TDS threshold warnings for rents over ₹50,000/month.
