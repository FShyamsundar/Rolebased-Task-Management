import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import { createUserSchema, updateUserSchema } from "../validations/userValidation.js";

const router = Router();

router.use(protect);
router.get("/", authorize("admin", "manager"), getUsers);
router.post("/", authorize("admin"), validate(createUserSchema), createUser);
router.put("/:id", authorize("admin"), validate(updateUserSchema), updateUser);
router.delete("/:id", authorize("admin"), deleteUser);

export default router;
