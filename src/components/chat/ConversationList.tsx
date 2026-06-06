"use client";

import type { ChatConversation } from "@/types";

export default function ConversationList({
  conversations,
  activeConversationId,
  onSelect,
}: {
  conversations: ChatConversation[];
  activeConversationId?: string;
  onSelect: (conversationId: string) => void;
}) {
  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        const isActive = conversation.id === activeConversationId;

        return (
          <button
            key={conversation.id}
            type="button"
            onClick={() => onSelect(conversation.id)}
            className={`w-full rounded-lg border px-4 py-3 text-left transition ${
              isActive ? "border-primary bg-primary-soft" : "border-border/70 bg-card hover:bg-muted/40"
            }`}
          >
            <p className="font-medium text-foreground">{conversation.contract?.job.title || "Conversation"}</p>
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {conversation.lastMessage?.content || conversation.lastMessage?.fileName || "No messages yet"}
            </p>
          </button>
        );
      })}
    </div>
  );
}
