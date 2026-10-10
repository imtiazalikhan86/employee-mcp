import express from "express";
import { EmployeeController } from "../controllers/employee.controller.js";

const router = express.Router();

const employeeController = new EmployeeController();

router.post(
  "/",
  employeeController.createEmployee
);

router.get(
  "/",
  employeeController.getEmployees
);

router.get(
  "/:employeeId",
  employeeController.getEmployee
);

export default router;