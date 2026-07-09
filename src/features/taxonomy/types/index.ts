export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  description?: string;
  icon?: string;
  isPopular?: boolean;
}

export interface Skill {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  isTrending?: boolean;
  isVerified?: boolean;
}
