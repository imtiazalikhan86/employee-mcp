import { KnowledgeService } from "../services/knowledge.service.js";

export class KnowledgeController {
  constructor() {
    this.knowledgeService = new KnowledgeService();
  }

  createKnowledge = async (req, res) => {
    try {
      const knowledge = await this.knowledgeService.createKnowledge(req.body);

      res.status(201).json({
        success: true,
        data: knowledge,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  searchKnowledge = async (req, res) => {
    try {
      const results = await this.knowledgeService.searchKnowledge(req.query.q);

      res.json({
        success: true,
        data: results,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  getAllKnowledge = async (req, res) => {
    try {
      const results = await this.knowledgeService.getAllKnowledge();

      res.json({
        success: true,
        data: results,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
}
