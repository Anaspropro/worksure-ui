"use client";

import { useReputationProfile } from "../api";
import { ReputationBadge } from "./ReputationBadge";

interface UserReputationBadgeProps {
  userId: string;
  type?: "artisan" | "client";
}

export function UserReputationBadge({ userId, type = "artisan" }: UserReputationBadgeProps) {
  const { data: profile, isLoading } = useReputationProfile(userId);

  if (isLoading) {
    return <div className="h-6 w-24 bg-gray-100 animate-pulse rounded-md"></div>;
  }

  // If no profile data exists, fallback to new
  return (
    <ReputationBadge 
      jssScore={profile?.jssScore}
      totalReviews={profile?.totalReviews || 0}
      averageRating={profile?.averageRating || 0}
      type={type}
    />
  );
}
