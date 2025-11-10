import Assignment from "../models/assignmentModel.js";
import User from "../models/userModel.js";

// ✅ Assign multiple students to one teacher
export const assignTeacher = async (req, res) => {
  try {
    const { teacherId, studentIds, course } = req.body;
    const adminId = req.user._id;

    // Validation
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher")
      return res.status(400).json({ message: "Invalid teacher" });

    if (!Array.isArray(studentIds) || studentIds.length === 0)
      return res.status(400).json({ message: "Please select students" });

    // Validate students
    const validStudents = await User.find({ _id: { $in: studentIds }, role: "student" });
    if (validStudents.length !== studentIds.length)
      return res.status(400).json({ message: "Some students are invalid" });

    // Prevent duplicate for same teacher+course
    const existing = await Assignment.findOne({ teacher: teacherId, course });
    if (existing) {
      // Update existing list
      const newStudents = studentIds.filter(
        (id) => !existing.students.some((s) => s.toString() === id)
      );
      existing.students.push(...newStudents);
      await existing.save();
      return res.json({ message: "Students added to existing assignment", assignment: existing });
    }

    // Create new assignment
    const newAssignment = await Assignment.create({
      teacher: teacherId,
      students: studentIds,
      course,
      createdBy: adminId,
    });

    res.status(201).json({ message: "Assignment created successfully", assignment: newAssignment });
  } catch (error) {
    console.error("Assign Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Fetch all assignments
export const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("teacher", "name email")
      .populate("students", "name mobile")
      .populate("createdBy", "name");
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Remove a single student from assignment
export const removeStudentFromAssignment = async (req, res) => {
  try {
    const { id, studentId } = req.params;
    const assignment = await Assignment.findById(id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    assignment.students = assignment.students.filter(
      (s) => s.toString() !== studentId
    );
    await assignment.save();

    res.json({ message: "Student removed from assignment", assignment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete full assignment (teacher-course pair)
export const deleteAssignment = async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
