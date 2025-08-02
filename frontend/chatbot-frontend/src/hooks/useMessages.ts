// src/hooks/useMessages.ts
import { useState, useEffect, useRef } from "react";
import conversationService from "../services/conversationService";
import type { Message } from "../types";

export const useMessages = (conversationId: number | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * Load messages for the current conversation
   */
  const loadMessages = async () => {
    if (!conversationId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await conversationService.getMessages(conversationId);
      setMessages(data);
    } catch (err) {
      setError("Failed to load messages");
      console.error("Message load error:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Send a new message and handle response
   * @param content - Message content
   * @returns Promise resolving to created message
   */
  const sendMessage = async (content: string): Promise<Message> => {
  if (!conversationId) {
    throw new Error('No conversation selected');
  }
  
  try {
    setLoading(true);
    setError(null);
    
    // Optimistic update - add user message immediately
    const userMessage: Message = {
      id: Date.now(),
      conversation: conversationId,
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Send to API
    const response = await conversationService.sendMessage(conversationId, content);
    
    // CORRECTED: Add assistant response (don't remove user message)
    setMessages(prev => [...prev, response]);
    
    return response;
  } catch (err) {
    setError('Failed to send message');
    console.error('Message send error:', err);
    // Remove the optimistic message on error
    setMessages(prev => prev.slice(0, -1));
    throw err;
  } finally {
    setLoading(false);
  }
};

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load messages when conversation changes
  useEffect(() => {
    if (conversationId) {
      loadMessages();
    }
  }, [conversationId]);

  return {
    messages,
    loading,
    error,
    loadMessages,
    sendMessage,
    messagesEndRef,
  };
};
