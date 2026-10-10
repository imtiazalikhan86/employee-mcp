import { EmployeeRepository } from "../repositories/employee.repository.js";
import { Employee } from "../models/employee.model.js";

export class EmployeeService {
  constructor() {
    this.employeeRepository = new EmployeeRepository();
  }

  async createEmployee(data) {
    const existingEmployee =
      await this.employeeRepository.findByEmployeeId(
        data.employeeId
      );

    if (existingEmployee) {
      throw new Error("Employee already exists");
    }

    const employee = new Employee(data);

    return this.employeeRepository.create(employee);
  }

  async getEmployee(employeeId) {
    const employee =
      await this.employeeRepository.findByEmployeeId(
        employeeId
      );

    if (!employee) {
      throw new Error("Employee not found");
    }

    return employee;
  }

  async getEmployees() {
    return this.employeeRepository.findAll();
  }
}