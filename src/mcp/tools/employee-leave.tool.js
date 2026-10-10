import { z } from "zod";
import { EmployeeService } from "../../services/employee.service.js";

export const registerEmployeeLeaveTool = (mcpServer) => {
  const employeeService = new EmployeeService();

  mcpServer.registerTool(
    "get_employee_leave_balance",
    {
      title: "Get Employee Leave Balance",

      description: "Get the remaining leave balance for an employee.",

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
                leaveBalance: employee.leaveBalance,
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
