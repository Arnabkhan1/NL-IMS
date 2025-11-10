import { useEffect, useState } from "react";
import API from "../../../utils/axiosInstance";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { MapPin, PlusCircle, BookOpen } from "lucide-react";

export default function StudentRoadmap() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    studentId: "",
    course: "",
    milestones: [{ title: "", description: "" }],
  });
  const [roadmaps, setRoadmaps] = useState([]);

  // 🔹 Load students and roadmaps
  useEffect(() => {
    fetchStudents();
    fetchRoadmaps();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await API.get("/coordinator/students");
      setStudents(data);
    } catch {
      toast.error("❌ Failed to load students");
    }
  };

  const fetchRoadmaps = async () => {
    try {
      const { data } = await API.get("/roadmap");
      setRoadmaps(data);
    } catch {
      toast.error("❌ Failed to load roadmaps");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMilestoneChange = (index, field, value) => {
    const updated = [...form.milestones];
    updated[index][field] = value;
    setForm({ ...form, milestones: updated });
  };

  const addMilestone = () => {
    setForm({
      ...form,
      milestones: [...form.milestones, { title: "", description: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/roadmap", form);
      toast.success("✅ Roadmap created successfully!");
      setForm({
        studentId: "",
        course: "",
        milestones: [{ title: "", description: "" }],
      });
      fetchRoadmaps();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create roadmap");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen text-white bg-gradient-to-br from-[#002F6C] via-[#003B89] to-[#0077C8] p-6"
    >
      {/* 🌍 Header */}
      <div className="flex items-center gap-3 mb-10">
        <MapPin size={28} className="text-[#7ED6F4]" />
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#7ED6F4] to-[#00A9E0] bg-clip-text text-transparent drop-shadow-md">
          Student Roadmap Tracker
        </h1>
      </div>

      {/* 🚀 Roadmap Form */}
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl mb-10"
      >
        <div className="grid md:grid-cols-2 gap-4">
          {/* Student Select */}
          <select
            name="studentId"
            value={form.studentId}
            onChange={handleChange}
            className="bg-white/10 border border-[#7ED6F4]/40 p-3 rounded-xl text-white outline-none focus:ring-2 focus:ring-[#7ED6F4] text-sm placeholder-gray-400"
          >
            <option value="">Select Student</option>
            {students.map((s) => (
              <option key={s._id} value={s._id} className="text-black">
                {s.name}
              </option>
            ))}
          </select>

          {/* Course Name */}
          <input
            type="text"
            name="course"
            placeholder="Course Name"
            value={form.course}
            onChange={handleChange}
            className="bg-white/10 border border-[#7ED6F4]/40 p-3 rounded-xl text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#7ED6F4]"
          />
        </div>

        {/* 🧩 Milestones */}
        {form.milestones.map((m, index) => (
          <div key={index} className="grid md:grid-cols-2 gap-4 mt-4">
            <input
              type="text"
              placeholder="Milestone Title"
              value={m.title}
              onChange={(e) =>
                handleMilestoneChange(index, "title", e.target.value)
              }
              className="bg-white/10 border border-[#7ED6F4]/40 p-3 rounded-xl text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#7ED6F4]"
            />
            <input
              type="text"
              placeholder="Milestone Description"
              value={m.description}
              onChange={(e) =>
                handleMilestoneChange(index, "description", e.target.value)
              }
              className="bg-white/10 border border-[#7ED6F4]/40 p-3 rounded-xl text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#7ED6F4]"
            />
          </div>
        ))}

        {/* ➕ Add Milestone */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            type="button"
            onClick={addMilestone}
            className="px-6 py-3 bg-gradient-to-r from-[#0077C8] to-[#00A9E0] hover:opacity-90 transition-all rounded-xl text-white font-semibold flex items-center gap-2 shadow-lg shadow-[#0077C8]/40"
          >
            <PlusCircle size={18} /> Add Milestone
          </button>

          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-[#00A9E0] to-[#0077C8] hover:opacity-90 transition-all rounded-xl font-semibold text-white shadow-lg shadow-[#0077C8]/40"
          >
            Create Roadmap
          </button>
        </div>
      </form>

      {/* 📘 Roadmaps List */}
      <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-[#7ED6F4]">
          <BookOpen size={22} /> All Student Roadmaps
        </h2>

        {roadmaps.length === 0 ? (
          <p className="text-gray-300 text-center py-10">
            No roadmaps created yet 🚧
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roadmaps.map((r) => (
              <motion.div
                key={r._id}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="bg-white/10 border border-white/20 rounded-2xl p-5 shadow-lg hover:shadow-[#0077C8]/40 transition-all"
              >
                <h3 className="text-lg font-semibold text-[#7ED6F4] mb-1">
                  {r.course}
                </h3>
                <p className="text-sm text-gray-300 mb-3">
                  👩‍🎓 {r.student?.name}
                </p>

                <ul className="text-sm text-gray-300 list-disc ml-4 space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
                  {r.milestones.map((m, i) => (
                    <li key={i}>
                      <span className="text-[#7ED6F4] font-medium">
                        {m.title}
                      </span>{" "}
                      — {m.description}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-xs text-gray-400 opacity-70">
        © {new Date().getFullYear()} Novum Labs IMS — Student Progress Tracker
      </div>
    </motion.div>
  );
}
