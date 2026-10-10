import express from "express";
import { KnowledgeController } from "../controllers/knowledge.controller.js";

const router = express.Router();

const knowledgeController = new KnowledgeController();

router.post("/", knowledgeController.createKnowledge);

router.get("/", knowledgeController.getAllKnowledge);

router.get("/search", knowledgeController.searchKnowledge);

export default router;
