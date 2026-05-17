import mongoose from "mongoose";
import { Task } from "../models/Task.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const role = req.user.role;
  const matchStage =
    role === "employee"
      ? { assignedTo: req.user._id }
      : role === "manager"
        ? { $or: [{ assignedBy: req.user._id }, { assignedTo: req.user._id }] }
        : {};

  const [taskSummary, userSummary, recentTasks] = await Promise.all([
    Task.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]),
    role === "admin"
      ? User.aggregate([
          {
            $group: {
              _id: "$role",
              count: { $sum: 1 }
            }
          }
        ])
      : Promise.resolve([]),
    Task.find(matchStage)
      .populate("assignedBy", "name")
      .populate("assignedTo", "name")
      .sort({ updatedAt: -1 })
      .limit(5)
  ]);

  const totalTasks = taskSummary.reduce((sum, item) => sum + item.count, 0);
  const completedTasks = taskSummary.find((item) => item._id === "completed")?.count || 0;

  sendSuccess(res, {
    analytics: {
      totalTasks,
      completedTasks,
      completionRate: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0,
      statusBreakdown: taskSummary,
      roleBreakdown: userSummary,
      recentTasks
    }
  });
});

export const getProductivityAnalytics = asyncHandler(async (req, res) => {
  const baseMatch =
    req.user.role === "employee"
      ? { assignedTo: new mongoose.Types.ObjectId(req.user._id) }
      : req.user.role === "manager"
        ? { assignedBy: new mongoose.Types.ObjectId(req.user._id) }
        : {};

  const productivity = await Task.aggregate([
    { $match: baseMatch },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          status: "$status"
        },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        month: "$_id.month",
        status: "$_id.status",
        count: 1
      }
    },
    { $sort: { month: 1 } }
  ]);

  sendSuccess(res, { productivity }, "Productivity analytics fetched.");
});
