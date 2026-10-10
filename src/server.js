import app, { configureChatRoutes } from "./app.js";
import { database } from "./config/database.js";
import { McpConnection } from "./client/mcp-connection.js";
import { AgentService } from "./services/agent.service.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  let mcpConnection;

  try {
    await database.connect();

    mcpConnection = new McpConnection();

    const agentService = new AgentService(mcpConnection);
    await agentService.initialize();

    configureChatRoutes(agentService);

    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    const shutdown = async () => {
      server.close();

      try {
        await mcpConnection.disconnect();
      } finally {
        process.exit(0);
      }
    };

    process.once("SIGINT", shutdown);
    process.once("SIGTERM", shutdown);
  } catch (error) {
    console.error("Failed to start server:", error);

    if (mcpConnection) {
      await mcpConnection.disconnect().catch(() => {});
    }

    process.exit(1);
  }
};

startServer();
