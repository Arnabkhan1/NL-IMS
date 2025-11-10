import express from "express";
import {
  createRoadmap,
  getAllRoadmaps,
  getStudentRoadmap,
  updateMilestone,
} from "../controllers/roadmapController.js";
import { protect, coordinatorOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, coordinatorOnly, createRoadmap);
router.get("/", protect, coordinatorOnly, getAllRoadmaps);
router.get("/:studentId", protect, getStudentRoadmap);
router.put("/:roadmapId/milestone/:milestoneIndex", protect, coordinatorOnly, updateMilestone);

export default router;
