import express from "express";
import { protect, coordinatorOnly } from "../middleware/authMiddleware.js";
import {
  createTeachingRecord,
  getAllTeachingRecords,
  updateTeachingRecord,
  deleteTeachingRecord,
  getTeachingAnalytics,
} from "../controllers/teachingRecordController.js";

const router = express.Router();

router.use(protect, coordinatorOnly);

router.post("/", createTeachingRecord);
router.get("/", getAllTeachingRecords);
router.put("/:id", updateTeachingRecord);
router.delete("/:id", deleteTeachingRecord);
router.get("/analytics", getTeachingAnalytics); // 👈 New Route

export default router;
