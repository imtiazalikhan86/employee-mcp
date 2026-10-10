import { EmployeeService } from "../services/employee.service.js";

export class EmployeeController {
  constructor() {
    this.employeeService = new EmployeeService();
  }

  createEmployee = async (req, res) => {
    try {
      const employee =
        await this.employeeService.createEmployee(req.body);

      res.status(201).json({
        success: true,
        data: employee
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  getEmployee = async (req, res) => {
    try {
      const employee =
        await this.employeeService.getEmployee(
          req.params.employeeId
        );

      res.json({
        success: true,
        data: employee
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  };

  getEmployees = async (req, res) => {
    try {
      const employees =
        await this.employeeService.getEmployees();

      res.json({
        success: true,
        data: employees
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
}