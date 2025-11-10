import TeachingRecord from "../models/teachingRecordModel.js";
import User from "../models/userModel.js";

// ✅ Create Record
export const createTeachingRecord = async (req, res) => {
  try {
    const { teacherId, studentIds, course, topic, remarks } = req.body;

    if (!teacherId || !course || !topic)
      return res.status(400).json({ message: "All required fields must be filled" });

    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher")
      return res.status(400).json({ message: "Invalid teacher" });

    const validStudents = await User.find({
      _id: { $in: studentIds || [] },
      role: "student",
    });

    const record = await TeachingRecord.create({
      teacher: teacherId,
      students: validStudents.map((s) => s._id),
      course,
      topic,
      remarks,
      createdBy: req.user._id,
    });

    res.status(201).json(record);
  } catch (error) {
    console.error("Create Record Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all Records
export const getAllTeachingRecords = async (req, res) => {
  try {
    const records = await TeachingRecord.find()
      .populate("teacher", "name email")
      .populate("students", "name mobile")
      .populate("createdBy", "name");

    res.json(records);
  } catch (error) {
    console.error("Get Records Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Record
export const updateTeachingRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { teacherId, studentIds, course, topic, remarks } = req.body;

    const record = await TeachingRecord.findById(id);
    if (!record) return res.status(404).json({ message: "Record not found" });

    if (teacherId) record.teacher = teacherId;
    if (studentIds?.length) record.students = studentIds;
    if (course) record.course = course;
    if (topic) record.topic = topic;
    if (remarks !== undefined) record.remarks = remarks;

    await record.save();

    res.json({ message: "Record updated successfully", record });
  } catch (error) {
    console.error("Update Record Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Record
export const deleteTeachingRecord = async (req, res) => {
  try {
    await TeachingRecord.findByIdAndDelete(req.params.id);
    res.json({ message: "Teaching record deleted successfully" });
  } catch (error) {
    console.error("Delete Record Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Analytics Summary for Coordinator Dashboard
export const getTeachingAnalytics = async (req, res) => {
  try {
    const records = await TeachingRecord.find()
      .populate("teacher", "name")
      .populate("students", "name");

    // 🧮 Analytics Calculation
    const teacherStats = {};

    records.forEach((record) => {
      const tName = record.teacher?.name || "Unknown";

      if (!teacherStats[tName]) {
        teacherStats[tName] = {
          totalClasses: 0,
          topics: new Set(),
          totalStudents: new Set(),
        };
      }

      teacherStats[tName].totalClasses += 1;
      teacherStats[tName].topics.add(record.topic);
      record.students.forEach((s) => teacherStats[tName].totalStudents.add(s.name));
    });

    // Format Data
    const analytics = Object.keys(teacherStats).map((name) => ({
      teacher: name,
      totalClasses: teacherStats[name].totalClasses,
      uniqueTopics: teacherStats[name].topics.size,
      uniqueStudents: teacherStats[name].totalStudents.size,
    }));

    res.json(analytics);
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ message: error.message });
  }
};
