import { SystemEvent } from "../../types";
import { format } from "date-fns";

interface SystemMessageProps {
  message: SystemEvent;
}

export function SystemMessage({ message }: SystemMessageProps) {
  return (
    <div className="flex justify-center w-full my-4">
      <div className="bg-muted/50 text-muted-foreground text-xs px-3 py-1 rounded-full border border-border/50 text-center max-w-[90%]">
        <span className="font-medium mr-2">{format(new Date(message.createdAt), "MMM d, HH:mm")}</span>
        {message.content}
      </div>
    </div>
  );
}
