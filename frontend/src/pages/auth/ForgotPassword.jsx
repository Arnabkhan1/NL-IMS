import { useState } from "react";
import API from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import logo from "../../assets/Novum Labs Logo Final.png";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) return toast.error("Please select your role");
    if (role === "student" && !mobile)
      return toast.error("Mobile number is required for students");
    if (role !== "student" && !email)
      return toast.error("Email is required for non-students");

    try {
      setLoading(true);
      const payload =
        role === "student" ? { mobile, role } : { email, role };
      const { data } = await API.post("/auth/forgot-password", payload);

      toast.success(data.message || "OTP sent successfully!");
      localStorage.setItem("resetRole", role);
      if (role === "student") localStorage.setItem("resetMobile", mobile);
      else localStorage.setItem("resetEmail", email);

      navigate("/reset-password");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#002F6C] via-[#003B89] to-[#0077C8] text-white">
      <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl w-[400px] p-8 text-center">
        <img src={logo} alt="Novum Labs Logo" className="w-20 mx-auto mb-4 drop-shadow-lg" />
        <h1 className="text-2xl font-bold tracking-wide mb-6">Forgot Password</h1>
        <p className="text-sm text-gray-300 mb-6">
          Enter your registered info. We’ll send an OTP to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selector */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-xl bg-white/20 text-white outline-none focus:ring-2 focus:ring-[#7ED6F4]"
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
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#7ED6F4]"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-2 bg-[#0077C8] rounded-xl font-semibold hover:bg-[#0061A8] transition-all duration-200 shadow-lg"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        <p className="text-sm mt-4 text-gray-300">
          Remember your password?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-[#7ED6F4] hover:underline transition-all"
          >
            Sign in
          </button>
        </p>

        <p className="text-xs text-gray-300 mt-6">
          © {new Date().getFullYear()} Novum Labs. All rights reserved.
        </p>

        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#0077C8]/25 to-[#002F6C]/20 blur-3xl -z-10" />
      </div>
    </div>
  );
}
