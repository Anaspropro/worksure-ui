import { ChatWorkspace } from "@/features/chat/workspaces/ChatWorkspace";

export default function MessagesPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Manage all your conversations across jobs and contracts.</p>
      </div>
      <ChatWorkspace />
    </div>
  );
}
