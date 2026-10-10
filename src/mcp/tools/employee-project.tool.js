import { z } from "zod";
import { EmployeeService } from "../../services/employee.service.js";

export const registerEmployeeProjectTool = (mcpServer) => {
  const employeeService = new EmployeeService();

  mcpServer.registerTool(
    "get_employee_project",
    {
      title: "Get Employee Project",

      description: "Get the project currently assigned to an employee.",

      inputSchema: {
        employeeId: z
          .string()
          .describe("Unique employee ID, for example EMP001"),
      },
    },

    async ({ employeeId }) => {
      try {
        const employee = await employeeService.getEmployee(employeeId);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                employeeId: employee.employeeId,
                name: employee.name,
                project: employee.project,
              }),
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
