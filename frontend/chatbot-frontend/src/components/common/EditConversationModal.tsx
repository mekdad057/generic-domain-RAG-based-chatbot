// src/components/common/EditConversationModal.tsx
import React, { useState, useEffect } from "react";

interface EditConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
  initialTitle: string;
}

const EditConversationModal: React.FC<EditConversationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTitle,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle);
      setError(null);
    }
  }, [isOpen, initialTitle]);

  const validateTitle = (value: string): boolean => {
    if (value.trim().length === 0) {
      setError("Title must contain at least 1 character");
      return false;
    }

    if (value.length > 50) {
      setError(`Title cannot exceed 50 characters (current: ${value.length})`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);

    // Validate as user types
    if (isOpen) {
      validateTitle(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateTitle(title)) {
      onSave(title);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Conversation Title</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="conversationTitle" className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  className={`form-control ${error ? "is-invalid" : ""}`}
                  id="conversationTitle"
                  value={title}
                  onChange={handleTitleChange}
                  autoFocus
                  maxLength={50}
                  required
                />
                {error && (
                  <div className="invalid-feedback d-block">{error}</div>
                )}
                <div className="form-text text-muted">
                  {title.length}/50 characters
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!!error || !title.trim()}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditConversationModal;
