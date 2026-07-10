import { Conversation } from "../../types";
import { OnlineIndicator } from "../shared/OnlineIndicator";
import { Badge } from "@/shared/components/ui/badge";

interface ConversationHeaderProps {
  conversation: Conversation;
}

export function ConversationHeader({ conversation }: ConversationHeaderProps) {
  // In a real app, determine the main participant we are talking to
  const otherParticipantStatus = "ONLINE"; // Mock status
  
  return (
    <div className="flex items-center justify-between border-b bg-background px-4 py-3 shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold">
              {conversation.metadata?.title || "Conversation"}
            </h2>
            <OnlineIndicator status={otherParticipantStatus} />
          </div>
          <p className="text-xs text-muted-foreground">
            {conversation.context} &bull; Ref: {conversation.contextReferenceId.substring(0, 8)}
          </p>
        </div>
      </div>
      
      <div>
        {conversation.status === "ACTIVE" ? (
          <Badge variant="secondary">Active</Badge>
        ) : (
          <Badge variant="outline">{conversation.status}</Badge>
        )}
      </div>
    </div>
  );
}
