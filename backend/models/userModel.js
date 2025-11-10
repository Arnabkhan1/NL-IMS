import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    // 🔹 email only for non-students
    email: { type: String, default: undefined },

    // 🔹 mobile only for students
    mobile: { type: String, default: undefined },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: [
        "superAdmin",
        "admin",
        "academicCoordinator",
        "teacher",
        "student",
        "socialMediaHandler",
        "videoEditor",
      ],
      default: "student",
    },

    otp: String,
    otpExpire: Date,
  },
  { timestamps: true }
);

// ✅ partial unique indexes (ignore null)
userSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { email: { $exists: true, $ne: null } } }
);
userSchema.index(
  { mobile: 1 },
  { unique: true, partialFilterExpression: { mobile: { $exists: true, $ne: null } } }
);

// ✅ Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ Password comparison
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
