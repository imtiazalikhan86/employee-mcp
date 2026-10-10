import { MongoClient } from "mongodb";
import "dotenv/config";

class Database {
  constructor() {
    this.client = new MongoClient(process.env.MONGODB_URI);
    this.db = null;
  }

  async connect() {
    await this.client.connect();

    this.db = this.client.db(process.env.MONGODB_DATABASE);

    console.error("MongoDB connected");
  }

  getDb() {
    if (!this.db) {
      throw new Error("Database is not connected");
    }

    return this.db;
  }

  async disconnect() {
    await this.client.close();
  }
}

export const database = new Database();
