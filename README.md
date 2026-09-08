# OfficeBase UAE - E-Commerce Web Application

A full-stack commercial e-commerce platform replicating the furniture shopping, custom cart, checkout, and order experience of OfficeBase UAE.

---

## 🚀 Key Feature Implementations

- **Catalog & Mega-Menu Navigation**:
  - Categorized furniture collections (Chairs, Desks, Storage, Acoustic Solutions, Pantries, Meeting Spaces).
  - Multi-tier navigation with desktop hover states and touch-optimized mobile drawer.

- **Product Discovery & Variant Selection**:
  - Dynamic dimension variants with automatic price updates.
  - Multi-angle product imagery gallery, SKU tracking, specifications, warranty, and delivery information.

- **Client-Side Cart Management**:
  - Persistent React Context state across page reloads.
  - Interactive slide-over cart drawer with real-time VAT (5%) and AED currency formatting.

- **Checkout Pipeline**:
  - Full shipping address collection across UAE Emirates with validation.
  - Custom delivery notes and itemized cost breakdown.

- **Payment Gateway Integration**:
  - Foloosi Payment Modal replica supporting Card, Net Banking, and simulated verification.

- **Order Tracking & Confirmation**:
  - Order confirmation summary displaying unique identifier (`OB-YYYYMMDD-XXXXX`), customer details, and ordered items.

---

## 📂 Repository Structure

```text
uae/
├── frontend/                     # React SPA Client
│   ├── public/                   # Static assets, brand logos, favicons
│   ├── src/
│   │   ├── components/
│   │   │   ├── checkout/         # Checkout, Order Confirmation, Payment Modal
│   │   │   ├── common/           # Header, Footer, Navigation, Offcanvas Drawer
│   │   │   ├── home/             # Hero Slider, Categories Grid, Featured Products
│   │   │   └── product/          # Product Detail, Image Gallery, Specifications
│   │   ├── context/              # Cart Context & Global State Management
│   │   ├── services/             # API Client
│   │   ├── styles/               # CSS Stylesheets
│   │   ├── App.jsx               # Application Router
│   │   └── main.jsx              # React Entrypoint
│   ├── index.html                # HTML5 Template
│   ├── package.json              # Dependencies
│   └── vite.config.js            # Vite Configuration
│
├── backend/                      # PHP Backend & Database
│   ├── api/                      # REST API Router (`index.php`)
│   ├── config/                   # Database Connection Pooling (`Database.php`)
│   ├── controllers/              # Controllers (`Order`, `Product`, `Category`)
│   └── database/                 # Relational Data
│       ├── schema.sql            # MySQL Schema
│       └── seed.php              # Category & Product Seeder
│
├── .gitignore                    # Git Exclusion Rules
└── README.md                     # Documentation
```

---

## 🛠 Local Setup

### 1. Database
Create a MySQL database and import the schema:
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS officebase_db;"
mysql -u root -p officebase_db < backend/database/schema.sql
php backend/database/seed.php
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

The application will be running at `http://localhost:5173`.
