// src/components/conversations/MessageInput.tsx
import React, { useState } from "react";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled: boolean;
  loading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled,
  loading,
}) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim() || disabled) return;
    onSendMessage(newMessage);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="card-footer bg-white border-top-0">
      <div className="input-group">
        <textarea
          className="form-control"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          rows={3}
          disabled={disabled}
          style={{ resize: "none" }}
        ></textarea>
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleSendMessage}
          disabled={disabled || !newMessage.trim() || loading}
        >
          {loading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
            ></span>
          ) : (
            <i className="bi bi-send"></i>
          )}
        </button>
      </div>
      <small className="form-text text-muted mt-1">
        Press Enter to send, Shift+Enter for new line
      </small>
    </div>
  );
};

export default MessageInput;
