import { ReviewModerationWorkspace } from "@/features/admin/workspaces/reviews/components/ReviewModerationWorkspace";

export const metadata = {
  title: "Review Moderation - Admin Portal",
};

export default function AdminReviewsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ReviewModerationWorkspace />
    </div>
  );
}
