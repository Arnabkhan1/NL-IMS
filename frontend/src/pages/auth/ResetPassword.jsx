import { useState } from "react";
import API from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import logo from "../../assets/Novum Labs Logo Final.png";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const role = localStorage.getItem("resetRole");
  const email = localStorage.getItem("resetEmail");
  const mobile = localStorage.getItem("resetMobile");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      toast.error("Session expired! Please request OTP again.");
      navigate("/forgot-password");
      return;
    }

    try {
      setLoading(true);
      const payload =
        role === "student"
          ? { mobile, otp, newPassword, role }
          : { email, otp, newPassword, role };

      const { data } = await API.post("/auth/reset-password", payload);

      toast.success(data.message || "Password reset successful!");
      localStorage.removeItem("resetRole");
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("resetMobile");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP or request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#002F6C] via-[#003B89] to-[#0077C8] text-white">
      <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl w-[400px] p-8 text-center">
        <img src={logo} alt="Novum Labs Logo" className="w-20 mx-auto mb-4 drop-shadow-lg" />
        <h1 className="text-2xl font-bold tracking-wide mb-6">Reset Your Password</h1>
        <p className="text-sm text-gray-300 mb-6">
          Enter the OTP sent to your registered {role === "student" ? "mobile" : "email"} and set a new password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#7ED6F4]"
          />
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#7ED6F4]"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-2 bg-[#0077C8] rounded-xl font-semibold hover:bg-[#0061A8] transition-all duration-200 shadow-lg"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="text-sm mt-4 text-gray-300">
          Remembered your password?{" "}
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
