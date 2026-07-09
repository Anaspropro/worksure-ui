import { Category, Skill } from "../types";

// Temporary mock data until the backend Taxonomy API is ready
const MOCK_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Web Development", slug: "web-development", isPopular: true },
  { id: "cat-2", name: "Mobile Development", slug: "mobile-development", isPopular: true },
  { id: "cat-3", name: "Design & Creative", slug: "design", isPopular: false },
  { id: "cat-4", name: "Writing & Translation", slug: "writing", isPopular: false },
];

const MOCK_SKILLS: Skill[] = [
  { id: "sk-1", name: "React", slug: "react", categoryId: "cat-1", isTrending: true },
  { id: "sk-2", name: "Next.js", slug: "nextjs", categoryId: "cat-1", isTrending: true },
  { id: "sk-3", name: "TypeScript", slug: "typescript", categoryId: "cat-1" },
  { id: "sk-4", name: "Node.js", slug: "nodejs", categoryId: "cat-1" },
  { id: "sk-5", name: "Flutter", slug: "flutter", categoryId: "cat-2", isTrending: true },
  { id: "sk-6", name: "Swift", slug: "swift", categoryId: "cat-2" },
  { id: "sk-7", name: "Figma", slug: "figma", categoryId: "cat-3", isTrending: true },
  { id: "sk-8", name: "Copywriting", slug: "copywriting", categoryId: "cat-4" },
];

export async function getCategories(): Promise<Category[]> {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 300));
  return MOCK_CATEGORIES;
}

export async function getCategory(id: string): Promise<Category | null> {
  await new Promise(resolve => setTimeout(resolve, 150));
  return MOCK_CATEGORIES.find(c => c.id === id) || null;
}

export async function getSkillsByCategory(categoryId: string): Promise<Skill[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return MOCK_SKILLS.filter(s => s.categoryId === categoryId);
}

export async function searchSkills(query: string): Promise<Skill[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  if (!query) return [];
  const q = query.toLowerCase();
  return MOCK_SKILLS.filter(s => s.name.toLowerCase().includes(q));
}

export async function getSkill(id: string): Promise<Skill | null> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return MOCK_SKILLS.find(s => s.id === id) || null;
}
