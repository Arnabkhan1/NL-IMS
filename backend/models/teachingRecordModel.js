import mongoose from "mongoose";

const teachingRecordSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    course: { type: String, required: true },
    topic: { type: String, required: true },
    remarks: { type: String },
    date: {
      type: Date,
      default: () => new Date(),
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("TeachingRecord", teachingRecordSchema);
