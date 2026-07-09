export type ConversationContext = "JOB" | "CONTRACT" | "DISPUTE" | "SUPPORT" | "SYSTEM";
export type ConversationStatus = "ACTIVE" | "ARCHIVED" | "LOCKED" | "CLOSED";
export type MessageType = "TEXT" | "IMAGE" | "VIDEO" | "FILE" | "VOICE" | "SYSTEM";
export type MessageStatus = "SENDING" | "SENT" | "DELIVERED" | "READ" | "FAILED";

export interface ConversationMember {
  id: string; // The membership ID
  userId: string;
  conversationId: string;
  role: "CLIENT" | "ARTISAN" | "ADMIN" | "SYSTEM";
  joinedAt: string;
  lastReadMessageId?: string; // Track read state by message ID
  settings: {
    muted: boolean;
    notifications: "ALL" | "MENTIONS" | "NONE";
  };
}

export interface Conversation {
  id: string;
  context: ConversationContext;
  contextReferenceId: string; // e.g. Job ID or Contract ID
  status: ConversationStatus;
  createdAt: string;
  updatedAt: string;
  metadata: {
    title?: string;
    lastMessageAt?: string;
    lastMessagePreview?: string;
    unreadCount: number;
  };
  members: ConversationMember[];
}

export interface MessageActions {
  editedAt?: string;
  deletedAt?: string;
  replyToId?: string;
  isPinned?: boolean;
  reactions?: Record<string, string[]>; // Emoji -> Array of User IDs
}

export interface Attachment {
  id: string;
  messageId: string;
  url: string;
  mimeType: string;
  fileName: string;
  sizeBytes: number;
  thumbnailUrl?: string;
  uploadStatus?: "UPLOADING" | "COMPLETED" | "FAILED";
}

export interface BaseMessage {
  id: string;
  conversationId: string;
  createdAt: string;
  type: MessageType;
}

export interface UserMessage extends BaseMessage {
  type: "TEXT" | "IMAGE" | "VIDEO" | "FILE" | "VOICE";
  senderId: string;
  content: string;
  status: MessageStatus;
  actions: MessageActions;
  attachments?: Attachment[];
}

export interface SystemEvent extends BaseMessage {
  type: "SYSTEM";
  eventType: "PAYMENT_EVENT" | "DELIVERABLE_EVENT" | "CONTRACT_EVENT" | "MILESTONE_EVENT";
  content: string;
  eventMetadata?: Record<string, any>;
}

export type Message = UserMessage | SystemEvent;

// Ephemeral / Real-time Types

export type OnlineStatus = "ONLINE" | "OFFLINE" | "LAST_SEEN" | "DO_NOT_DISTURB";

export interface ParticipantPresence {
  userId: string;
  status: OnlineStatus;
  lastSeenAt?: string;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  startedAt: string;
}

// WebSocket Events
export interface ServerToClientEvents {
  "message:created": (message: Message) => void;
  "message:updated": (message: Message) => void;
  "message:deleted": (messageId: string) => void;
  "typing:started": (indicator: TypingIndicator) => void;
  "typing:stopped": (indicator: Omit<TypingIndicator, "startedAt">) => void;
  "presence:updated": (presence: ParticipantPresence) => void;
  "conversation:updated": (conversation: Conversation) => void;
}

export interface ClientToServerEvents {
  "message:send": (payload: { conversationId: string; content: string; type: MessageType; tempId: string }) => void;
  "typing:start": (conversationId: string) => void;
  "typing:stop": (conversationId: string) => void;
  "message:read": (payload: { conversationId: string; messageId: string }) => void;
}
