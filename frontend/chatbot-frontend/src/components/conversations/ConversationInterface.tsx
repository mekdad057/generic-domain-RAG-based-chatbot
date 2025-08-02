// src/components/conversations/ConversationInterface.tsx
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import ConversationLayout from "./ConversationLayout";
import { useConversations, useMessages } from "../../hooks";
import type { Conversation } from "../../types";
import "../../styles/conversation.css";

const ConversationInterface: React.FC = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const {
    conversations,
    loading: loadingConversations,
    error: conversationError,
    deletingConversationId,
    createNewConversation,
    onEditConversationTitle,
    deleteConversation,
  } = useConversations();

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const {
    messages,
    loading: loadingMessages,
    error: messageError,
    sendMessage,
    messagesEndRef,
  } = useMessages(selectedConversation?.id || null);

  // Select first conversation if none selected
  React.useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleCreateNewConversation = async () => {
    try {
      const newConversation = await createNewConversation(
        `Conversation ${new Date().toLocaleDateString()}`
      );
      setSelectedConversation(newConversation);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleSendMessage = async (content: string) => {
    try {
      await sendMessage(content);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleDeleteConversation = async (conversationId: number) => {
    try {
      await deleteConversation(conversationId);

      // If the deleted conversation was selected, select the first one if available
      if (selectedConversation?.id === conversationId) {
        if (conversations.length > 1) {
          // Find the next conversation (excluding the deleted one)
          const remainingConversations = conversations.filter(
            (c) => c.id !== conversationId
          );
          setSelectedConversation(remainingConversations[0]);
        } else {
          setSelectedConversation(null);
        }
      }
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  // Loading state while auth is resolving
  if (authLoading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated - should not happen due to PrivateRoute
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-100">
      <ConversationLayout
        conversations={conversations}
        selectedConversation={selectedConversation}
        onSelectConversation={handleSelectConversation}
        onCreateNewConversation={handleCreateNewConversation}
        onDeleteConversation={handleDeleteConversation}
        onEditConversation={onEditConversationTitle}
        messages={messages}
        onSendMessage={handleSendMessage}
        loadingConversations={loadingConversations}
        loadingMessages={loadingMessages}
        conversationError={conversationError}
        messageError={messageError}
        messagesEndRef={messagesEndRef}
        deletingConversationId={deletingConversationId}
      />
    </div>
  );
};

export default ConversationInterface;
