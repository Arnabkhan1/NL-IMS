import Roadmap from "../models/roadmapModel.js";
import User from "../models/userModel.js";

// ✅ Create new roadmap
export const createRoadmap = async (req, res) => {
  try {
    const { studentId, course, milestones } = req.body;

    if (!studentId || !course)
      return res.status(400).json({ message: "All fields are required" });

    const student = await User.findById(studentId);
    if (!student || student.role !== "student")
      return res.status(400).json({ message: "Invalid student" });

    const roadmap = await Roadmap.create({
      student: studentId,
      course,
      milestones,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Roadmap created successfully", roadmap });
  } catch (err) {
    console.error("Roadmap Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all roadmaps (Coordinator)
export const getAllRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find()
      .populate("student", "name")
      .populate("createdBy", "name");
    res.json(roadmaps);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get roadmap by student
export const getStudentRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ student: req.params.studentId })
      .populate("student", "name")
      .populate("createdBy", "name");
    if (!roadmap) return res.status(404).json({ message: "No roadmap found" });
    res.json(roadmap);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update milestone completion
export const updateMilestone = async (req, res) => {
  try {
    const { roadmapId, milestoneIndex } = req.params;
    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) return res.status(404).json({ message: "Roadmap not found" });

    roadmap.milestones[milestoneIndex].completed =
      !roadmap.milestones[milestoneIndex].completed;

    await roadmap.save();
    res.json({ message: "Milestone updated", roadmap });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
