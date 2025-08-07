// src/components/conversations/MessageList.tsx
import React from "react";
import MessageBubble from "./MessageBubble";
import type { Message } from "../../types";

interface MessageListProps {
  messages: Message[];
  loading: boolean;
  error: string | null;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  selectedConversation: any; // Replace with proper type
}
// src/components/conversations/MessageList.tsx
const MessageList: React.FC<MessageListProps> = ({
  messages,
  loading,
  error,
  messagesEndRef,
  selectedConversation,
}) => {
  return (
    <div className="message-container">
      <div className="messages-scroll-area p-3">
        {selectedConversation ? (
          <>
            {loading && messages.length === 0 ? (
              <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading messages...</span>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="d-flex flex-column align-items-center justify-content-center h-100 py-5">
                <i
                  className="bi bi-chat-left-text text-muted"
                  style={{ fontSize: "3rem" }}
                ></i>
                <p className="text-muted mt-3">
                  Start the conversation by typing a message below
                </p>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </>
        ) : (
          <div className="d-flex flex-column align-items-center justify-content-center h-100 py-5">
            <i
              className="bi bi-chat-left-text text-muted"
              style={{ fontSize: "3rem" }}
            ></i>
            <h4 className="mt-3">Select a conversation</h4>
            <p className="text-muted">
              Choose an existing conversation or start a new one
            </p>
          </div>
        )}

        {error && (
          <div
            className="alert alert-danger alert-dismissible fade show m-3"
            role="alert"
          >
            {error}
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
            ></button>
          </div>
        )}
      </div>
    </div>
  );
};
export default MessageList;
