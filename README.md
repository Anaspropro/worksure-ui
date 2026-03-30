# 🎨 Frontend Engineering Specification

## Project: WorkSure (Escrow-Based Artisan Marketplace)

---

## 1. 📌 Overview

WorkSure is a web platform connecting **clients** with **artisans**, enabling job posting, bidding, escrow-based payments, and secure job completion.

The frontend handles:

* User interaction
* UI state management
* API communication
* Display of system data

---

## 2. 🧱 Tech Stack

* Next.js (App Router)
* TypeScript
* Tailwind CSS + ShadCN
* React Query
* React Hook Form + Zod
* Fetch API
* JWT (HttpOnly cookies)

---

## 3. 👤 User Roles

### Client

* Post jobs
* Review proposals
* Fund escrow
* Confirm completion

### Artisan

* Browse jobs
* Submit proposals
* Complete jobs
* Receive payment

### Admin

* Manage users
* Review KYC
* Resolve disputes

---

## 4. 🧭 Routing Structure

```
/app
  /home
    /about
    /contact
    /faq

  /auth
    /login
    /register

  /dashboard
    /client
    /artisan
    /admin

  /jobs
    /create
    /[jobId]

  /contracts
    /[contractId]

  /wallet
  /profile
  /reviews

  /kyc
    /submit
    /status
```

---

## 5. 📱 Core Features

### Authentication

* Login / Register
* Role selection
* Form validation

---

### Dashboard

* Client: jobs, proposals, wallet
* Artisan: jobs, contracts, earnings
* Admin: users, disputes, KYC

---

### Job Management

* Create job
* View jobs
* Filter jobs

---

### Proposal System

* Submit proposal
* Accept/reject proposals

---

### Contracts

* View contract details
* Fund escrow
* Confirm completion

---

### Wallet System

* View balance
* Deposit funds
* Withdraw funds
* Transaction history

---

### KYC System

* Submit documents
* Track verification status
* Display rejection feedback

---

### Proof of Work

* Upload images/videos
* View submitted proof

---

### Reviews

* Rate users
* Leave comments

---

### Notifications

* Toast alerts
* In-app notifications

---

## 6. 🔄 User Flows

### Client Flow

1. Register/Login
2. Create job
3. Receive proposals
4. Accept proposal
5. Fund escrow
6. Confirm completion
7. Leave review

---

### Artisan Flow

1. Register/Login
2. Submit KYC
3. Browse jobs
4. Submit proposal
5. Complete job
6. Upload proof
7. Confirm completion
8. Receive payment

---

## 7. ⚙️ State Management

### React Query

* Jobs
* Proposals
* Contracts
* Wallet

---

## 8. 📡 API Endpoints

```
POST /auth/login
POST /auth/register

GET /jobs
POST /jobs

POST /proposals

POST /contracts

POST /wallet/deposit
POST /wallet/withdraw

POST /escrow/fund
POST /escrow/release
```

---

## 9. 🎯 UI/UX Principles

* Clean and minimal
* Mobile-first
* Trust-focused
* Clear feedback states

---

## 10. 🔒 Security

* HttpOnly cookies for auth
* Route protection
* Input validation

---

## 11. 🧩 Components

```
/components
  /ui
  /forms
  /layout 
  /features
```

---

## 12. 🚀 Performance

* Lazy loading
* Image optimization
* Avoid re-renders

---

## 🎯 End Goal

Deliver a secure, user-friendly platform that:

* Builds trust
* Ensures safe payments
* Enables smooth interaction between clients and artisans
