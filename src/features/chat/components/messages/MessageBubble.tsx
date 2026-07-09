import { cn } from "@/shared/lib/utils";
import { UserMessage } from "../../types";
import { Check, CheckCheck, Clock } from "lucide-react";
import { format } from "date-fns";

interface MessageBubbleProps {
  message: UserMessage;
  isCurrentUser: boolean;
  showTail?: boolean;
}

export function MessageBubble({ message, isCurrentUser, showTail = true }: MessageBubbleProps) {
  const isPending = message.status === "SENDING";
  const isFailed = message.status === "FAILED";

  return (
    <div
      className={cn("flex w-full mt-1.5", {
        "justify-end": isCurrentUser,
        "justify-start": !isCurrentUser,
      })}
    >
      <div
        className={cn(
          "relative max-w-[80%] md:max-w-[70%] px-3.5 py-2 rounded-2xl group",
          {
            "bg-primary text-primary-foreground": isCurrentUser,
            "bg-muted": !isCurrentUser,
            "rounded-tr-sm": isCurrentUser && showTail,
            "rounded-tl-sm": !isCurrentUser && showTail,
            "opacity-70": isPending,
            "border-destructive border": isFailed,
          }
        )}
      >
        {/* If replied to, show here */}
        
        <div className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
          {message.content}
        </div>

        {message.actions?.editedAt && (
          <span className="text-[10px] italic opacity-70 ml-2">edited</span>
        )}

        <div
          className={cn("flex items-center justify-end gap-1 mt-1", {
            "text-primary-foreground/80": isCurrentUser,
            "text-muted-foreground": !isCurrentUser,
          })}
        >
          <span className="text-[10px]">
            {format(new Date(message.createdAt), "HH:mm")}
          </span>
          
          {isCurrentUser && (
            <div className="flex items-center">
              {isPending && <Clock className="w-3 h-3" />}
              {message.status === "SENT" && <Check className="w-3 h-3" />}
              {message.status === "DELIVERED" && <CheckCheck className="w-3 h-3" />}
              {message.status === "READ" && <CheckCheck className="w-3 h-3 text-blue-300" />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
