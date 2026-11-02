# 🎨 WorkSure — Frontend

WorkSure is a web platform connecting **clients** with **artisans**, enabling job posting, bidding, escrow-based payments, and secure job completion. This repository contains the frontend application.

---

## 📌 Overview

The frontend handles:
* User interaction and responsive UI
* Complex state management
* API communication with the WorkSure Backend
* Secure authentication and route protection

---

## 🧱 Tech Stack

* **Framework**: Next.js (App Router)
* **Language**: TypeScript
* **Styling**: Tailwind CSS + ShadCN UI components
* **Data Fetching**: React Query (Tanstack query) + Fetch API
* **Forms**: React Hook Form + Zod validation
* **Authentication**: JWT via HttpOnly cookies

---

## 👤 User Roles

### Client
* Post jobs and review proposals
* Fund escrow for accepted contracts
* Confirm completion and leave reviews

### Artisan
* Browse open jobs and submit proposals
* Complete jobs and upload proof of work
* Receive secure payouts

### Admin
* Manage users and review KYC submissions
* Resolve disputes fairly

---

## 🧭 Project Structure

```
/src
  /app
    /auth         # Login, Register
    /dashboard    # Client, Artisan, Admin dashboards
    /jobs         # Job browsing, creation, details
    /contracts    # Escrow and contract management
    /wallet       # Balances and transactions
    /profile      # User profiles
    /kyc          # Verification
  /components
    /ui           # Reusable ShadCN components
    /forms        # Form components
    /layout       # Shared layouts (navbar, sidebar)
  /hooks          # Custom React Query hooks
```

---

## ⚙️ Quick Start

### Prerequisites
* Node.js ≥ 22
* Backend server running locally (or deployed)

### Install Dependencies
```bash
npm install
```

### Environment Variables
Create a `.env.local` file:
```env
# Backend server URL for server-side Next.js BFF proxy
API_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000
```
*(Never commit `.env` or `.env.local` files. Secret scanning runs in CI with Gitleaks.)*

### Backend-for-Frontend (BFF) Proxy Architecture
Client-side components make API requests to `/api/proxy/...` on the Next.js server. The Next.js BFF proxy handler (`src/app/api/proxy/[...path]/route.ts`):
- Reads the secure `HttpOnly` JWT cookie (`token`) and injects it as an `Authorization: Bearer <token>` header to the upstream backend.
- Prevents JavaScript token access (XSS mitigation).
- Sets `HttpOnly`, `SameSite=Lax`, and `Secure` cookies on authentication endpoints (`auth/login`, `auth/register`, `auth/logout`).
- Enforces an upstream payload limit of 3MB.

### Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📱 Core Features

* **Authentication**: JWT-based auth with secure HttpOnly cookies, route protection via `middleware.ts`.
* **Job & Proposal System**: Clients post jobs; Artisans bid.
* **Contracts & Escrow**: Secure funding via Paystack integration (managed by backend).
* **Wallet**: View balances, deposit, and withdraw funds.
* **KYC System**: Document submission and verification tracking.
* **Reviews & Proof of Work**: Upload images/videos, rate users.
* **Admin Operations Center**: Comprehensive dashboard for platform health, dispute resolution, and auditing.
* **Network Resilience**: Real-time offline indicators with cached data fallback.

---

## 🎯 UI/UX Principles

* **Clean and minimal**: Focus on the task at hand with flat modern design.
* **Mobile-first**: Fully responsive design with optimized mobile rendering.
* **Trust-focused**: Clear status badges, escrow safety explanations, and branding.
* **Feedback-driven**: Toast alerts, loading skeletons, and interactive state visuals.
