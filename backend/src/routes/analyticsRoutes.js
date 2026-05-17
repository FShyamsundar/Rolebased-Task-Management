import { Router } from "express";
import {
  getDashboardAnalytics,
  getProductivityAnalytics
} from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/dashboard", getDashboardAnalytics);
router.get("/productivity", getProductivityAnalytics);

export default router;
