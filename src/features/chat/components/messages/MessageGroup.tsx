import { Message, UserMessage, SystemEvent } from "../../types";
import { MessageBubble } from "./MessageBubble";
import { SystemMessage } from "./SystemMessage";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { getInitials } from "@/shared/lib/utils";

interface MessageGroupProps {
  messages: Message[];
  currentUserId: string;
}

export function MessageGroup({ messages, currentUserId }: MessageGroupProps) {
  if (messages.length === 0) return null;

  const firstMsg = messages[0];

  if (firstMsg.type === "SYSTEM") {
    // Assuming system messages aren't grouped, but just mapped
    return (
      <div className="flex flex-col">
        {messages.map(msg => (
          <SystemMessage key={msg.id} message={msg as SystemEvent} />
        ))}
      </div>
    );
  }

  const isCurrentUser = (firstMsg as UserMessage).senderId === currentUserId;

  return (
    <div className={`flex w-full mb-4 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      {!isCurrentUser && (
        <div className="mr-2 flex flex-col justify-end">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://avatar.vercel.sh/${(firstMsg as UserMessage).senderId}.png`} />
            <AvatarFallback>{getInitials("User")}</AvatarFallback>
          </Avatar>
        </div>
      )}
      
      <div className={`flex flex-col w-full ${isCurrentUser ? "items-end" : "items-start"}`}>
        {messages.map((msg, index) => {
          const isLast = index === messages.length - 1;
          return (
            <MessageBubble 
              key={msg.id} 
              message={msg as UserMessage} 
              isCurrentUser={isCurrentUser} 
              showTail={isLast}
            />
          );
        })}
      </div>
    </div>
  );
}
