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
  visibleAt?: string;
  breakdown?: any;
  author?: any;
  contract?: {
    id: string;
    amount: number;
    status: string;
    jobTitle: string;
  };
  client: {
    id: string;
    name: string;
    email: string;
  };
  artisan: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  categoryAverages?: {
    workQuality?: number;
    communication?: number;
    timeliness?: number;
    professionalism?: number;
  };
}
