import express from "express";
import { protect, coordinatorOnly } from "../middleware/authMiddleware.js";
import {
  getTodayClasses,
  markAttendance,
  getAllAttendance,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.use(protect, coordinatorOnly);
router.get("/today", getTodayClasses);
router.post("/mark", markAttendance);
router.get("/", getAllAttendance);

export default router;
