import { OllamaClient } from "../api/ollama.client.js";

const MAX_TOOL_ROUNDS = 5;

export class AgentService {
  constructor(mcpConnection) {
    this.mcpConnection = mcpConnection;
    this.ollamaClient = new OllamaClient();
    this.conversations = new Map();
    this.ollamaTools = [];
  }

  async initialize() {
    const tools = await this.mcpConnection.connect();

    this.ollamaTools = tools.map((tool) => ({
      type: "function",
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.inputSchema,
      },
    }));
  }

  getConversation(sessionId) {
    if (!this.conversations.has(sessionId)) {
      this.conversations.set(sessionId, [
        {
          role: "system",
          content:
            "You are an employee support assistant. " +
            "Use the available tools for employee data and policies. " +
            "Never invent employee data or policy details. " +
            "Ask for an employee ID when it is required but missing. " +
            "Use tool results as the source of truth.",
        },
      ]);
    }

    return this.conversations.get(sessionId);
  }

  async ask(sessionId, question) {
    if (!this.ollamaTools.length) {
      throw new Error("Agent service has not been initialized");
    }

    if (typeof question !== "string" || !question.trim()) {
      throw new Error("Question is required");
    }

    const messages = this.getConversation(sessionId);

    messages.push({
      role: "user",
      content: question.trim(),
    });

    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const response = await this.ollamaClient.chat(messages, this.ollamaTools);

      const assistantMessage = response.message;
      messages.push(assistantMessage);

      const toolCalls = assistantMessage.tool_calls ?? [];

      if (toolCalls.length === 0) {
        return {
          sessionId,
          answer: assistantMessage.content,
        };
      }

      for (const toolCall of toolCalls) {
        const toolName = toolCall.function.name;
        const toolArguments = toolCall.function.arguments ?? {};

        try {
          const result = await this.mcpConnection.callTool(
            toolName,
            toolArguments,
          );

          const content = (result.content ?? [])
            .map((item) =>
              item.type === "text" ? item.text : JSON.stringify(item),
            )
            .join("\n");

          messages.push({
            role: "tool",
            tool_name: toolName,
            content: result.isError
              ? `Tool execution failed: ${content}`
              : content,
          });
        } catch (error) {
          messages.push({
            role: "tool",
            tool_name: toolName,
            content: JSON.stringify({
              error: error.message,
            }),
          });
        }
      }
    }

    const finalResponse = await this.ollamaClient.chat(
      [
        ...messages,
        {
          role: "system",
          content:
            "The tool-call limit has been reached. " +
            "Answer using the results already received. " +
            "Do not request additional tools or invent missing information.",
        },
      ],
      [],
    );

    messages.push(finalResponse.message);

    return {
      sessionId,
      answer: finalResponse.message.content,
    };
  }

  clearConversation(sessionId) {
    return this.conversations.delete(sessionId);
  }
}
