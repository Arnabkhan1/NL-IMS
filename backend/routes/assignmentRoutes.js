import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  assignTeacher,
  getAllAssignments,
  removeStudentFromAssignment,
  deleteAssignment,
} from "../controllers/assignmentController.js";

const router = express.Router();

router.use(protect, adminOnly);

router.post("/", assignTeacher);
router.get("/", getAllAssignments);
router.delete("/:id", deleteAssignment);
router.delete("/:id/student/:studentId", removeStudentFromAssignment);

export default router;
