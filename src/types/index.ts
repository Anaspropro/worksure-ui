export type UserRole = "CLIENT" | "ARTISAN" | "ADMIN";

export type JobStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "DISPUTED";

export type ProposalStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN";

export type ContractStatus =
  | "DRAFT"
  | "PENDING_PAYMENT"
  | "FUNDED"
  | "ACTIVE"
  | "IN_PROGRESS"
  | "CLIENT_CONFIRMED"
  | "READY_FOR_PAYOUT"
  | "COMPLETED"
  | "PAID_OUT"
  | "CANCELLED"
  | "DISPUTED"
  | "REFUNDED"
  | "PAYMENT_FAILED"
  | "EXPIRED";

export type WalletTransactionStatus = "PENDING" | "COMPLETED" | "FAILED";

export type NotificationType =
  | "proposal_received"
  | "proposal_accepted"
  | "proposal_rejected"
  | "proposal_withdrawn"
  | "contract_created"
  | "contract_funded"
  | "contract_started"
  | "contract_completed"
  | "payment_verified"
  | "dispute_created"
  | "dispute_resolved"
  | "review_received"
  | "message_received"
  | "system_update";

export type NotificationPriority = "low" | "medium" | "high" | "urgent";

export enum ErrorCode {
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  STATE_VIOLATION = "STATE_VIOLATION",
  INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS",
  PAYMENT_FAILED = "PAYMENT_FAILED",
  INTERNAL_ERROR = "INTERNAL_ERROR",
}

export interface ApiEnvelope<T> {
  data: T;
  message?: string;
  code?: string;
  meta?: Record<string, unknown>;
}

export interface ApiPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  [key: string]: T[] | ApiPagination;
  pagination: ApiPagination;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: string;
  avatarUrl?: string | null;
  artisanVerified?: boolean;
  phone?: string | null;
  address?: string | null;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string | null;
  artisanProfile?: ArtisanProfile | null;
}

export interface AuthSuccess {
  accessToken: string;
  user: User;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  location?: string | null;
  requiredSkills?: string[];
  category?: string | null;
  deadline?: string | null;
  requirements?: string | null;
  status: JobStatus | string;
  client?: Pick<User, "id" | "name" | "email">;
  artisan?: Pick<User, "id" | "name" | "email"> | null;
  contract?: {
    id: string;
    status: string;
    amount: number;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Proposal {
  id: string;
  jobId?: string;
  job: Job;
  artisan: Pick<User, "id" | "name" | "email">;
  client: Pick<User, "id" | "name" | "email">;
  amount: number;
  message: string;
  status: ProposalStatus | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Contract {
  id: string;
  amount: number;
  status: ContractStatus | string;
  escrowReleased: boolean;
  clientId: string;
  artisanId: string;
  clientConfirmedCompletion: boolean;
  artisanConfirmedCompletion: boolean;
  job: Job;
  proposal: Proposal;
  fundedAt?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  escrowReleasedAt?: string | null;
}

export type ChatMessageType = "TEXT" | "IMAGE" | "VIDEO" | "AUDIO" | "FILE";

export interface ChatConversation {
  id: string;
  contractId: string;
  clientId: string;
  artisanId: string;
  createdAt: string;
  updatedAt: string;
  contract?: {
    id: string;
    status: string;
    amount: number;
    job: Job;
    client: Pick<User, "id" | "name" | "email">;
    artisan: Pick<User, "id" | "name" | "email">;
  };
  lastMessage?: ChatMessage | null;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content?: string | null;
  type: ChatMessageType;
  fileUrl?: string | null;
  fileType?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
  createdAt: string;
  contractId?: string;
  jobTitle?: string;
}

export interface WalletBalance {
  exists?: boolean;
  balance: number;
  frozen: number;
  available: number;
  version?: number;
  virtualAccount?: {
    accountNumber?: string | null;
    accountName?: string | null;
    bankName?: string | null;
    status?: string | null;
  } | null;
}

export interface WalletTransaction {
  id: string;
  type: string;
  amount: number;
  status: WalletTransactionStatus | string;
  reference?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  completedAt?: string | null;
}

export interface WalletSummary {
  wallet: WalletBalance;
  transactionSummary?: Array<{
    type: string;
    status: string;
    _sum?: { amount?: number | null };
    _count?: { id?: number };
  }>;
  recentTransactions: WalletTransaction[];
}

export interface WalletTransactionsResponse {
  transactions: WalletTransaction[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface ArtisanProfile {
  id: string;
  userId: string;
  bio?: string | null;
  skills?: string[] | string | null;
  experience?: string | null;
  portfolio?: string[] | string | null;
  verified: boolean;
  rating?: number | null;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
  user: Pick<User, "id" | "name" | "email">;
}

export interface Review {
  id: string;
  contractId: string;
  clientId: string;
  artisanId: string;
  rating: number;
  comment: string;
  categories?: string[];
  workQuality?: number;
  communication?: number;
  timeliness?: number;
  professionalism?: number;
  evidence?: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt?: string;
  contract?: {
    id: string;
    amount: number;
    status: string;
    jobTitle: string;
  };
  client: Pick<User, "id" | "name" | "email">;
  artisan: Pick<User, "id" | "name" | "email">;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Record<1 | 2 | 3 | 4 | 5, number>;
  categoryAverages?: {
    workQuality?: number;
    communication?: number;
    timeliness?: number;
    professionalism?: number;
  };
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  entityId?: string;
  entityType?: string;
  actionUrl?: string;
  priority: NotificationPriority;
  isRead: boolean;
  isArchived: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
  readAt?: string;
  archivedAt?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  archived: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<NotificationPriority, number>;
}

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: string;
  artisanVerified: boolean;
  createdAt: string;
}

export interface AdminUserDetail {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: string;
  artisanVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string | null;
  wallet?: {
    balance: number;
    frozen: number;
    available: number;
    updatedAt: string;
  } | null;
  artisanProfile?: {
    bio: string;
    skills: string[];
    experience: string;
    portfolio: string[];
    verified: boolean;
    rating: number;
    reviewCount?: number;
    updatedAt: string;
  } | null;
  transactions: WalletTransaction[];
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    createdAt: string;
  }>;
  activity: {
    clientJobs: Array<{
      id: string;
      title: string;
      status: string;
      flagged?: boolean;
      forceCloseReason?: string;
    }>;
    artisanJobs: Array<{
      id: string;
      title: string;
      status: string;
      flagged?: boolean;
      forceCloseReason?: string;
    }>;
    clientContracts: Array<{
      id: string;
      amount: number;
      status: string;
      createdAt: string;
    }>;
    artisanContracts: Array<{
      id: string;
      amount: number;
      status: string;
      createdAt: string;
    }>;
    sentReviews: Array<{
      id: string;
      rating: number;
      comment?: string | null;
      createdAt: string;
    }>;
    receivedReviews: Array<{
      id: string;
      rating: number;
      comment?: string | null;
      createdAt: string;
    }>;
  };
}

export interface AdminDisputeRecord {
  id: string;
  contractId?: string | null;
  jobId?: string | null;
  clientId: string;
  artisanId: string;
  amount: number;
  status: string;
  evidence?: {
    images?: string[];
    videos?: string[];
    messages?: string[];
  };
  resolution?: {
    decision: string;
    resolvedAt: string;
    resolvedBy: string;
    notes?: string;
  };
}

export interface AdminCollection<T> {
  data: T[];
  meta?: Record<string, unknown>;
}

export interface AdminOverviewReport {
  reportType: "overview";
  totals: {
    users: number;
    activeJobs: number;
    openDisputes: number;
    platformFees: number;
    flaggedJobs: number;
  };
}
