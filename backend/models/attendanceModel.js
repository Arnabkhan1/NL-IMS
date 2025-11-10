import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    classSchedule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassSchedule",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teacherStatus: {
      type: String,
      enum: ["Present", "Absent"],
      default: "Present",
    },
    students: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: { type: String, enum: ["Present", "Absent"], default: "Present" },
      },
    ],
    remarks: String,
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);
