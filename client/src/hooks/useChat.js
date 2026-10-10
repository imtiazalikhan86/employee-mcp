import { useState } from "react";
import { ChatApi } from "../api/chat.api";

const createSessionId = () =>
  `session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export function useChat() {
  const [sessionId, setSessionId] = useState(createSessionId);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm your Employee AI Assistant. Ask me about leave balances, projects, or company policies.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async (text) => {
    const question = text.trim();

    if (!question || isLoading) return;

    setError("");
    setIsLoading(true);

    setMessages((current) => [
      ...current,
      {
        id: `${Date.now()}-user`,
        role: "user",
        content: question,
      },
    ]);

    try {
      const result = await ChatApi.sendMessage(question, sessionId);

      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          content: result.answer,
        },
      ]);
    } catch (err) {
      setError(err.message || "Unable to contact the AI assistant.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    if (isLoading) return;

    try {
      await ChatApi.clearConversation(sessionId);
    } catch (err) {
      setError(err.message || "Unable to clear the conversation.");
      return;
    }

    setSessionId(createSessionId());
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content: "Chat cleared! What would you like to know?",
      },
    ]);
    setError("");
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  };
}
