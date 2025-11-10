import User from "../models/userModel.js";
import ClassSchedule from "../models/classScheduleModel.js";
import Attendance from "../models/attendanceModel.js";

export const getCoordinatorStats = async (req, res) => {
  try {
    const teacherCount = await User.countDocuments({ role: "teacher" });
    const studentCount = await User.countDocuments({ role: "student" });
    const classCount = await ClassSchedule.countDocuments();
    const attendanceCount = await Attendance.countDocuments();

    res.json({
      teacherCount,
      studentCount,
      classCount,
      attendanceCount,
    });
  } catch (error) {
    console.error("Coordinator Stats Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
