import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import classScheduleRoutes from "./routes/classScheduleRoutes.js";
import teachingRecordRoutes from "./routes/teachingRecordRoutes.js";
import coordinatorRoutes from "./routes/coordinatorRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import roadmapRoutes from "./routes/roadmapRoutes.js";
import marksRoutes from "./routes/marksRoutes.js";
import mentorRoutes from "./routes/mentorRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/admin/schedules", classScheduleRoutes);
app.use("/api/teaching-records", teachingRecordRoutes);
app.use("/api/coordinator", coordinatorRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/coordinator", coordinatorRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/marks", marksRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/teacher", teacherRoutes);

app.get("/", (req, res) => res.send("Novum Labs IMS Backend Running 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
