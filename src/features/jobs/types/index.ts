import { Category, Skill } from "@/features/taxonomy";

export type JobStatus = "DRAFT" | "OPEN" | "UNDER_REVIEW" | "AWARDED" | "CLOSED" | "CANCELLED";

export interface Job {
  id: string;
  clientId: string;
  title: string;
  description: string;
  budget: number;
  budgetType: "FIXED" | "HOURLY";
  categoryId: string; // Foreign key to Taxonomy
  skillIds: string[]; // Array of Taxonomy Skill IDs
  location?: string;
  isRemote: boolean;
  expectedDuration?: string;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  proposalsCount: number;
  // Resolved data (if backend populates it, or frontend resolves it)
  category?: Category;
  skills?: Skill[];
}

export interface JobEvent {
  id: string;
  jobId: string;
  type: string;
  actorId: string;
  actorRole: "CLIENT" | "ARTISAN" | "ADMIN" | "SYSTEM";
  actorName: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}
