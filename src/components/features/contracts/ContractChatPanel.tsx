"use client";

import { useState } from "react";
import ChatWindow from "@/components/chat/ChatWindow";
import { useContractConversation, useConversationMessages, useConversationSocket, useSendMessage } from "@/hooks/useChat";
import type { Contract, User } from "@/types";

export default function ContractChatPanel({
  contract,
  user,
}: {
  contract: Contract;
  user: User;
}) {
  const [draft, setDraft] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const conversationQuery = useContractConversation(contract.id, { enabled: Boolean(user) });
  const conversation = conversationQuery.data;
  const messagesQuery = useConversationMessages(conversation?.id, { enabled: Boolean(conversation?.id) });
  const messages = messagesQuery.data?.data ?? [];
  const sendMessageMutation = useSendMessage();
  const { isConnected, socketReady, socket } = useConversationSocket(conversation?.id, Boolean(conversation?.id));

  return (
    <ChatWindow
      user={user}
      conversation={conversation}
      messages={messages}
      draft={draft}
      file={file}
      isConnected={isConnected}
      socketReady={socketReady}
      pending={sendMessageMutation.status === "pending"}
      onDraftChange={setDraft}
      onFileChange={setFile}
      onClearFile={() => setFile(null)}
      onSend={async () => {
        if (!conversation) {
          return;
        }

        if (socketReady && isConnected && socket) {
          const uploaded = file
            ? await (async () => {
                const body = new FormData();
                body.append("file", file);
                const response = await fetch("/api/proxy/upload", {
                  method: "POST",
                  body,
                });
                return (await response.json()) as {
                  fileUrl: string;
                  fileType?: string | null;
                  fileName?: string | null;
                  fileSize?: number | null;
                };
              })()
            : undefined;

          socket.emit("sendMessage", {
            conversationId: conversation.id,
            content: draft.trim() || undefined,
            type: uploaded
              ? uploaded.fileType?.startsWith("image/")
                ? "IMAGE"
                : uploaded.fileType?.startsWith("video/")
                  ? "VIDEO"
                  : uploaded.fileType?.startsWith("audio/")
                    ? "AUDIO"
                    : "FILE"
              : "TEXT",
            ...uploaded,
          });
          setDraft("");
          setFile(null);
          return;
        }

        await sendMessageMutation.mutateAsync({
          conversationId: conversation.id,
          content: draft,
          file,
        });
        setDraft("");
        setFile(null);
      }}
    />
  );
}
