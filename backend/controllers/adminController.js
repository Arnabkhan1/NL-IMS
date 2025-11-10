import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

// ✅ Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -otp -otpExpire");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Create User
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, mobile } = req.body;

    if (!name || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🧠 Student => mobile required, email ignored
    if (role === "student") {
      if (!mobile)
        return res.status(400).json({ message: "Mobile number is required for student" });

      // remove email field if it exists to avoid null
      delete req.body.email;

      const exists = await User.findOne({ mobile });
      if (exists)
        return res.status(400).json({ message: "Student already exists with this mobile" });

      const user = await User.create({ name, password, role, mobile });
      return res.status(201).json({ message: "Student created successfully", user });
    }

    // 🧠 Non-student => email required
    if (!email)
      return res.status(400).json({ message: "Email is required for non-students" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "User already exists with this email" });

    const user = await User.create({ name, email, password, role });
    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: err.message });
  }
};



// ✅ Update existing user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, mobile, password, role } = req.body;

    // 🔹 Find user
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 🔹 Update allowed fields
    if (name) user.name = name;
    if (role) user.role = role;

    // 🔹 Handle student/mobile & non-student/email logic
    if (role === "student") {
      if (mobile) user.mobile = mobile;
      user.email = undefined; // ensure no null email saves
    } else {
      if (email) user.email = email;
      user.mobile = undefined;
    }

    // 🔹 If password provided, hash new password
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    console.error("Error updating user:", err);
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "Duplicate email or mobile found" });
    }
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ User Statistics (for dashboard)
export const getUserStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    // Format output as key-value object
    const formatted = {
      totalUsers: 0,
      admin: 0,
      academicCoordinator: 0,
      teacher: 0,
      student: 0,
      socialMediaHandler: 0,
      videoEditor: 0,
    };

    stats.forEach((s) => {
      formatted[s._id] = s.count;
      formatted.totalUsers += s.count;
    });

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const admin = await User.countDocuments({ role: "admin" });
    const superAdmin = await User.countDocuments({ role: "superAdmin" });
    const academicCoordinator = await User.countDocuments({ role: "academicCoordinator" });
    const teacher = await User.countDocuments({ role: "teacher" });
    const student = await User.countDocuments({ role: "student" });
    const socialMediaHandler = await User.countDocuments({ role: "socialMediaHandler" });
    const videoEditor = await User.countDocuments({ role: "videoEditor" });

    res.json({
      totalUsers,
      superAdmin,
      admin,
      academicCoordinator,
      teacher,
      student,
      socialMediaHandler,
      videoEditor,
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ message: "Server error" });
  }
};
