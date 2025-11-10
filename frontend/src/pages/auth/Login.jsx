import { useState } from "react";
import API from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import logo from "../../assets/Novum Labs Logo Final.png";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [role, setRole] = useState(""); // role selection for login
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!role) {
      toast.error("Please select your role first");
      return;
    }

    if (role === "student" && !mobile) {
      toast.error("Mobile number is required for students");
      return;
    }

    if (role !== "student" && !email) {
      toast.error("Email is required for non-students");
      return;
    }

    try {
      setLoading(true);

      // Prepare payload dynamically
      const payload =
        role === "student"
          ? { mobile, password, role }
          : { email, password, role };

      const { data } = await API.post("/auth/login", payload);

      // ✅ Save user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);

      toast.success(`Welcome back, ${data.name}`);
      navigate(`/${data.role}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#002F6C] via-[#003B89] to-[#0077C8] text-white">
      {/* Glassmorphism Card */}
      <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl w-[400px] p-8 text-center">
        {/* Logo */}
        <img
          src={logo}
          alt="Novum Labs Logo"
          className="w-20 mx-auto mb-4 drop-shadow-lg"
        />

        <h1 className="text-2xl font-bold tracking-wide mb-6">
          Novum Labs IMS Login
        </h1>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Role Selector */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-xl bg-blue-600 text-white outline-none focus:ring-2 focus:ring-[#7ed6f4] border"
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="academicCoordinator">Coordinator</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
            <option value="socialMediaHandler">Social Media Handler</option>
            <option value="videoEditor">Video Editor</option>
          </select>

          {/* Conditional Input */}
          {role === "student" ? (
            <input
              type="text"
              placeholder="Enter your mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#7ED6F4]"
            />
          ) : (
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#7ED6F4]"
            />
          )}

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#7ED6F4]"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-2 bg-[#0077C8] rounded-xl font-semibold hover:bg-[#0061A8] transition-all duration-200 shadow-lg"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Forgot + Signup */}
        <div className="flex justify-between mt-4 text-sm">
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-[#7ED6F4] hover:underline transition-all"
          >
            Forgot Password?
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="text-[#7ED6F4] hover:underline transition-all"
          >
            Create Account
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-300 mt-6">
          © {new Date().getFullYear()} Novum Labs. All rights reserved.
        </p>

        {/* Glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#0077C8]/25 to-[#002F6C]/20 blur-3xl -z-10" />
      </div>
    </div>
  );
}
