import { useState } from "react";
import API from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import logo from "../../assets/Novum Labs Logo Final.png";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.role) {
      toast.error("Please select a role");
      return;
    }
    if (form.role === "student" && !form.mobile) {
      toast.error("Mobile number is required for students");
      return;
    }
    if (form.role !== "student" && !form.email) {
      toast.error("Email is required for non-students");
      return;
    }

    try {
      setLoading(true);
      const payload =
        form.role === "student"
          ? {
              name: form.name,
              mobile: form.mobile,
              password: form.password,
              role: form.role,
            }
          : {
              name: form.name,
              email: form.email,
              password: form.password,
              role: form.role,
            };

      const { data } = await API.post("/auth/register", payload);

      // ✅ Save user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);

      toast.success(`Welcome, ${data.name}!`);
      navigate(`/${data.role}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#002F6C] via-[#003B89] to-[#0077C8] text-white">
      {/* Glass Card */}
      <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl w-[400px] p-8 text-center">
        {/* Logo */}
        <img
          src={logo}
          alt="Novum Labs Logo"
          className="w-20 mx-auto mb-4 drop-shadow-lg"
        />
        <h1 className="text-2xl font-bold tracking-wide mb-6">
          Create Your Account
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#7ED6F4]"
          />

          {/* Conditional Input (Mobile or Email) */}
          {form.role === "student" ? (
            <input
              type="text"
              name="mobile"
              placeholder="Mobile Number"
              value={form.mobile}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#7ED6F4]"
            />
          ) : (
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#7ED6F4]"
            />
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#7ED6F4]"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-xl bg-blue-400 text-white outline-none focus:ring-2 focus:ring-[#7ED6F4]"
          >
            <option  value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="academicCoordinator">Coordinator</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
            <option value="socialMediaHandler">Social Media Handler</option>
            <option value="videoEditor">Video Editor</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-2 bg-[#0077C8] rounded-xl font-semibold hover:bg-[#0061A8] transition-all duration-200 shadow-lg"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        {/* Already have account */}
        <p className="text-sm mt-4 text-gray-300">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-[#7ED6F4] hover:underline transition-all"
          >
            Sign in here
          </button>
        </p>

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
