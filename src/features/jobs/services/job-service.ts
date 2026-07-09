import { Job, JobEvent, JobStatus } from "../types";
import { CreateJobPayload } from "../schemas";

// Mock data
const MOCK_JOBS: Job[] = [
  {
    id: "job-1",
    clientId: "client-123",
    title: "Senior React Developer for Marketplace Redesign",
    description: "We are looking for an experienced React developer to help us redesign our frontend architecture. Must have experience with Next.js, TanStack Query, and Tailwind CSS.",
    budget: 5000,
    budgetType: "FIXED",
    categoryId: "cat-1",
    skillIds: ["sk-1", "sk-2", "sk-3"],
    isRemote: true,
    expectedDuration: "2-3 months",
    status: "OPEN",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    proposalsCount: 5,
  },
  {
    id: "job-2",
    clientId: "client-123",
    title: "UI/UX Designer for Mobile App",
    description: "Need a talented designer to create Figma mockups for our upcoming mobile application.",
    budget: 45,
    budgetType: "HOURLY",
    categoryId: "cat-3",
    skillIds: ["sk-7"],
    isRemote: true,
    status: "UNDER_REVIEW",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    proposalsCount: 12,
  },
];

export async function getJobs(params?: Record<string, any>): Promise<{ data: Job[]; total: number }> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return {
    data: MOCK_JOBS,
    total: MOCK_JOBS.length,
  };
}

export async function getJobById(id: string): Promise<Job> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const job = MOCK_JOBS.find(j => j.id === id);
  if (!job) throw new Error("Job not found");
  return job;
}

export async function createJob(payload: CreateJobPayload): Promise<Job> {
  await new Promise(resolve => setTimeout(resolve, 600));
  const newJob: Job = {
    ...payload,
    id: `job-${Math.random().toString(36).substr(2, 9)}`,
    clientId: "client-current",
    status: "OPEN",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    proposalsCount: 0,
  };
  MOCK_JOBS.push(newJob);
  return newJob;
}

export async function updateJobStatus(id: string, status: JobStatus): Promise<Job> {
  await new Promise(resolve => setTimeout(resolve, 400));
  const job = MOCK_JOBS.find(j => j.id === id);
  if (!job) throw new Error("Job not found");
  job.status = status;
  job.updatedAt = new Date().toISOString();
  return job;
}

export async function getJobTimeline(id: string): Promise<JobEvent[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [
    {
      id: "evt-1",
      jobId: id,
      type: "JOB_CREATED",
      actorId: "client-123",
      actorRole: "CLIENT",
      actorName: "Acme Corp",
      description: "Job posting created",
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "evt-2",
      jobId: id,
      type: "JOB_PUBLISHED",
      actorId: "client-123",
      actorRole: "CLIENT",
      actorName: "Acme Corp",
      description: "Job published to marketplace",
      timestamp: new Date(Date.now() - 86400000 * 1.9).toISOString(),
    }
  ];
}
