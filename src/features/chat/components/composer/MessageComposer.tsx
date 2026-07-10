"use client";

import { useState, useRef, useEffect } from "react";
import { useSendMessage } from "../../hooks/useMessages";
import { useTyping } from "../../hooks/useTyping";
import { Paperclip, Send, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface MessageComposerProps {
  conversationId: string;
  currentUserId: string;
}

export function MessageComposer({ conversationId, currentUserId }: MessageComposerProps) {
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { emitTyping } = useTyping(conversationId, currentUserId);
  const { mutate: sendMessage, isPending } = useSendMessage(conversationId);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [content]);

  const handleSend = () => {
    if (!content.trim() && attachments.length === 0) return;

    // TODO: Attachment pipeline (validate -> upload -> attach -> send)
    // For now, we only handle text
    if (content.trim()) {
      sendMessage({
        content: content.trim(),
        type: "TEXT",
        tempId: crypto.randomUUID(),
      });
    }

    setContent("");
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...filesArray]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col border-t bg-background p-3">
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {attachments.map((file, i) => (
            <div key={i} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-xs">
              <span className="truncate max-w-[150px]">{file.name}</span>
              <button onClick={() => removeAttachment(i)} className="text-muted-foreground hover:text-foreground">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-end gap-2">
        <label className="cursor-pointer p-2 text-muted-foreground hover:text-foreground transition-colors">
          <input type="file" className="hidden" multiple onChange={handleFileChange} />
          <Paperclip className="w-5 h-5" />
        </label>
        
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            emitTyping();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 max-h-[120px] min-h-[40px] resize-none rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 overflow-y-auto"
          rows={1}
        />
        
        <Button 
          onClick={handleSend} 
          disabled={(!content.trim() && attachments.length === 0) || isPending}
          size="icon"
          className="rounded-full shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
