export class ChatController {
  constructor(agentService) {
    this.agentService = agentService;

    this.ask = this.ask.bind(this);
    this.clearConversation = this.clearConversation.bind(this);
  }

  async ask(req, res) {
    try {
      const { question, sessionId = "default" } = req.body;

      if (typeof question !== "string" || !question.trim()) {
        return res.status(400).json({
          success: false,
          message: "A valid question is required",
        });
      }

      const result = await this.agentService.ask(sessionId, question.trim());

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Chat request failed:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to process your question",
      });
    }
  }

  async clearConversation(req, res) {
    try {
      const { sessionId } = req.body;

      if (typeof sessionId !== "string" || !sessionId.trim()) {
        return res.status(400).json({
          success: false,
          message: "A valid sessionId is required",
        });
      }

      const cleared = this.agentService.clearConversation(sessionId);

      return res.status(200).json({
        success: true,
        data: { cleared },
      });
    } catch (error) {
      console.error("Clear conversation failed:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to clear conversation",
      });
    }
  }
}
