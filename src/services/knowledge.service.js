import { KnowledgeRepository } from "../repositories/knowledge.repository.js";
import { Knowledge } from "../models/knowledge.model.js";

export class KnowledgeService {
  constructor() {
    this.knowledgeRepository = new KnowledgeRepository();
  }

  async createKnowledge(data) {
    const knowledge = new Knowledge(data);

    return this.knowledgeRepository.create(knowledge);
  }

  async searchKnowledge(query) {
    if (!query || !query.trim()) {
      throw new Error("Search query is required");
    }

    return this.knowledgeRepository.search(query.trim());
  }

  async getAllKnowledge() {
    return this.knowledgeRepository.findAll();
  }
}
