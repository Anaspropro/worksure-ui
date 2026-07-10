import { Conversation, ConversationContext } from "../../types";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/shared/lib/utils";
import { UnreadBadge } from "../shared/UnreadBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { getInitials } from "@/shared/lib/utils";

interface SidebarListProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (id: string) => void;
  contextFilter?: ConversationContext;
}

export function SidebarList({ conversations, selectedId, onSelect, contextFilter }: SidebarListProps) {
  const filtered = contextFilter 
    ? conversations.filter(c => c.context === contextFilter)
    : conversations;

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground h-full">
        <p className="text-sm">No conversations found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto">
      {filtered.map(conv => (
        <button
          key={conv.id}
          onClick={() => onSelect(conv.id)}
          className={cn(
            "flex items-start gap-3 p-3 text-left transition-colors border-b hover:bg-muted/50",
            selectedId === conv.id && "bg-muted"
          )}
        >
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={`https://avatar.vercel.sh/${conv.id}.png`} />
            <AvatarFallback>{getInitials(conv.metadata?.title || "C")}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-medium truncate">
                {conv.metadata?.title || "Conversation"}
              </h3>
              {conv.metadata?.lastMessageAt && (
                <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                  {formatDistanceToNow(new Date(conv.metadata.lastMessageAt), { addSuffix: true })}
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground truncate">
                {conv.metadata?.lastMessagePreview || "No messages yet"}
              </p>
              <UnreadBadge count={conv.metadata?.unreadCount || 0} />
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
