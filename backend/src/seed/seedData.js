import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { Task } from "../models/Task.js";

const seed = async () => {
  await connectDB();

  await Promise.all([User.deleteMany({}), Task.deleteMany({})]);

  const admin = await User.create({
    name: "System Admin",
    email: env.seedAdminEmail,
    password: env.seedAdminPassword,
    role: "admin",
    department: "Executive",
    permissions: ["manage-users", "manage-tasks", "view-analytics"]
  });

  const manager = await User.create({
    name: "Aarav Manager",
    email: "manager@taskflowhq.com",
    password: "Manager@123",
    role: "manager",
    department: "Engineering",
    permissions: ["create-tasks", "assign-tasks", "view-team-performance"]
  });

  const employeeOne = await User.create({
    name: "Riya Employee",
    email: "riya@taskflowhq.com",
    password: "Employee@123",
    role: "employee",
    department: "Engineering",
    manager: manager._id
  });

  const employeeTwo = await User.create({
    name: "Kabir Employee",
    email: "kabir@taskflowhq.com",
    password: "Employee@123",
    role: "employee",
    department: "Design",
    manager: manager._id
  });

  const employees = [employeeOne, employeeTwo];

  await Task.insertMany([
    {
      title: "Launch onboarding redesign",
      description: "Revamp the onboarding workflow with updated UI and metrics tracking.",
      priority: "high",
      status: "in-progress",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      assignedBy: manager._id,
      assignedTo: employees[0]._id,
      tags: ["frontend", "ux"],
      comments: [{ message: "Kickoff completed.", author: manager._id }]
    },
    {
      title: "Audit dashboard accessibility",
      description: "Review color contrast, keyboard navigation, and aria coverage.",
      priority: "medium",
      status: "pending",
      dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      assignedBy: manager._id,
      assignedTo: employees[1]._id,
      tags: ["a11y", "qa"]
    }
  ]);

  console.log("Seed completed", {
    admin: admin.email,
    manager: manager.email,
    employees: employees.map((employee) => employee.email)
  });

  await mongoose.connection.close();
};

seed().catch(async (error) => {
  console.error("Seed failed", error);
  await mongoose.connection.close();
  process.exit(1);
});
