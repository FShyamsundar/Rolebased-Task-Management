import { z } from "zod";

const objectIdMessage = "A valid resource id is required.";

export const taskBodySchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(1000),
  priority: z.enum(["low", "medium", "high", "critical"]),
  status: z.enum(["pending", "in-progress", "completed", "overdue"]).optional(),
  dueDate: z.string().datetime().or(z.string().min(10)),
  assignedTo: z.string().min(24, objectIdMessage),
  tags: z.array(z.string().min(1).max(24)).optional(),
  attachments: z
    .array(
      z.object({
        name: z.string().min(1),
        url: z.string().url()
      })
    )
    .optional(),
  comment: z.string().max(300).optional()
});

export const createTaskSchema = z.object({
  body: taskBodySchema,
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const updateTaskSchema = z.object({
  body: taskBodySchema.partial().extend({
    comments: z
      .array(
        z.object({
          message: z.string().min(1).max(300)
        })
      )
      .optional()
  }),
  params: z.object({
    id: z.string().min(24, objectIdMessage)
  }),
  query: z.object({}).optional()
});
