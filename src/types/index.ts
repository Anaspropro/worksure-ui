export type UserRole = "CLIENT" | "ARTISAN" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  artisanVerified?: boolean;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: string;
  contract?: {
    id: string;
    status: string;
    amount: number;
  } | null;
}

export interface Proposal {
  id: string;
  job: Job;
  artisan: User;
  client: User;
  amount: number;
  message: string;
  status: string;
}

export interface Contract {
  id: string;
  amount: number;
  status: string;
  escrowReleased: boolean;
  clientId: string;
  artisanId: string;
  clientConfirmedCompletion: boolean;
  artisanConfirmedCompletion: boolean;
  job: Job;
  proposal: Proposal;
}

export interface ApiListResponse<T> {
  data: T;
  message?: string;
}

export interface ApiPagination<T> {
  results: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
