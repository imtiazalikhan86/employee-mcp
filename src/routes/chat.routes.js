import { Router } from "express";
import { ChatController } from "../controllers/chat.controller.js";

const createChatRoutes = (agentService) => {
  const router = Router();
  const chatController = new ChatController(agentService);

  router.post("/", chatController.ask);
  router.delete("/session", chatController.clearConversation);

  return router;
};

export default createChatRoutes;
