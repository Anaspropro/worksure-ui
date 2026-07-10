import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";
import { getCategories, getCategory, getSkillsByCategory, searchSkills, getSkill } from "../services/taxonomy-service";

const STALE_TIME = 1000 * 60 * 60 * 24; // 24 hours

export function useCategories() {
  return useQuery({
    queryKey: [...queryKeys.taxonomy.all, "categories"],
    queryFn: () => getCategories(),
    staleTime: STALE_TIME,
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: [...queryKeys.taxonomy.all, "category", id],
    queryFn: () => getCategory(id),
    enabled: !!id,
    staleTime: STALE_TIME,
  });
}

export function useSkillsByCategory(categoryId: string) {
  return useQuery({
    queryKey: queryKeys.taxonomy.skills(categoryId),
    queryFn: () => getSkillsByCategory(categoryId),
    enabled: !!categoryId,
    staleTime: STALE_TIME,
  });
}

export function useSkillSearch(query: string) {
  return useQuery({
    queryKey: queryKeys.taxonomy.skillSearch(query),
    queryFn: () => searchSkills(query),
    enabled: query.length > 0,
    staleTime: STALE_TIME,
  });
}

export function useSkill(id: string) {
  return useQuery({
    queryKey: [...queryKeys.taxonomy.skills(), id],
    queryFn: () => getSkill(id),
    enabled: !!id,
    staleTime: STALE_TIME,
  });
}
