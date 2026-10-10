import { z } from "zod";
import { KnowledgeService } from "../../services/knowledge.service.js";

export const registerKnowledgeSearchTool = (mcpServer) => {
  const knowledgeService = new KnowledgeService();

  mcpServer.registerTool(
    "search_knowledge_base",
    {
      title: "Search Knowledge Base",

      description:
        "Search the company knowledge base for policies, procedures, and workplace information.",

      inputSchema: {
        query: z
          .string()
          .describe(
            "Search query such as annual leave policy or work from home",
          ),
      },
    },

    async ({ query }) => {
      try {
        const results = await knowledgeService.searchKnowledge(query);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(results),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: error.message,
            },
          ],
          isError: true,
        };
      }
    },
  );
};
