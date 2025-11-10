import User from "../models/userModel.js";
import TeachingRecord from "../models/teachingRecordModel.js";
import Attendance from "../models/attendanceModel.js";

export const getMentorStats = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" });
    const stats = await Promise.all(teachers.map(async (t) => {
      const sessions = await TeachingRecord.countDocuments({ teacher: t._id });
      const attendance = await Attendance.countDocuments({ teacher: t._id });
      return { name: t.name, sessions, attendance };
    }));
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
