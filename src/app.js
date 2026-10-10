import express from "express";
import cors from "cors";

import employeeRoutes from "./routes/employee.routes.js";
import knowledgeRoutes from "./routes/knowledge.routes.js";
import createChatRoutes from "./routes/chat.routes.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5175"],
  }),
);

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Employee MCP API is running",
  });
});

app.use("/api/employees", employeeRoutes);
app.use("/api/knowledge", knowledgeRoutes);

export const configureChatRoutes = (agentService) => {
  app.use("/api/chat", createChatRoutes(agentService));
};

export default app;
