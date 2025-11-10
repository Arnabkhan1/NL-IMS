import Marks from "../models/marksModel.js";
import User from "../models/userModel.js";

// 🧾 Add new exam marks
export const addMarksRecord = async (req, res) => {
  try {
    const { teacherId, course, subject, examTitle, examDate, marksData } = req.body;

    if (!teacherId || !course || !subject || !examTitle || !examDate || !marksData?.length) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const teacherExists = await User.findOne({ _id: teacherId, role: "teacher" });
    if (!teacherExists)
      return res.status(404).json({ message: "Teacher not found!" });

    const record = await Marks.create({
      teacher: teacherId,
      course,
      subject,
      examTitle,
      examDate,
      marksData,
    });

    res.status(201).json(record);
  } catch (error) {
    console.error("Add Marks Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📊 Get all records
export const getAllMarksRecords = async (req, res) => {
  try {
    const data = await Marks.find()
      .populate("teacher", "name email")
      .populate("marksData.student", "name email")
      .sort({ examDate: -1 });

    res.status(200).json(data);
  } catch (error) {
    console.error("Get Marks Error:", error);
    res.status(500).json({ message: "Failed to fetch marks" });
  }
};
