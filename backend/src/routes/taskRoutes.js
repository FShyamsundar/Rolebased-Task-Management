import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import { createTaskSchema, updateTaskSchema } from "../validations/taskValidation.js";

const router = Router();

router.use(protect);
router.get("/", getTasks);
router.post("/", authorize("admin", "manager"), validate(createTaskSchema), createTask);
router.get("/:id", getTaskById);
router.put("/:id", validate(updateTaskSchema), updateTask);
router.delete("/:id", authorize("admin", "manager"), deleteTask);

export default router;
