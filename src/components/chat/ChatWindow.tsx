"use client";

import { Wifi, WifiOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MessageBubble from "@/components/chat/MessageBubble";
import MessageInput from "@/components/chat/MessageInput";
import type { ChatConversation, ChatMessage, User } from "@/types";

export default function ChatWindow({
  user,
  conversation,
  messages,
  draft,
  file,
  isConnected,
  socketReady,
  pending,
  onDraftChange,
  onFileChange,
  onClearFile,
  onSend,
}: {
  user: User;
  conversation?: ChatConversation;
  messages: ChatMessage[];
  draft: string;
  file: File | null;
  isConnected: boolean;
  socketReady: boolean;
  pending?: boolean;
  onDraftChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
  onClearFile: () => void;
  onSend: () => Promise<void> | void;
}) {
  const otherParty = conversation?.contract
    ? conversation.contract.client.id === user.id
      ? conversation.contract.artisan
      : conversation.contract.client
    : null;

  const canSend = draft.trim().length > 0 || Boolean(file);

  return (
    <Card className="border-border/80 bg-white">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>Contract chat</CardTitle>
            <CardDescription>
              Keep delivery notes, evidence, and clarifications inside the same agreement.
            </CardDescription>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-1 text-xs font-medium text-muted-foreground">
            {socketReady && isConnected ? <Wifi className="size-3.5 text-emerald-600" /> : <WifiOff className="size-3.5 text-amber-600" />}
            {socketReady && isConnected ? "Realtime connected" : "Polling fallback"}
          </div>
        </div>
        {otherParty ? (
          <p className="text-sm text-muted-foreground">
            Conversation with {otherParty.name} about {conversation?.contract?.job.title}.
          </p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-h-112 space-y-3 overflow-y-auto rounded-lg border border-border/70 bg-stone-50/70 p-4">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No messages yet. Start the thread with a delivery update, question, or attachment.
            </p>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message.id} message={message} isOwn={message.senderId === user.id} />
            ))
          )}
        </div>

        <MessageInput
          draft={draft}
          file={file}
          disabled={!conversation || !canSend}
          pending={pending}
          onDraftChange={onDraftChange}
          onFileChange={onFileChange}
          onClearFile={onClearFile}
          onSend={onSend}
        />
      </CardContent>
    </Card>
  );
}
