// src/services/conversationService.ts
import api from "./api";
import type { Conversation, Message } from "../types";

const conversationService = {
  /**
   * Get all conversations for the current user
   * @returns Promise resolving to array of conversations
   */
  getConversations: async (): Promise<Conversation[]> => {
    const response = await api.get("/conversations/");
    return response.data;
  },

  /**
   * Create a new conversation with the provided title
   * @param title - Title for the new conversation
   * @returns Promise resolving to created conversation
   */
  createConversation: async (title: string): Promise<Conversation> => {
    const response = await api.post("/conversations/", { title });
    return response.data;
  },

  /**
   * Get messages for a specific conversation
   * @param conversationId - ID of the conversation
   * @returns Promise resolving to array of messages
   */
  getMessages: async (conversationId: number): Promise<Message[]> => {
    const response = await api.get(
      `/conversations/${conversationId}/messages/`
    );
    return response.data;
  },

  /**
   * Send a new message to a conversation
   * @param conversationId - ID of the conversation
   * @param content - Message content
   * @returns Promise resolving to created message
   */
  sendMessage: async (
    conversationId: number,
    content: string
  ): Promise<Message> => {
    const response = await api.post(
      `/conversations/${conversationId}/messages/`,
      { content }
    );
    return response.data;
  },

  /**
   * Delete a conversation
   * @param conversationId - ID of the conversation to delete
   * @returns Promise resolving when deletion is complete
   */
  deleteConversation: async (conversationId: number): Promise<void> => {
    await api.delete(`/conversations/${conversationId}/`);
  },

  updateConversationTitle: async (
    conversationId: number,
    title: string
  ): Promise<Conversation> => {
    // Client-side validation before making API call
    if (title.trim().length === 0) {
      throw new Error("Title must contain at least 1 character");
    }

    if (title.length > 50) {
      throw new Error(
        `Title cannot exceed 50 characters (current: ${title.length})`
      );
    }

    const response = await api.patch(`/conversations/${conversationId}/`, {
      title,
    });
    return response.data;
  },
};

export default conversationService;
