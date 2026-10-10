import { database } from "../config/database.js";

export class EmployeeRepository {
  constructor() {
    this.collection = null;
  }

  getCollection() {
    if (!this.collection) {
      this.collection = database
        .getDb()
        .collection("employees");
    }

    return this.collection;
  }

  async create(employee) {
    const result = await this.getCollection().insertOne(employee);

    return {
      ...employee,
      _id: result.insertedId
    };
  }

  async findByEmployeeId(employeeId) {
    return this.getCollection().findOne({
      employeeId
    });
  }

  async findAll() {
    return this.getCollection().find({}).toArray();
  }
}