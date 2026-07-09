"use client";

import { useState } from "react";
import { useConversations, useConversation } from "../hooks/useConversations";
import { SidebarList } from "../components/layout/SidebarList";
import { ChatWindow } from "../components/layout/ChatWindow";
import { useUser } from "@/features/auth/hooks/useAuth";
import { ConversationContext } from "../types";
import { Loader2, MessageSquareText } from "lucide-react";

interface ChatWorkspaceProps {
  contextFilter?: ConversationContext;
}

export function ChatWorkspace({ contextFilter }: ChatWorkspaceProps) {
  const { data: user } = useUser();
  const { data: conversations, isLoading } = useConversations(contextFilter);
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>();
  
  const { data: selectedConversation, isLoading: isConversationLoading } = useConversation(selectedConversationId || "");

  if (isLoading || !user) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full border rounded-xl overflow-hidden bg-background">
      {/* Sidebar - hidden on mobile if a conversation is selected */}
      <div className={`w-full md:w-80 border-r flex flex-col shrink-0 ${selectedConversationId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b shrink-0 flex justify-between items-center bg-muted/30">
          <h2 className="font-semibold">Messages</h2>
        </div>
        <div className="flex-1 overflow-hidden">
          <SidebarList 
            conversations={conversations || []} 
            selectedId={selectedConversationId} 
            onSelect={setSelectedConversationId} 
            contextFilter={contextFilter}
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col min-w-0 ${!selectedConversationId ? 'hidden md:flex' : 'flex'}`}>
        {selectedConversation ? (
          <ChatWindow 
            conversation={selectedConversation} 
            currentUserId={user.id} 
          />
        ) : (
          <div className="flex flex-col h-full items-center justify-center text-muted-foreground bg-muted/10">
            <MessageSquareText className="w-12 h-12 mb-4 opacity-20" />
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
