import express from "express";
import { protect, coordinatorOnly } from "../middleware/authMiddleware.js";
import { getMentorStats } from "../controllers/mentorAnalysisController.js";
const router = express.Router();
router.get("/", protect, coordinatorOnly, getMentorStats);
export default router;
