// src/components/conversations/ConversationItem.tsx
import React, { useState } from "react";
import ConfirmationModal from "../common/ConfirmationModal";
import EditConversationModal from "../common/EditConversationModal";
import type { Conversation } from "../../types";

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: (conversation: Conversation) => void;
  onDelete: (conversationId: number) => void;
  onEdit: (conversationId: number, title: string) => void;
  disabled?: boolean;
  isDeleting?: boolean;
}

const ConversationTitle: React.FC<{ title: string }> = ({ title }) => {
  // Truncate long titles with ellipsis
  const displayTitle =
    title.length > 40 ? `${title.substring(0, 37)}...` : title;
  return (
    <h6 className="mb-0 fw-bold" title={title}>
      {displayTitle}
    </h6>
  );
};

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isSelected,
  onSelect,
  onDelete,
  onEdit,
  disabled,
  isDeleting = false,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEditModal(true);
  };

  const confirmDelete = () => {
    onDelete(conversation.id);
    setShowDeleteModal(false);
  };

  const saveTitle = (title: string) => {
    onEdit(conversation.id, title);
    setShowEditModal(false);
  };

  return (
    <div
      className="position-relative"
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        className={`list-group-item list-group-item-action conversation-list-item d-flex align-items-center ${
          isSelected ? "active" : ""
        }`}
        onClick={() => onSelect(conversation)}
        disabled={disabled || isDeleting}
        style={{ width: "100%" }}
      >
        <div className="me-3">
          <i className="bi bi-chat-left-text fs-4"></i>
        </div>
        <div className="flex-grow-1 text-start">
          <ConversationTitle title={conversation.title} />
          <small className="text-muted">
            press conversation to open it.
          </small>
        </div>
        {isDeleting && (
          <div className="ms-2 spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Deleting...</span>
          </div>
        )}
      </button>

      {isHovered && !isDeleting && (
        <button
          className="position-absolute top-50 end-0 translate-middle-y me-6 btn btn-sm btn-link text-warning"
          onClick={handleEdit}
          disabled={disabled}
          title="Edit conversation title"
          style={{ zIndex: 10 }}
        >
          <i className="bi bi-pencil"></i>
        </button>
      )}

      {isHovered && !isDeleting && (
        <button
          className="position-absolute top-50 end-0 translate-middle-y me-3 btn btn-sm btn-link text-danger"
          onClick={handleDelete}
          disabled={disabled}
          title="Delete conversation"
          style={{ zIndex: 10 }}
        >
          <i className="bi bi-trash"></i>
        </button>
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Conversation"
        message={`Are you sure you want to delete "${conversation.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="delete"
      />

      <EditConversationModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={saveTitle}
        initialTitle={conversation.title}
      />
    </div>
  );
};

export default ConversationItem;
