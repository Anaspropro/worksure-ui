import { financialQueryKeys } from "@/features/financial/shared/utils/queryKeys";

export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
};

export const jobKeys = {
  all: ["jobs"] as const,
  lists: () => [...jobKeys.all, "list"] as const,
  list: (filter: Record<string, any>) => [...jobKeys.lists(), filter] as const,
  details: () => [...jobKeys.all, "detail"] as const,
  detail: (id: string) => [...jobKeys.details(), id] as const,
  proposals: (id: string) => [...jobKeys.detail(id), "proposals"] as const,
  timeline: (id: string) => [...jobKeys.detail(id), "timeline"] as const,
  activity: (id: string) => [...jobKeys.detail(id), "activity"] as const,
  matching: (id: string) => [...jobKeys.detail(id), "matching"] as const,
  saved: () => [...jobKeys.all, "saved"] as const,
};

export const taxonomyKeys = {
  all: ["taxonomy"] as const,
  categories: () => [...taxonomyKeys.all, "categories"] as const,
  category: (id: string) => [...taxonomyKeys.categories(), id] as const,
  categoryTree: () => [...taxonomyKeys.categories(), "tree"] as const,
  skills: () => [...taxonomyKeys.all, "skills"] as const,
  skillsByCategory: (categoryId: string) => [...taxonomyKeys.skills(), { categoryId }] as const,
  searchSkills: (query: string) => [...taxonomyKeys.skills(), { search: query }] as const,
};

export const contractKeys = {
  all: ["contracts"] as const,
  lists: () => [...contractKeys.all, "list"] as const,
  list: (filter: Record<string, any>) => [...contractKeys.lists(), filter] as const,
  details: () => [...contractKeys.all, "detail"] as const,
  detail: (id: string) => [...contractKeys.details(), id] as const,
  timeline: (id: string) => [...contractKeys.detail(id), "timeline"] as const,
  deliverables: (id: string) => [...contractKeys.detail(id), "deliverables"] as const,
  reviews: (id: string) => [...contractKeys.detail(id), "reviews"] as const,
  disputes: (id: string) => [...contractKeys.detail(id), "disputes"] as const,
  activity: (id: string) => [...contractKeys.detail(id), "activity"] as const,
  escrow: (id: string) => [...contractKeys.detail(id), "escrow"] as const,
};

export const chatKeys = {
  all: ["chat"] as const,
  rooms: () => [...chatKeys.all, "rooms"] as const,
  messages: () => [...chatKeys.all, "messages"] as const,
  messagesForRoom: (roomId: string) => [...chatKeys.messages(), roomId] as const,
};

export const notificationKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationKeys.all, "list"] as const,
  stats: () => [...notificationKeys.all, "stats"] as const,
};

export const reviewKeys = {
  all: ["reviews"] as const,
  list: () => [...reviewKeys.all, "list"] as const,
  listForUser: (userId: string) => [...reviewKeys.list(), userId] as const,
  stats: (artisanId: string) => [...reviewKeys.all, "stats", artisanId] as const,
};

export const profileKeys = {
  all: ["profile"] as const,
  detail: (userId: string) => [...profileKeys.all, "detail", userId] as const,
};

export const kycKeys = {
  all: ["kyc"] as const,
  status: (userId: string) => [...kycKeys.all, "status", userId] as const,
};

export const adminKeys = {
  all: ["admin"] as const,
  users: (filter: Record<string, any>) => [...adminKeys.all, "users", filter] as const,
  userDetail: (id: string) => [...adminKeys.all, "users", "detail", id] as const,
  disputes: (filter: Record<string, any>) => [...adminKeys.all, "disputes", filter] as const,
  reports: (type: string) => [...adminKeys.all, "reports", type] as const,
  contracts: (filter: Record<string, any>) => [...adminKeys.all, "contracts", filter] as const,
  jobs: (filter: Record<string, any>) => [...adminKeys.all, "jobs", filter] as const,
};

export const queryKeys = {
  auth: authKeys,
  jobs: jobKeys,
  taxonomy: taxonomyKeys,
  contracts: contractKeys,
  chat: chatKeys,
  notifications: notificationKeys,
  reviews: reviewKeys,
  profile: profileKeys,
  kyc: kycKeys,
  admin: adminKeys,
  financial: financialQueryKeys,
};
