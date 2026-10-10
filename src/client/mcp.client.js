import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";

import { OllamaClient } from "../api/ollama.client.js";

const conversationMessages = [
  {
    role: "system",
    content:
      "You are an employee support assistant. " +
      "Use available tools to answer questions about employee " +
      "leave balances, assigned projects, and company policies. " +
      "Never invent employee data or policy details. " +
      "If a required employee ID is missing, ask the user for it. " +
      "Use tool results as the source of truth. " +
      "Remember relevant details from earlier messages in this conversation.",
  },
];

const MAX_TOOL_ROUNDS = 5;

const mcpClient = new Client({
  name: "employee-ai-client",
  version: "1.0.0",
});

const transport = new StdioClientTransport({
  command: "node",
  args: ["src/mcp/index.js"],
});

const ollamaClient = new OllamaClient();

const convertMcpToolsToOllamaTools = (mcpTools) => {
  return mcpTools.map((tool) => ({
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.inputSchema,
    },
  }));
};

const executeToolCall = async (toolCall, availableTools) => {
  const toolName = toolCall.function.name;
  const toolArguments = toolCall.function.arguments ?? {};

  // Only allow tools discovered from our MCP server.
  const isAvailable = availableTools.some((tool) => tool.name === toolName);

  if (!isAvailable) {
    return {
      role: "tool",
      tool_name: toolName,
      content: JSON.stringify({
        error: `Unknown tool: ${toolName}`,
      }),
    };
  }

  console.log(`\n🔧 Executing MCP tool: ${toolName}`);
  console.log("Arguments:", toolArguments);

  try {
    const result = await mcpClient.callTool({
      name: toolName,
      arguments: toolArguments,
    });

    const content = (result.content ?? [])
      .map((item) => {
        if (item.type === "text") {
          return item.text;
        }

        return JSON.stringify(item);
      })
      .join("\n");

    return {
      role: "tool",
      tool_name: toolName,
      content: result.isError ? `Tool execution failed: ${content}` : content,
    };
  } catch (error) {
    return {
      role: "tool",
      tool_name: toolName,
      content: JSON.stringify({
        error: error.message,
      }),
    };
  }
};

const askAgent = async (question, ollamaTools, availableTools) => {
  conversationMessages.push({
    role: "user",
    content: question,
  });

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const response = await ollamaClient.chat(conversationMessages, ollamaTools);

    const assistantMessage = response.message;

    conversationMessages.push(assistantMessage);

    const toolCalls = assistantMessage.tool_calls ?? [];

    if (toolCalls.length === 0) {
      return assistantMessage.content;
    }

    console.log(`\n🤖 AI requested ${toolCalls.length} tool call(s).`);

    for (const toolCall of toolCalls) {
      const toolResultMessage = await executeToolCall(toolCall, availableTools);

      conversationMessages.push(toolResultMessage);
    }
  }

  const finalResponse = await ollamaClient.chat(
    [
      ...conversationMessages,
      {
        role: "system",
        content:
          "The tool-call limit has been reached. " +
          "Answer using the available results without requesting more tools.",
      },
    ],
    [],
  );

  conversationMessages.push(finalResponse.message);

  return finalResponse.message.content;
};

const startClient = async () => {
  const terminal = createInterface({
    input: stdin,
    output: stdout,
  });

  try {
    await mcpClient.connect(transport);

    console.log("✅ Connected to MCP server");

    const { tools } = await mcpClient.listTools();
    const ollamaTools = convertMcpToolsToOllamaTools(tools);

    console.log("\nAvailable tools:");
    tools.forEach((tool) => {
      console.log(`- ${tool.name}`);
    });

    console.log("\nEmployee AI Agent is ready.");
    console.log("Type 'exit' to stop.\n");

    while (true) {
      const question = (await terminal.question("You: ")).trim();

      if (!question) {
        continue;
      }

      if (["exit", "quit"].includes(question.toLowerCase())) {
        break;
      }

      try {
        const answer = await askAgent(question, ollamaTools, tools);

        console.log("\nAI:", answer, "\n");
      } catch (error) {
        console.error("\nAgent error:", error.message, "\n");
      }
    }
  } catch (error) {
    console.error("MCP Client Error:", error);
  } finally {
    terminal.close();

    try {
      await mcpClient.close();
    } catch (error) {
      console.error("Error closing MCP client:", error.message);
    }
  }
};

startClient();
