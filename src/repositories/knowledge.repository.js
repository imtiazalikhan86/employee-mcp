import { database } from "../config/database.js";

export class KnowledgeRepository {
  constructor() {
    this.collection = null;
  }

  getCollection() {
    if (!this.collection) {
      this.collection = database.getDb().collection("knowledge");
    }

    return this.collection;
  }

  async create(knowledge) {
    const result = await this.getCollection().insertOne(knowledge);

    return {
      ...knowledge,
      _id: result.insertedId,
    };
  }

  async search(query) {
    const regex = new RegExp(query, "i");

    return this.getCollection()
      .find({
        $or: [{ title: regex }, { content: regex }, { category: regex }],
      })
      .limit(10)
      .toArray();
  }

  async findAll() {
    return this.getCollection().find({}).toArray();
  }
}
