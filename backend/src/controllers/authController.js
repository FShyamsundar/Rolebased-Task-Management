import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";
import { sendSuccess } from "../utils/apiResponse.js";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  department: user.department,
  avatar: user.avatar,
  permissions: user.permissions,
  manager: user.manager,
  createdAt: user.createdAt
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, department, manager } = req.validated.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("A user with this email already exists.");
    error.statusCode = 409;
    throw error;
  }

  if (manager) {
    const managerUser = await User.findById(manager).select("_id role isActive");

    if (!managerUser || managerUser.role !== "manager" || !managerUser.isActive) {
      const error = new Error("Selected manager is not available.");
      error.statusCode = 400;
      throw error;
    }
  }

  const user = await User.create({
    name,
    email,
    password,
    role: "employee",
    department: department || "Operations",
    manager: manager || null
  });

  const token = generateToken(user._id, user.role);
  sendSuccess(
    res,
    {
      token,
      user: sanitizeUser(user)
    },
    "Registration successful.",
    201
  );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = generateToken(user._id, user.role);
  sendSuccess(res, { token, user: sanitizeUser(user) }, "Login successful.");
});

export const logout = asyncHandler(async (_req, res) => {
  sendSuccess(res, {}, "Logout successful.");
});

export const getMe = asyncHandler(async (req, res) => {
  sendSuccess(res, { user: sanitizeUser(req.user) }, "Profile fetched.");
});

export const getPublicManagers = asyncHandler(async (_req, res) => {
  const managers = await User.find({ role: "manager", isActive: true })
    .select("_id name email department")
    .sort({ name: 1 });

  sendSuccess(res, { managers }, "Managers fetched.");
});
