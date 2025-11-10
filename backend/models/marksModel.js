import mongoose from "mongoose";

const marksSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // teacher user
      required: true,
    },
    course: { type: String, required: true },
    subject: { type: String, required: true },
    examTitle: { type: String, required: true },
    examDate: { type: Date, required: true },
    marksData: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // student user
          required: true,
        },
        marksObtained: { type: Number, required: true },
        totalMarks: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Marks", marksSchema);
