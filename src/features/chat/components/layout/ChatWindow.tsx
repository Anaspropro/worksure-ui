"use client";

import { useRef, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useMessages } from "../../hooks/useMessages";
import { MessageGroup } from "../messages/MessageGroup";
import { MessageComposer } from "../composer/MessageComposer";
import { ConversationHeader } from "./ConversationHeader";
import { Conversation, Message } from "../../types";
import { TypingIndicator } from "../shared/TypingIndicator";
import { useTyping } from "../../hooks/useTyping";
import { Loader2 } from "lucide-react";

interface ChatWindowProps {
  conversation: Conversation;
  currentUserId: string;
}

export function ChatWindow({ conversation, currentUserId }: ChatWindowProps) {
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading 
  } = useMessages(conversation.id);

  const { typingUsers } = useTyping(conversation.id, currentUserId);
  const parentRef = useRef<HTMLDivElement>(null);

  // Flatten messages from infinite query pages
  // Assuming pages are ordered newest to oldest, we reverse to display chronologically (oldest top, newest bottom)
  const messages = data?.pages.flatMap(page => page.messages).reverse() || [];

  // Group messages
  const groupedMessages: Message[][] = [];
  let currentGroup: Message[] = [];

  messages.forEach((msg, index) => {
    if (index === 0) {
      currentGroup.push(msg);
      return;
    }

    const prevMsg = messages[index - 1];
    
    // Group logic: same sender, same type (UserMessage), within 5 minutes
    if (
      msg.type !== "SYSTEM" && 
      prevMsg.type !== "SYSTEM" &&
      (msg as any).senderId === (prevMsg as any).senderId &&
      new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime() < 5 * 60 * 1000
    ) {
      currentGroup.push(msg);
    } else {
      groupedMessages.push(currentGroup);
      currentGroup = [msg];
    }
  });

  if (currentGroup.length > 0) {
    groupedMessages.push(currentGroup);
  }

  // Virtualizer setup
  const rowVirtualizer = useVirtualizer({
    count: groupedMessages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60, // Estimate row height
    overscan: 5,
  });

  // Handle scrolling to fetch more (older) messages when reaching the top
  useEffect(() => {
    const handleScroll = () => {
      if (!parentRef.current) return;
      if (parentRef.current.scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };

    const scrollElement = parentRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Initial scroll to bottom (using the virtualizer scroll handler)
  useEffect(() => {
    if (rowVirtualizer.getTotalSize() > 0 && messages.length > 0) {
      // scroll to bottom on initial load
      // rowVirtualizer.scrollToIndex(groupedMessages.length - 1, { align: "end" });
      if (parentRef.current) {
        parentRef.current.scrollTop = parentRef.current.scrollHeight;
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  return (
    <div className="flex flex-col h-full bg-muted/20 relative">
      <ConversationHeader conversation={conversation} />
      
      <div 
        ref={parentRef}
        className="flex-1 overflow-y-auto px-4 py-4"
        style={{ scrollBehavior: "smooth" }}
      >
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {isFetchingNextPage && (
              <div className="absolute top-0 left-0 w-full flex justify-center py-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const group = groupedMessages[virtualRow.index];
              return (
                <div
                  key={virtualRow.index}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  ref={rowVirtualizer.measureElement}
                  data-index={virtualRow.index}
                >
                  <MessageGroup messages={group} currentUserId={currentUserId} />
                </div>
              );
            })}
          </div>
        )}
        
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 mt-2 ml-10 mb-2">
            <span className="text-xs text-muted-foreground italic">
              {typingUsers.length === 1 ? "Someone is typing" : "Multiple people are typing"}
            </span>
            <TypingIndicator />
          </div>
        )}
      </div>

      <MessageComposer 
        conversationId={conversation.id} 
        currentUserId={currentUserId} 
      />
    </div>
  );
}
