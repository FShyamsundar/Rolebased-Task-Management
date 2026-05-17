import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";

export const protect = async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("Not authorized. Missing token.");
    error.statusCode = 401;
    return next(error);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user || !user.isActive) {
      const error = new Error("User no longer has access.");
      error.statusCode = 401;
      return next(error);
    }

    req.user = user;
    next();
  } catch {
    const error = new Error("Token is invalid or expired.");
    error.statusCode = 401;
    next(error);
  }
};
