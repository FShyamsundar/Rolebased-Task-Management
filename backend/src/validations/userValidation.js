import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, "Password must include upper, lower, and number."),
    role: z.enum(["manager", "employee"]),
    department: z.string().min(2).max(60),
    manager: z.string().min(24).optional(),
    permissions: z.array(z.string()).optional()
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80).optional(),
    department: z.string().min(2).max(60).optional(),
    role: z.enum(["manager", "employee"]).optional(),
    manager: z.string().min(24).nullable().optional(),
    permissions: z.array(z.string()).optional(),
    isActive: z.boolean().optional()
  }),
  params: z.object({
    id: z.string().min(24)
  }),
  query: z.object({}).optional()
});
