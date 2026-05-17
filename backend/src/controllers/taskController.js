import { Task } from "../models/Task.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createPaginationMeta, sendSuccess } from "../utils/apiResponse.js";

const getManagerEmployeeIds = async (managerId) => {
  const employees = await User.find({ manager: managerId, role: "employee" }).select("_id");
  return employees.map((employee) => employee._id);
};

const buildTaskQuery = async (req) => {
  const { search, status, priority, assignedTo, sortBy = "dueDate", sortOrder = "asc" } = req.query;
  const query = {};

  if (search) {
    query.$text = { $search: search };
  }

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (assignedTo) query.assignedTo = assignedTo;

  if (req.user.role === "employee") {
    query.assignedTo = req.user._id;
  }

  if (req.user.role === "manager") {
    const employeeIds = await getManagerEmployeeIds(req.user._id);
    query.$or = [{ assignedBy: req.user._id }, { assignedTo: { $in: employeeIds } }];
  }

  return {
    query,
    sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 }
  };
};

export const getTasks = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const { query, sort } = await buildTaskQuery(req);

  const [tasks, total] = await Promise.all([
    Task.find(query)
      .populate("assignedBy", "name role")
      .populate("assignedTo", "name role department")
      .populate("comments.author", "name role")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Task.countDocuments(query)
  ]);

  sendSuccess(
    res,
    {
      tasks,
      meta: createPaginationMeta({ total, page, limit })
    },
    "Tasks fetched."
  );
});

export const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate("assignedBy", "name email role")
    .populate("assignedTo", "name email role department manager")
    .populate("comments.author", "name role");

  if (!task) {
    const error = new Error("Task not found.");
    error.statusCode = 404;
    throw error;
  }

  if (
    req.user.role === "employee" &&
    String(task.assignedTo._id) !== String(req.user._id)
  ) {
    const error = new Error("Not allowed to view this task.");
    error.statusCode = 403;
    throw error;
  }

  if (req.user.role === "manager") {
    const isOwnTask = String(task.assignedBy._id) === String(req.user._id);
    const isManagersEmployee = String(task.assignedTo?.manager) === String(req.user._id);

    if (!isOwnTask && !isManagersEmployee) {
      const error = new Error("Not allowed to view this task.");
      error.statusCode = 403;
      throw error;
    }
  }

  sendSuccess(res, { task }, "Task fetched.");
});

export const createTask = asyncHandler(async (req, res) => {
  const { assignedTo, comment, ...payload } = req.validated.body;
  const assignee = await User.findById(assignedTo).select("_id role manager");

  if (!assignee) {
    const error = new Error("Assigned employee not found.");
    error.statusCode = 404;
    throw error;
  }

  if (assignee.role !== "employee") {
    const error = new Error("Tasks can only be assigned to employees.");
    error.statusCode = 400;
    throw error;
  }

  if (req.user.role === "manager" && String(assignee.manager) !== String(req.user._id)) {
    const error = new Error("Managers can only assign tasks to their own team.");
    error.statusCode = 403;
    throw error;
  }

  const task = await Task.create({
    ...payload,
    assignedTo,
    assignedBy: req.user._id,
    comments: comment ? [{ message: comment, author: req.user._id }] : []
  });

  const populatedTask = await Task.findById(task._id)
    .populate("assignedBy", "name role")
    .populate("assignedTo", "name role");

  sendSuccess(res, { task: populatedTask }, "Task created.", 201);
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    const error = new Error("Task not found.");
    error.statusCode = 404;
    throw error;
  }

  const assignedEmployee = await User.findById(task.assignedTo).select("_id manager");
  const isManagersTeamTask =
    req.user.role === "manager" && String(assignedEmployee?.manager) === String(req.user._id);
  const isEmployeeOwnTask =
    req.user.role === "employee" && String(task.assignedTo) === String(req.user._id);
  const canManage =
    req.user.role === "admin" ||
    String(task.assignedBy) === String(req.user._id) ||
    isManagersTeamTask ||
    isEmployeeOwnTask;

  if (!canManage) {
    const error = new Error("Not allowed to update this task.");
    error.statusCode = 403;
    throw error;
  }

  const updatePayload = { ...req.validated.body };
  const previousAssignee = String(task.assignedTo);
  const { comment } = updatePayload;

  delete updatePayload.comment;

  if (req.user.role === "employee") {
    const requestedKeys = Object.keys(updatePayload);
    const hasOnlyAllowedFields = requestedKeys.every((key) => ["status", "comments"].includes(key));

    if (!hasOnlyAllowedFields || (updatePayload.status && updatePayload.status !== "completed")) {
      const error = new Error("Employees can only mark their assigned tasks as completed.");
      error.statusCode = 403;
      throw error;
    }
  }

  if (req.user.role === "manager" && updatePayload.assignedTo) {
    const nextAssignee = await User.findById(updatePayload.assignedTo).select("_id role manager");

    if (!nextAssignee || nextAssignee.role !== "employee") {
      const error = new Error("Tasks can only be assigned to employees.");
      error.statusCode = 400;
      throw error;
    }

    if (String(nextAssignee.manager) !== String(req.user._id)) {
      const error = new Error("Managers can only reassign tasks within their own team.");
      error.statusCode = 403;
      throw error;
    }
  }

  if (comment) {
    task.comments.push({
      message: comment,
      author: req.user._id
    });
  }

  if (Array.isArray(updatePayload.comments)) {
    task.comments.push(
      ...updatePayload.comments.map((item) => ({
        message: item.message,
        author: req.user._id
      }))
    );
    delete updatePayload.comments;
  }

  if (
    updatePayload.assignedTo &&
    String(updatePayload.assignedTo) !== previousAssignee &&
    task.status === "completed"
  ) {
    updatePayload.status = "pending";
  }

  Object.assign(task, updatePayload);

  if (task.status !== "completed" && new Date(task.dueDate) < new Date()) {
    task.status = "overdue";
  }

  await task.save();

  const updatedTask = await Task.findById(task._id)
    .populate("assignedBy", "name role")
    .populate("assignedTo", "name role")
    .populate("comments.author", "name role");

  sendSuccess(res, { task: updatedTask }, "Task updated.");
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    const error = new Error("Task not found.");
    error.statusCode = 404;
    throw error;
  }

  if (req.user.role === "manager") {
    const assignee = await User.findById(task.assignedTo).select("_id manager");
    const canDelete =
      String(task.assignedBy) === String(req.user._id) || String(assignee?.manager) === String(req.user._id);

    if (!canDelete) {
      const error = new Error("Managers can only delete tasks from their own team.");
      error.statusCode = 403;
      throw error;
    }
  }

  await task.deleteOne();
  sendSuccess(res, {}, "Task deleted.");
});
