import { Workspaces } from "@/features/jobs";

export default function CreateJobPage() {
  return (
    <div className="py-6">
      <Workspaces.CreateJobWizard />
    </div>
  );
}
