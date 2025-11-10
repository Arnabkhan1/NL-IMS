import Homework from "../models/homeworkModel.js";
import User from "../models/userModel.js";

// 🧩 Add Homework (teacher -> coordinator/admin)
export const addHomework = async (req, res) => {
  try {
    const { subject, className, title, description, dueDate } = req.body;

    if (!subject || !className || !title || !description || !dueDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newHomework = await Homework.create({
      teacher: req.user.id,
      subject,
      className,
      title,
      description,
      dueDate,
    });

    res.status(201).json({
      message: "Homework sent successfully ✅",
      homework: newHomework,
    });
  } catch (error) {
    console.error("Add Homework Error:", error);
    res
      .status(500)
      .json({ message: "Failed to send homework", error: error.message });
  }
};

// 🧩 Get All Homework by Teacher
export const getTeacherHomework = async (req, res) => {
  try {
    const homeworkList = await Homework.find({ teacher: req.user.id })
      .sort({ createdAt: -1 })
      .populate("teacher", "name email");

    res.status(200).json(homeworkList);
  } catch (error) {
    console.error("Get Homework Error:", error);
    res.status(500).json({ message: "Failed to fetch homework" });
  }
};
