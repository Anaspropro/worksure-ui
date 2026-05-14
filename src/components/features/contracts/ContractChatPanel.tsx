"use client";

import { useState } from "react";
import ChatWindow from "@/components/chat/ChatWindow";
import { useContractConversation, useConversationMessages, useConversationSocket, useSendMessage } from "@/hooks/useChat";
import { useUpload } from "@/hooks/useUpload";
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
  const { uploadFile, isUploading } = useUpload();
  
  const conversationQuery = useContractConversation(contract.id, { enabled: Boolean(user) });
  const conversation = conversationQuery.data;
  const messagesQuery = useConversationMessages(conversation?.id, { enabled: Boolean(conversation?.id) });
  const messages = messagesQuery.data?.data ?? [];
  const sendMessageMutation = useSendMessage();
  const { isConnected, socketReady, socket } = useConversationSocket(conversation?.id, Boolean(conversation?.id));

  const handleSend = async () => {
    if (!conversation || (!draft.trim() && !file)) {
      return;
    }

    let uploadedInfo: any = undefined;

    if (file) {
      const result = await uploadFile(file);
      if (result) {
        uploadedInfo = {
          fileUrl: result.secure_url,
          fileType: file.type,
          fileName: file.name,
          fileSize: result.bytes,
        };
      }
    }

    if (socketReady && isConnected && socket) {
      socket.emit("sendMessage", {
        conversationId: conversation.id,
        content: draft.trim() || undefined,
        type: uploadedInfo
          ? uploadedInfo.fileType?.startsWith("image/")
            ? "IMAGE"
            : uploadedInfo.fileType?.startsWith("video/")
              ? "VIDEO"
              : uploadedInfo.fileType?.startsWith("audio/")
                ? "AUDIO"
                : "FILE"
          : "TEXT",
        ...uploadedInfo,
      });
      setDraft("");
      setFile(null);
      return;
    }

    await sendMessageMutation.mutateAsync({
      conversationId: conversation.id,
      content: draft,
      file: null, // File is already uploaded or handled
      ...uploadedInfo,
    } as any);
    
    setDraft("");
    setFile(null);
  };

  return (
    <ChatWindow
      user={user}
      conversation={conversation}
      messages={messages}
      draft={draft}
      file={file}
      isConnected={isConnected}
      socketReady={socketReady}
      pending={sendMessageMutation.status === "pending" || isUploading}
      onDraftChange={setDraft}
      onFileChange={setFile}
      onClearFile={() => setFile(null)}
      onSend={handleSend}
    />
  );
}
