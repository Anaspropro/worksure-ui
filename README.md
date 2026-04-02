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

## Frontend Roadmap

Here’s the implementation plan I’d use for worksure-ui, including the landing page as part of the real product surface rather than an afterthought.

Phase 1: Foundation and Auth
Goal: turn the app from a single demo screen into a real routed frontend.

Files to introduce or refactor:

src/app/page.tsx
src/app/layout.tsx
src/proxy.ts
src/hooks/useAuth.ts
src/types/index.ts
Work:

fix register so it signs users in immediately
make logout call backend logout before clearing local state
normalize auth response shapes
add route-aware auth helpers
prepare shared layout, navigation, and protected-page guards
Phase 2: Landing Page Design
Goal: replace the current dashboard-on-homepage with a real public marketing page.

Files to create:

src/app/page.tsx
src/components/landing/*
optional src/components/layout/site-header.tsx
optional src/components/layout/site-footer.tsx
Landing page sections:

hero with trust-focused value proposition
“how it works” for client and artisan flows
escrow and safety section
social proof / metrics strip
CTA section for signup and job browsing
FAQ / trust reassurance
Design direction I’d recommend:

warm, trustworthy, service-marketplace feel
earthy or civic palette, not generic SaaS purple
strong type hierarchy and slightly editorial layout
clear split between public brand surface and app workspace
Phase 3: Route Structure
Goal: align the app with the repo docs and backend routes.

Pages to create:

src/app/auth/login/page.tsx
src/app/auth/register/page.tsx
src/app/dashboard/client/page.tsx
src/app/dashboard/artisan/page.tsx
src/app/dashboard/admin/page.tsx
src/app/jobs/page.tsx
src/app/jobs/create/page.tsx
src/app/contracts/[contractId]/page.tsx
src/app/wallet/page.tsx
src/app/profile/page.tsx
src/app/reviews/page.tsx
src/app/kyc/submit/page.tsx
src/app/kyc/status/page.tsx
Work:

add route-level layouts
redirect users to the correct dashboard by role
wire middleware/protection to pages that actually exist
Phase 4: Shared App Shell
Goal: create a consistent authenticated experience.

Components to build:

app sidebar / top nav
role badge and account menu
loading, empty, and error states
reusable cards for jobs, proposals, contracts, wallet items
status badges for escrow, KYC, proposal, and contract state
Likely files:

src/components/app-shell/*
src/components/features/*
src/components/ui/* extensions
Phase 5: Client Experience
Goal: implement the actual client workflow.

Pages/features:

client dashboard
create/manage jobs
review incoming proposals
accept/reject proposals
create/fund contracts
confirm completion
release escrow
leave reviews
Key hook refactors:

src/hooks/useJobs.ts
src/hooks/useProposals.ts
src/hooks/useContracts.ts
Important fix:

proposals must be fetched by role and context, not always by artisanId
Phase 6: Artisan Experience
Goal: implement the artisan journey the product promises.

Pages/features:

artisan dashboard
browse open jobs
submit and manage proposals
KYC/verification visibility
active contracts
completion confirmation
earnings/payout visibility
Additional hooks likely needed:

useArtisanProfile
useKyc
useWallet
useNotifications
Phase 7: Admin Experience
Goal: give admins real operational tools.

Pages/features:

admin dashboard
user management
KYC review
dispute review/resolution
platform summaries
This should map to backend admin/dispute endpoints rather than reusing client screens.

Phase 8: Wallet, KYC, Reviews, Notifications
Goal: fill the missing trust-critical product surfaces.

New features:

wallet balance and transaction history
deposit/add funds UI
KYC submission/status
review listing and creation
in-app notifications/toasts
This is where the frontend starts to feel like the actual marketplace rather than a workflow console.

Phase 9: Data Layer Cleanup
Goal: make frontend/backend integration reliable.

Work:

centralize API response parsing
align all hooks to backend response shapes
add typed request/response models
remove optimistic assumptions in current hooks
improve loading/error handling per page
Most important current mismatch:

several hooks assume direct entity returns where backend often returns { data, message }
Phase 10: Polish and Confidence
Goal: make it shippable.

Work:

responsive QA across mobile and desktop
skeleton/loading states
accessibility pass
empty-state UX
smoke tests for auth and main flows
doc update so frontend status matches reality
Implementation Order I Recommend

Landing page + auth pages
auth/session cleanup
route structure and shared app shell
client dashboard and client flow
artisan dashboard and KYC
admin dashboard
wallet/reviews/notifications
cleanup and QA
