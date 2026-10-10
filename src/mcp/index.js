import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { createMcpServer } from "./mcp.server.js";

import { registerEmployeeLeaveTool } from "./tools/employee-leave.tool.js";
import { registerEmployeeProjectTool } from "./tools/employee-project.tool.js";
import {
  registerKnowledgeSearchTool
} from "./tools/knowledge-search.tool.js";

import { database } from "../config/database.js";

const startMcpServer = async () => {
  try {
    await database.connect();

    const mcpServer = createMcpServer();

    registerEmployeeLeaveTool(mcpServer);
    registerEmployeeProjectTool(mcpServer);
    registerKnowledgeSearchTool(mcpServer);

    await serveStdio(() => mcpServer);

    console.error("Employee MCP server started");
  } catch (error) {
    console.error("Failed to start MCP server:", error);

    process.exit(1);
  }
};

startMcpServer();
