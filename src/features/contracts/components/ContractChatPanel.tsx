"use client";

import { useConversations } from "@/features/chat/hooks/useConversations";
import { ChatWindow } from "@/features/chat/components/layout/ChatWindow";
import { useUser } from "@/features/auth/hooks/useAuth";
import { Loader2 } from "lucide-react";
import type { Contract } from "@/types";

export function ContractChatPanel({
  contract,
}: {
  contract: Contract;
}) {
  const { data: user } = useUser();
  // Fetch conversation specific to this contract
  const { data: conversations, isLoading } = useConversations("CONTRACT", contract.id);
  
  if (isLoading || !user) {
    return (
      <div className="flex h-96 items-center justify-center rounded-2xl border bg-card">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const conversation = conversations?.[0];

  if (!conversation) {
    return (
      <div className="flex flex-col h-96 items-center justify-center rounded-2xl border bg-card text-muted-foreground">
        <p>No conversation found for this contract.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm h-[600px] flex flex-col">
      <ChatWindow
        conversation={conversation}
        currentUserId={user.id}
      />
    </div>
  );
}
