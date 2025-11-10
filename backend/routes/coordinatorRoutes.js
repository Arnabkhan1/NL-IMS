import express from "express";
import { protect, coordinatorOnly } from "../middleware/authMiddleware.js";
import User from "../models/userModel.js";
import { getCoordinatorStats } from "../controllers/coordinatorController.js";

const router = express.Router();

// ✅ Get all teachers (Coordinator access only)
router.get("/teachers", protect, coordinatorOnly, async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" }).select("name email mobile role");
    res.json(teachers);
  } catch (error) {
    console.error("Error loading teachers:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get all students (Coordinator access only)
router.get("/students", protect, coordinatorOnly, async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("name mobile role");
    res.json(students);
  } catch (error) {
    console.error("Error loading students:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/stats", protect, coordinatorOnly, getCoordinatorStats);

export default router;
