# Allo Health Inventory Reservation System

A full-stack inventory reservation system built using Next.js, Prisma, TypeScript, Tailwind CSS, and NextAuth.

This project allows users to manage inventory across warehouses, reserve products, confirm purchases, cancel reservations, and automatically release expired reservations.

---

# Tech Stack

- Next.js 15
- TypeScript
- Prisma ORM
- PostgreSQL / SQLite
- Tailwind CSS
- NextAuth
- React Hot Toast
- Lucide Icons

---

# Features

## Inventory Management

- Add products
- Update products
- Delete products
- Search inventory
- Warehouse-wise stock management
- Low stock warning system

---

## Reservation System

- Reserve inventory items
- Prevent overselling
- Warehouse-specific reservations
- Live stock updates
- Reservation persistence using localStorage

---

## Checkout Flow

- Reservation checkout page
- Live countdown timer
- Confirm purchase functionality
- Cancel reservation functionality
- Automatic redirect after actions

---

## Error Handling

### 409 Conflict
Displayed when:
- requested stock exceeds available inventory

### 410 Gone
Displayed when:
- reservation expires before confirmation

### 500 Internal Server Error
Handled gracefully with frontend toast notifications

---

# Reservation Expiry Strategy

This project uses lazy cleanup logic for reservation expiry.

Reservations contain an `expiresAt` timestamp.

When:
- reservation expires,
- reservation is cancelled,
- or purchase is confirmed,

the inventory `reservedUnits` are automatically updated.

The checkout page continuously checks reservation validity using a live countdown timer and automatically redirects users after expiration.

This prevents overselling while avoiding the need for background workers or cron jobs.

---

# Project Structure

```txt
app/
 ├── api/
 │    ├── inventory/
 │    ├── reservations/
 │    └── warehouse/
 │
 ├── checkout/
 │    └── page.tsx
 │
 └── page.tsx

components/
 ├── Navbar.tsx
 └── Sidebar.tsx

prisma/
 └── schema.prisma
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/Manasdas10/Inventory-system.git
```

---

## Navigate to Project

```bash
cd Inventory-system
```

---

## Install Dependencies

```bash
npm install
```

---

# Environment Variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://postgres.ulwwupugnubbsbxnicrf:Manasd9870411@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

NEXTAUTH_SECRET="allohealthsupersecret"

NEXTAUTH_SECRET="allohealthsupersecret"

```

---

# Prisma Setup

```bash
npx prisma generate
```

```bash
npx prisma db push
```

---

# Run Development Server

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

# API Endpoints

## Inventory

| Method | Endpoint |
|--------|----------|
| GET | `/api/inventory` |
| POST | `/api/inventory` |
| PUT | `/api/inventory/:id` |
| DELETE | `/api/inventory/:id` |

---

## Reservations

| Method | Endpoint |
|--------|----------|
| POST | `/api/reservations` |
| POST | `/api/reservations/[id]/confirm` |
| POST | `/api/reservations/[id]/release` |

---

# Frontend Pages

| Page | Description |
|------|-------------|
| `/` | Inventory listing page |
| `/checkout` | Reservation checkout page |

---

# Reservation Flow

```txt
Inventory Page
      ↓
Reserve Product
      ↓
Checkout Page
      ↓
Confirm / Cancel / Expire
      ↓
Inventory Updates Automatically
```

---

# Deployment

The project can be deployed on:

- Vercel
- Render
- Railway

---

# GitHub Repository

https://github.com/Manasdas10/Inventory-system

---

# Author

## Manas Das

Built as part of an inventory reservation system assignment.
