import { useEffect, useState } from "react";
import API from "../../../utils/axiosInstance";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ClipboardList, Send, Calendar, BookOpen } from "lucide-react";

export default function TeacherHomework() {
  const [homeworks, setHomeworks] = useState([]);
  const [form, setForm] = useState({
    subject: "",
    className: "",
    title: "",
    description: "",
    dueDate: "",
  });

  // 🔹 Load homework on mount
  useEffect(() => {
    fetchHomeworks();
  }, []);

  const fetchHomeworks = async () => {
    try {
      const { data } = await API.get("/teacher/homework");
      setHomeworks(data);
    } catch {
      toast.error("Failed to load homeworks ❌");
    }
  };

  // 🔹 Handle change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Submit homework
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/teacher/homework", form);
      toast.success("Homework sent successfully ✅");
      setForm({
        subject: "",
        className: "",
        title: "",
        description: "",
        dueDate: "",
      });
      fetchHomeworks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send homework ❌");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-white"
    >
      {/* 🌍 Page Header */}
      <div className="flex items-center gap-3 mb-8">
        <ClipboardList size={28} className="text-[#7ED6F4]" />
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#7ED6F4] to-[#00A9E0] bg-clip-text text-transparent drop-shadow-sm">
          Homework Management
        </h1>
      </div>

      {/* 🧾 Homework Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-[0_8px_20px_rgba(0,0,0,0.1)] mb-10 transition-all"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
            className="bg-white/10 p-3 rounded-xl text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#00A9E0]"
          />
          <input
            type="text"
            name="className"
            placeholder="Class Name"
            value={form.className}
            onChange={handleChange}
            className="bg-white/10 p-3 rounded-xl text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#00A9E0]"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <input
            type="text"
            name="title"
            placeholder="Homework Title"
            value={form.title}
            onChange={handleChange}
            className="bg-white/10 p-3 rounded-xl text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#00A9E0]"
          />
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className="bg-white/10 p-3 rounded-xl text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#00A9E0]"
          />
        </div>

        <textarea
          name="description"
          placeholder="Homework Description"
          value={form.description}
          onChange={handleChange}
          rows="4"
          className="w-full bg-white/10 p-3 mt-4 rounded-xl text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#00A9E0]"
        />

        <button
          type="submit"
          className="mt-6 px-6 py-3 bg-gradient-to-r from-[#0077C8] to-[#00A9E0] hover:from-[#006BB3] hover:to-[#0090C8] text-white rounded-xl flex items-center gap-2 transition-all shadow-[0_0_10px_rgba(0,119,200,0.5)]"
        >
          <Send size={18} /> Send Homework
        </button>
      </form>

      {/* 📚 Homework List */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-[0_8px_20px_rgba(0,0,0,0.1)]">
        <h2 className="text-2xl font-semibold mb-6 text-[#7ED6F4] flex items-center gap-2">
          <BookOpen size={22} /> All Sent Homeworks
        </h2>

        {homeworks.length === 0 ? (
          <p className="text-gray-400">No homework sent yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {homeworks.map((h) => (
              <motion.div
                key={h._id}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="bg-white/10 border border-white/20 p-4 rounded-2xl shadow-md hover:shadow-lg transition-all"
              >
                <h3 className="text-lg font-semibold text-[#7ED6F4] mb-1">
                  {h.title}
                </h3>
                <p className="text-sm text-gray-300 mb-2">
                  📘 {h.subject} — {h.className}
                </p>
                <p className="text-sm text-gray-400 mb-2">
                  🗓️ <Calendar size={14} className="inline mr-1" />
                  {new Date(h.dueDate).toLocaleDateString("en-IN")}
                </p>
                <p className="text-sm text-gray-200">{h.description}</p>
                <div className="mt-2 text-xs text-gray-400">
                  Status: <span className="capitalize">{h.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
