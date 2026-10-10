export class Employee {
  constructor({
    employeeId,
    name,
    email,
    department,
    project,
    leaveBalance = 0
  }) {
    this.employeeId = employeeId;
    this.name = name;
    this.email = email;
    this.department = department;
    this.project = project;
    this.leaveBalance = leaveBalance;
  }
}