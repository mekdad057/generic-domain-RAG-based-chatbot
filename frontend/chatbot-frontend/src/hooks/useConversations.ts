// src/hooks/useConversations.ts
import { useState, useEffect } from "react";
import conversationService from "../services/conversationService";
import type { Conversation } from "../types";

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingConversationId, setDeletingConversationId] = useState<
    number | null
  >(null);

  /**
   * Load conversations from API
   */
  const loadConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await conversationService.getConversations();
      setConversations(data);
    } catch (err) {
      setError("Failed to load conversations");
      console.error("Conversation load error:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new conversation
   * @param title - Title for the new conversation
   * @returns Promise resolving to created conversation
   */
  const createNewConversation = async (
    title: string
  ): Promise<Conversation> => {
    try {
      setLoading(true);
      setError(null);
      const newConversation = await conversationService.createConversation(
        title
      );
      setConversations((prev) => [newConversation, ...prev]);
      return newConversation;
    } catch (err) {
      setError("Failed to create conversation");
      console.error("Conversation creation error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a conversation
   * @param conversationId - ID of the conversation to delete
   */
  const deleteConversation = async (conversationId: number) => {
    try {
      setDeletingConversationId(conversationId);
      setError(null);
      await conversationService.deleteConversation(conversationId);

      // Update local state by filtering out the deleted conversation
      setConversations((prev) =>
        prev.filter((conv) => conv.id !== conversationId)
      );
    } catch (err) {
      setError("Failed to delete conversation");
      console.error("Conversation deletion error:", err);
      throw err;
    } finally {
      setDeletingConversationId(null);
    }
  };
  const onEditConversationTitle = async (
    conversationId: number,
    newTitle: string
  ) => {
    try {
      await conversationService.updateConversationTitle(
        conversationId,
        newTitle
      );

      // Update local state by filtering out the deleted conversation
      setConversations((prev) =>
        prev.filter((conv) => conv.id !== conversationId)
      );
    } catch (err) {
      setError("Failed to delete conversation");
      console.error("Conversation deletion error:", err);
      throw err;
    } finally {
      setDeletingConversationId(null);
    }
  };
  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  return {
    conversations,
    loading,
    error,
    deletingConversationId,
    loadConversations,
    createNewConversation,
    deleteConversation,
    onEditConversationTitle,
  };
};
