import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  addHomework,
  getTeacherHomework,
} from "../controllers/teacherController.js";

const router = express.Router();

// 🧠 Homework APIs
router.post("/homework", protect, authorize("teacher"), addHomework);
router.get("/homework", protect, authorize("teacher"), getTeacherHomework);

export default router;
