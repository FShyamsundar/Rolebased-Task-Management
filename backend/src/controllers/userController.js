import { User } from "../models/User.js";
import { Task } from "../models/Task.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createPaginationMeta, sendSuccess } from "../utils/apiResponse.js";

export const getUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || "";
  const role = req.query.role || "";

  const query = {};

  if (search) {
    query.$and = [
      {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ]
      }
    ];
  }

  if (role) {
    query.role = role;
  }

  if (req.user.role === "manager") {
    query.$and = [...(query.$and || []), { $or: [{ manager: req.user._id }, { _id: req.user._id }] }];
  }

  const [users, total] = await Promise.all([
    User.find(query)
      .select("-password")
      .populate("manager", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(query)
  ]);

  sendSuccess(
    res,
    {
      users,
      meta: createPaginationMeta({ total, page, limit })
    },
    "Users fetched."
  );
});

export const createUser = asyncHandler(async (req, res) => {
  const payload = req.validated.body;

  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    const error = new Error("User already exists.");
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({
    ...payload,
    manager: payload.role === "employee" ? payload.manager || null : null
  });

  sendSuccess(res, { user: await User.findById(user._id).select("-password") }, "User created successfully.", 201);
});

export const updateUser = asyncHandler(async (req, res) => {
  const payload = { ...req.validated.body };

  if (payload.role === "manager") {
    payload.manager = null;
  }

  const user = await User.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true
  })
    .select("-password")
    .populate("manager", "name email role");

  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  if (payload.role === "manager") {
    await User.updateMany({ manager: user._id }, { $set: { manager: null } });
  }

  sendSuccess(res, { user }, "User updated.");
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  if (user.role === "manager") {
    await User.updateMany({ manager: user._id }, { $set: { manager: null } });
  }

  await Task.deleteMany({
    $or: [{ assignedBy: user._id }, { assignedTo: user._id }]
  });
  await user.deleteOne();

  sendSuccess(res, {}, "User deleted.");
});
