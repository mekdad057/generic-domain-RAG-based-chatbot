// src/components/conversations/MessageBubble.tsx
import React from "react";
import type { Message } from "../../types";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  return (
    <div
      className={`d-flex mb-3 ${
        message.role === "user"
          ? "justify-content-end"
          : "justify-content-start"
      }`}
    >
      <div
        className={`message-bubble p-3 rounded ${
          message.role === "user" ? "user" : "assistant"
        }`}
      >
        {message.content}
        <div className="mt-1">
          <small className="opacity-75">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </small>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
