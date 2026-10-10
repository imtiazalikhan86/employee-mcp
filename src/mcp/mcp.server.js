import { McpServer } from "@modelcontextprotocol/server";

export const createMcpServer = () => {
  return new McpServer({
    name: "employee-support-server",
    version: "1.0.0"
  });
};