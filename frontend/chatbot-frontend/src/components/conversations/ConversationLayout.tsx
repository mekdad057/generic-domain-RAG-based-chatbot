// src/components/conversations/ConversationLayout.tsx
import React from "react";
import ConversationList from "./ConversationList";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import type { Conversation, Message } from "../../types";

interface ConversationLayoutProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onCreateNewConversation: () => void;
  messages: Message[];
  onSendMessage: (content: string) => void;
  loadingConversations: boolean;
  loadingMessages: boolean;
  conversationError: string | null;
  messageError: string | null;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onDeleteConversation: (conversationId: number) => void;
  onEditConversation: (conversationId: number, title: string) => void;
  deletingConversationId: number | null;
}

// src/components/conversations/ConversationLayout.tsx
const ConversationLayout: React.FC<ConversationLayoutProps> = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  onCreateNewConversation,
  messages,
  onSendMessage,
  loadingConversations,
  loadingMessages,
  messageError,
  messagesEndRef,
  onDeleteConversation,
  onEditConversation,
  deletingConversationId,
}) => {
  return (
    <div className="container-fluid py-4">
      <div className="row">
        {/* Conversation List - 30% width on larger screens */}
        <div className="col-md-4 col-lg-3 mb-4 mb-md-0">
          <ConversationList
            conversations={conversations}
            selectedConversationId={selectedConversation?.id || null}
            onSelectConversation={onSelectConversation}
            onCreateNew={onCreateNewConversation}
            onEditConversation={onEditConversation}
            onDeleteConversation={onDeleteConversation}
            loading={loadingConversations}
            deletingConversationId={deletingConversationId}
          />
        </div>

        {/* Message Area - 70% width on larger screens */}
        <div className="col-md-8 col-lg-9">
          <div className="card shadow-sm h-100 d-flex flex-column">
            {/* Message container with constrained height */}
            <div className="flex-grow-1 d-flex flex-column">
              <MessageList
                messages={messages}
                loading={loadingMessages}
                error={messageError}
                messagesEndRef={messagesEndRef}
                selectedConversation={selectedConversation}
              />
            </div>
            {selectedConversation && (
              <MessageInput
                onSendMessage={onSendMessage}
                disabled={!selectedConversation}
                loading={loadingMessages}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ConversationLayout;
