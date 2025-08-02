// src/components/conversations/ConversationList.tsx
import React from "react";
import ConversationItem from "./ConversationItem";
import type { Conversation } from "../../types";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: number | null;
  onSelectConversation: (conversation: Conversation) => void;
  onCreateNew: () => void;
  onDeleteConversation: (conversationId: number) => void;
  onEditConversation: (conversationId: number, newTitle: string) => void,
  loading: boolean;
  deletingConversationId: number | null;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onCreateNew,
  onDeleteConversation,
  onEditConversation,
  loading,
  deletingConversationId,
}) => {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Conversations</h5>
        <button
          className="btn btn-sm btn-primary new-conversation-btn"
          onClick={onCreateNew}
          disabled={loading}
          title="New Conversation"
        >
          <i className="bi bi-plus-lg"></i>
        </button>
      </div>
      <div
        className="list-group list-group-flush"
        style={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        {loading && conversations.length === 0 ? (
          <div className="list-group-item text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="list-group-item text-center py-4 text-muted">
            No conversations yet
          </div>
        ) : (
          conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isSelected={selectedConversationId === conversation.id}
              onSelect={onSelectConversation}
              onDelete={onDeleteConversation}
              onEdit={onEditConversation}
              disabled={loading}
              isDeleting={deletingConversationId === conversation.id}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;
