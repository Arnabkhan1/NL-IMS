import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  createClassSchedule,
  getAllSchedules,
  updateSchedule,
  deleteSchedule,
} from "../controllers/classScheduleController.js";

const router = express.Router();

router.use(protect, adminOnly); // admin authentication middleware

router.route("/")
  .post(createClassSchedule)
  .get(getAllSchedules);

router.route("/:id")
  .put(updateSchedule)
  .delete(deleteSchedule);

export default router;
