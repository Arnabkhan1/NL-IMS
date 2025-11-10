import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    department: { type: String, required: true },
    subjects: [
      {
        name: { type: String },
        code: { type: String },
        batch: { type: String },
        schedule: [
          {
            date: { type: Date },
            day: { type: String },
            startTime: { type: String },
            endTime: { type: String },
            room: { type: String },
          },
        ],
      },
    ],
    role: { type: String, default: "teacher" },
  },
  { timestamps: true }
);

export default mongoose.model("Teacher", teacherSchema);
