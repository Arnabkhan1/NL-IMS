import Attendance from "../models/attendanceModel.js";
import ClassSchedule from "../models/classScheduleModel.js";
import User from "../models/userModel.js";

// ✅ Get today’s classes
export const getTodayClasses = async (req, res) => {
  try {
    const today = new Date().toLocaleString("en-IN", { weekday: "short" });
    const schedules = await ClassSchedule.find({ days: { $in: [today] } })
      .populate("teacher", "name email")
      .populate("students", "name mobile");
    res.json(schedules);
  } catch (error) {
    console.error("Today classes error:", error);
    res.status(500).json({ message: "Failed to load today’s classes" });
  }
};

// ✅ Mark Attendance
export const markAttendance = async (req, res) => {
  try {
    const { classScheduleId, teacherId, teacherStatus, students, remarks } = req.body;

    // Basic validation
    if (!classScheduleId || !teacherId) {
      return res.status(400).json({ message: "Class ID & Teacher ID are required" });
    }

    const teacherExists = await User.findById(teacherId);
    if (!teacherExists) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const classExists = await ClassSchedule.findById(classScheduleId);
    if (!classExists) {
      return res.status(404).json({ message: "Class not found" });
    }

    const attendance = new Attendance({
      classSchedule: classScheduleId,
      teacher: teacherId,
      teacherStatus,
      students: students?.list || [],
      remarks,
      markedBy: req.user._id,
    });

    await attendance.save();
    res.status(201).json({ message: "✅ Attendance marked successfully", attendance });
  } catch (error) {
    console.error("Attendance marking error:", error);
    res.status(500).json({ message: error.message || "Failed to mark attendance" });
  }
};

// ✅ Get all attendance
export const getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate("classSchedule", "course days startTime endTime")
      .populate("teacher", "name")
      .populate("students.student", "name")
      .populate("markedBy", "name");
    res.json(records);
  } catch (error) {
    console.error("Attendance fetch error:", error);
    res.status(500).json({ message: "Failed to fetch records" });
  }
};
