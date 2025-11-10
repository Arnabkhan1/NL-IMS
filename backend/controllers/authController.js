import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

// ✅ REGISTER (Fixed: No double hashing)
export const registerUser = async (req, res) => {
  try {
    const { name, email, mobile, password, role } = req.body;

    // 🔸 Validation
    if (!name || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (role === "student" && !mobile) {
      return res.status(400).json({ message: "Mobile number is required for students" });
    }

    if (role !== "student" && !email) {
      return res.status(400).json({ message: "Email is required for non-students" });
    }

    // 🔸 Check if user exists
    const existingUser =
      role === "student"
        ? await User.findOne({ mobile })
        : await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Model will auto-hash (no manual hash here)
    const user = await User.create({
      name,
      email: role === "student" ? null : email,
      mobile: role === "student" ? mobile : null,
      password,
      role,
    });

    // ✅ Return success response
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, mobile, password, role } = req.body;

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    // Find user by role type
    let user;
    if (role === "student") {
      if (!mobile) return res.status(400).json({ message: "Mobile number is required" });
      user = await User.findOne({ mobile });
    } else {
      if (!email) return res.status(400).json({ message: "Email is required" });
      user = await User.findOne({ email });
    }

    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Login Attempt:", {
      identifier: email || mobile,
      enteredPassword: password,
      storedHash: user.password,
      result: isMatch,
    });

    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    // ✅ Successful login
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ FORGOT PASSWORD (Send OTP)
export const forgotPassword = async (req, res) => {
  try {
    const { email, mobile, role } = req.body;

    if (!role) return res.status(400).json({ message: "Role is required" });

    let user;
    if (role === "student") {
      if (!mobile) return res.status(400).json({ message: "Mobile number required" });
      user = await User.findOne({ mobile });
    } else {
      if (!email) return res.status(400).json({ message: "Email required" });
      user = await User.findOne({ email });
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Setup Mail Transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Novum Labs IMS" <${process.env.EMAIL_USER}>`,
      to: email || process.env.ADMIN_EMAIL,
      subject: "Novum Labs IMS OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; background: #f4f8fb; padding: 20px; border-radius: 10px;">
          <h2 style="color: #0077C8;">Novum Labs IMS Password Reset</h2>
          <p>Dear <b>${user.name}</b>,</p>
          <p>Your OTP code for password reset is:</p>
          <h1 style="color: #002F6C;">${otp}</h1>
          <p>This OTP will expire in <b>10 minutes</b>.</p>
          <br/>
          <p>– Novum Labs IMS Security System</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "OTP sent successfully to your registered email" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { email, mobile, otp, newPassword, role } = req.body;

    if (!role) return res.status(400).json({ message: "Role is required" });

    let user;
    if (role === "student") {
      user = await User.findOne({ mobile, otp });
    } else {
      user = await User.findOne({ email, otp });
    }

    if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });
    if (user.otpExpire < Date.now()) return res.status(400).json({ message: "OTP expired" });

    // ✅ Update new password (auto-hash by model)
    user.password = newPassword;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    res.json({ message: "Password reset successfully!" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
