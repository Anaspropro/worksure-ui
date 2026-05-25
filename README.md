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
* Node.js ≥ 18
* Backend server running locally (or deployed)

### Install Dependencies
```bash
npm install
```

### Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```
*(Never commit `.env` files. Secret scanning runs in CI with Gitleaks.)*

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

---

## 🎯 UI/UX Principles

* **Clean and minimal**: Focus on the task at hand.
* **Mobile-first**: Fully responsive design.
* **Trust-focused**: Clear status badges, escrow safety explanations.
* **Feedback-driven**: Toast alerts and loading skeletons for all actions.
