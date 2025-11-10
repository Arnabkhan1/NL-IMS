import mongoose from "mongoose";

const classScheduleSchema = new mongoose.Schema(
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
    days: [{ type: String, required: true }], // ["Mon", "Wed", "Fri"]
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("ClassSchedule", classScheduleSchema);
