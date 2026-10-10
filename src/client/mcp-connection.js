import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";

export class McpConnection {
  constructor() {
    this.client = new Client({
      name: "employee-ai-backend",
      version: "1.0.0",
    });

    this.transport = new StdioClientTransport({
      command: "node",
      args: ["src/mcp/index.js"],
    });

    this.tools = [];
    this.connected = false;
  }

  async connect() {
    if (this.connected) {
      return this.tools;
    }

    await this.client.connect(this.transport);

    const result = await this.client.listTools();

    this.tools = result.tools;
    this.connected = true;

    console.log("MCP client connected. Tools:", this.tools.length);

    return this.tools;
  }

  async callTool(name, args) {
    if (!this.connected) {
      throw new Error("MCP client is not connected");
    }

    const isAvailable = this.tools.some((tool) => tool.name === name);

    if (!isAvailable) {
      throw new Error(`Unknown MCP tool: ${name}`);
    }

    return this.client.callTool({
      name,
      arguments: args,
    });
  }

  async disconnect() {
    if (!this.connected) {
      return;
    }

    await this.client.close();
    this.connected = false;
    this.tools = [];
  }
}
