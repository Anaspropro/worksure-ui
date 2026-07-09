import { Workspaces } from "@/features/jobs";

export default async function AdminJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  return (
    <div className="py-6">
      <Workspaces.AdminJobDetail jobId={resolvedParams.id} />
    </div>
  );
}
