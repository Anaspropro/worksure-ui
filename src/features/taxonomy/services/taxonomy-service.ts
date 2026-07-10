import apiClient from "@/shared/api/client";
import { ApiError } from "@/shared/api/fetcher";
import { components } from "@/shared/api/generated/schema";

export type Category = components["schemas"]["CategoryResponseDto"];
export type Skill = components["schemas"]["SkillResponseDto"];

export async function getCategories(): Promise<Category[]> {
  const { data, error, response } = await apiClient.GET("/taxonomy/categories");
  if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
  return data ?? [];
}

export async function getCategory(id: string): Promise<Category | null> {
  const { data, error, response } = await apiClient.GET("/taxonomy/categories/{id}", {
    params: { path: { id } }
  });
  if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
  return data ?? null;
}

export async function getSkillsByCategory(categoryId: string): Promise<Skill[]> {
  const { data, error, response } = await apiClient.GET("/taxonomy/categories/{categoryId}/skills", {
    params: { path: { categoryId } }
  });
  if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
  return data ?? [];
}

export async function searchSkills(query: string): Promise<Skill[]> {
  if (!query) return [];
  const { data, error, response } = await apiClient.GET("/taxonomy/skills/search", {
    params: { query: { q: query } }
  });
  if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
  return data ?? [];
}

export async function getSkill(id: string): Promise<Skill | null> {
  const { data, error, response } = await apiClient.GET("/taxonomy/skills/{id}", {
    params: { path: { id } }
  });
  if (error) throw new ApiError((response as Response).statusText, (response as Response).status, error);
  return data ?? null;
}
