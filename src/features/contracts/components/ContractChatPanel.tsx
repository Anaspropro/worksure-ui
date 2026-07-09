"use client";

import { useEffect, useState } from "react";
import ChatWindow from "@/components/chat/ChatWindow";
import { useContractConversation, useConversationMessages, useSendMessage } from "@/hooks/useChat";
import { useUpload } from "@/hooks/useUpload";
import { useChatSocket } from "@/features/chat/providers/ChatSocketProvider";
import type { Contract, User } from "@/types";

export function ContractChatPanel({
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
  
  const { isConnected, socketReady, socket, setActiveConversationId } = useChatSocket();

  useEffect(() => {
    if (conversation?.id) {
      setActiveConversationId(conversation.id);
    }
    return () => {
      setActiveConversationId(null);
    };
  }, [conversation?.id, setActiveConversationId]);

  const handleSend = async () => {
    if (!conversation || (!draft.trim() && !file)) {
      return;
    }

    let uploadedInfo: {
      fileUrl: string;
      fileType: string;
      fileName: string;
      fileSize: number;
    } | undefined = undefined;

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
      file: null,
      fileUrl: uploadedInfo?.fileUrl,
      fileType: uploadedInfo?.fileType,
      fileName: uploadedInfo?.fileName,
      fileSize: uploadedInfo?.fileSize,
    });
    
    setDraft("");
    setFile(null);
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
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
    </div>
  );
}
export default ContractChatPanel;
