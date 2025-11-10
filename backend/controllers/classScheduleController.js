import ClassSchedule from "../models/classScheduleModel.js";
import User from "../models/userModel.js";

// ✅ Utility for 24hr time conversion
const to24Hr = (time) => {
  if (!time) return "";
  const [h, m] = time.split(":");
  return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
};

// ✅ Create new schedule
export const createClassSchedule = async (req, res) => {
  try {
    const { teacherId, studentIds, course, days, startTime, endTime } = req.body;

    if (!teacherId || !course || !days?.length || !startTime || !endTime)
      return res.status(400).json({ message: "All fields are required" });

    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher")
      return res.status(400).json({ message: "Invalid teacher" });

    const students = await User.find({ _id: { $in: studentIds }, role: "student" });
    if (students.length !== studentIds.length)
      return res.status(400).json({ message: "Some students are invalid" });

    const schedule = await ClassSchedule.create({
      teacher: teacherId,
      students: studentIds,
      course,
      days,
      startTime: to24Hr(startTime),
      endTime: to24Hr(endTime),
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Class scheduled successfully", schedule });
  } catch (err) {
    console.error("Create Schedule Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get all schedules
export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await ClassSchedule.find()
      .populate("teacher", "name email")
      .populate("students", "name mobile")
      .populate("createdBy", "name");
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: "Failed to load schedules" });
  }
};

// ✅ Update
export const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { teacherId, studentIds, course, days, startTime, endTime } = req.body;
    const schedule = await ClassSchedule.findById(id);
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });

    schedule.teacher = teacherId || schedule.teacher;
    schedule.students = studentIds || schedule.students;
    schedule.course = course || schedule.course;
    schedule.days = days || schedule.days;
    schedule.startTime = startTime || schedule.startTime;
    schedule.endTime = endTime || schedule.endTime;

    await schedule.save();
    res.json({ message: "Schedule updated", schedule });
  } catch (err) {
    res.status(500).json({ message: "Failed to update" });
  }
};

// ✅ Delete
export const deleteSchedule = async (req, res) => {
  try {
    await ClassSchedule.findByIdAndDelete(req.params.id);
    res.json({ message: "Schedule deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete" });
  }
};
