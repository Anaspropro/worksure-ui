<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

# WorkSure Project Priorities & Phases

---

## 🎯 Phase 1: Foundation & Authentication (Week 1–2)

**Priority: CRITICAL**

### Core Authentication

* Login/register with role selection (Client / Artisan / Admin)
* JWT authentication (HttpOnly cookies)
* Route protection middleware
* Form validation (React Hook Form + Zod)
* Artisan KYC submission system

---

## 🔐 Phase 2: Core User Workflows (Week 3–4)

**Priority: HIGH**

### KYC Verification System

* Document upload (ID, address proof, certifications)
* Status tracking (pending, approved, rejected)
* Admin review dashboard
* Manual + automated verification flow

---

### Homepage

* ui components

### Dashboards

#### Client Dashboard

* Active jobs
* Pending proposals
* Wallet balance
* Quick actions

#### Artisan Dashboard

* Available jobs
* Submitted proposals
* Active contracts
* Earnings summary
* KYC status

#### Admin Dashboard

* User management
* KYC review
* Dispute management
* System monitoring
* Analytics board

---

## 💼 Phase 3: Proposal & Contract System (Week 5–6)

**Priority: HIGH**

### Proposal Workflow

* Submit proposal (price, message, timeline)
* Client reviews proposals
* Accept/reject proposals

---

### Contract System

* Create contract from accepted proposal
* Contract status tracking
* Escrow funding
* Completion confirmation

---

## 💰 Phase 4: Payment & Wallet System (Week 7–8)

**Priority: HIGH**

### Wallet

* Balance display
* Deposit (Paystack)
* Withdraw (transfer)
* Transaction history

---

### Escrow System

* Lock funds into escrow
* Track escrow state
* Release payment
* Handle refunds
* Deduct platform fee

---

## 📸 Phase 5: Proof & Reviews (Week 9–10)

**Priority: MEDIUM**

### Proof of Work

* Upload images/videos
* Proof gallery

### Reviews

* Ratings (1–5)
* Comments
* Profile ratings

---

## 🔔 Phase 6: Enhanced UX (Week 11–12)

**Priority: MEDIUM**

* Notifications (toast + in-app)
* Messaging system (real-time chat)

---

## ⚖️ Phase 7: Advanced Features (Week 13–14)

**Priority: LOW**

* Dispute system
* Evidence upload
* Admin resolution tools

---

## 📱 Phase 8: Polish & Optimization (Week 15–16)

**Priority: LOW**

* Performance optimization
* Mobile responsiveness
* Testing & deployment

---

# 📋 MVP Definition (Phase 1–3)

* Authentication (roles)
* Job posting & browsing
* Proposal system
* Contract creation
* Escrow funding
* KYC verification

---

# 🔒 Business Rules

* Artisans MUST have approved KYC before:

  * submitting proposals
  * receiving payments

* Escrow must be funded before contract becomes ACTIVE

* Payment release requires:

  * client confirmation
  * artisan confirmation

* All financial operations must use database transactions

---

# 🏗️ Database Schema (Updated)

```sql
users {
  id: UUID (PK)
  email: VARCHAR (UNIQUE)
  password_hash: VARCHAR
  role: ENUM (client, artisan, admin)
  kyc_status: ENUM (not_submitted, pending, approved, rejected)
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}

kyc_documents {
  id: UUID (PK)
  user_id: UUID (FK)
  document_type: ENUM (id, address, certificate)
  document_url: VARCHAR
  status: ENUM (pending, verified, rejected)
  reviewed_by: UUID
  created_at: TIMESTAMP
}

jobs {
  id: UUID (PK)
  client_id: UUID (FK)
  title: VARCHAR
  description: TEXT
  budget: DECIMAL
  status: ENUM (draft, active, completed, cancelled)
  created_at: TIMESTAMP
}

proposals {
  id: UUID (PK)
  job_id: UUID
  artisan_id: UUID
  price: DECIMAL
  message: TEXT
  status: ENUM (pending, accepted, rejected)
}

contracts {
  id: UUID (PK)
  job_id: UUID
  client_id: UUID
  artisan_id: UUID
  escrow_amount: DECIMAL
  status: ENUM (pending, active, completed, disputed)
  client_confirmed: BOOLEAN
  artisan_confirmed: BOOLEAN
}

wallets {
  id: UUID (PK)
  user_id: UUID (nullable for platform)
  balance: DECIMAL
}

transactions {
  id: UUID (PK)
  wallet_id: UUID
  amount: DECIMAL
  type: ENUM (deposit, withdrawal, escrow, release, refund, fee)
  status: ENUM (pending, completed, failed)
  reference_id: UUID
  provider_reference: VARCHAR
  created_at: TIMESTAMP
}
```

<!-- END:nextjs-agent-rules -->
