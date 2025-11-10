import { useEffect, useState } from "react";
import API from "../../../utils/axiosInstance";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Clock, Edit3, Trash2, Users, Calendar, BookOpen } from "lucide-react";

export default function ScheduleClass() {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [form, setForm] = useState({
    teacherId: "",
    studentIds: [],
    course: "",
    days: [],
    startTime: "",
    endTime: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  useEffect(() => {
    fetchUsers();
    fetchSchedules();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/admin/users");
      setTeachers(data.filter((u) => u.role === "teacher"));
      setStudents(data.filter((u) => u.role === "student"));
    } catch {
      toast.error("Failed to load users");
    }
  };

  const fetchSchedules = async () => {
    try {
      const { data } = await API.get("/admin/schedules");
      setSchedules(data);
    } catch {
      toast.error("Failed to load schedules");
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleDay = (day) => {
    setForm((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const toggleStudent = (id) => {
    setForm((prev) => ({
      ...prev,
      studentIds: prev.studentIds.includes(id)
        ? prev.studentIds.filter((s) => s !== id)
        : [...prev.studentIds, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await API.put(`/admin/schedules/${editId}`, form);
        toast.success("Schedule updated ✅");
      } else {
        await API.post("/admin/schedules", form);
        toast.success("Class scheduled 🎯");
      }
      fetchSchedules();
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  const handleEdit = (s) => {
    setEditMode(true);
    setEditId(s._id);
    setForm({
      teacherId: s.teacher?._id || "",
      studentIds: s.students?.map((st) => st._id) || [],
      course: s.course,
      days: s.days || [],
      startTime: s.startTime,
      endTime: s.endTime,
    });
  };

  const handleDelete = async (id) => {
    await API.delete(`/admin/schedules/${id}`);
    toast.success("Deleted successfully ❌");
    fetchSchedules();
  };

  const resetForm = () => {
    setForm({
      teacherId: "",
      studentIds: [],
      course: "",
      days: [],
      startTime: "",
      endTime: "",
    });
    setEditMode(false);
    setEditId(null);
  };

  // ✅ Convert 24hr → readable Indian time
  const formatIST = (timeStr) => {
    if (!timeStr) return "";
    try {
      const [hours, minutes] = timeStr.split(":");
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      });
    } catch {
      return timeStr;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-white"
    >
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold mb-10 bg-gradient-to-r from-[#7ED6F4] to-[#0077C8] bg-clip-text text-transparent"
      >
        {editMode ? "✏️ Edit Class Schedule" : "🕒 Schedule Weekly Classes"}
      </motion.h1>

      {/* Glass Form */}
      <motion.form
        onSubmit={handleSubmit}
        whileHover={{ scale: 1.002 }}
        className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-[0_0_40px_rgba(0,119,200,0.15)] mb-10"
      >
        {/* Top Inputs */}
        <div className="grid md:grid-cols-3 gap-5 mb-6">
          <div>
            <label className="text-sm text-gray-300 block mb-1">Select Teacher</label>
            <select
              name="teacherId"
              value={form.teacherId}
              onChange={handleChange}
              className="w-full bg-white/20 p-3 rounded-xl text-white outline-none focus:ring-2 focus:ring-[#7ED6F4] hover:bg-white/25 transition"
            >
              <option value="">Select</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-300 block mb-1">Course Name</label>
            <input
              type="text"
              name="course"
              placeholder="Enter Course"
              value={form.course}
              onChange={handleChange}
              className="w-full bg-white/20 p-3 rounded-xl text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#7ED6F4] hover:bg-white/25 transition"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300 block mb-1">Select Days</label>
            <div className="flex flex-wrap gap-2">
              {weekDays.map((day) => (
                <motion.div
                  key={day}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleDay(day)}
                  className={`cursor-pointer px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    form.days.includes(day)
                      ? "bg-[#0077C8] text-white shadow-[0_0_12px_#0077C8]"
                      : "bg-white/20 text-gray-200 hover:bg-white/30"
                  }`}
                >
                  {day}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Student Selector */}
        <div className="mb-6">
          <p className="font-semibold text-[#7ED6F4] mb-2 flex items-center gap-2">
            <Users size={18} /> Select Students
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {students.map((s) => (
              <motion.div
                key={s._id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => toggleStudent(s._id)}
                className={`cursor-pointer p-4 rounded-2xl border text-center transition-all ${
                  form.studentIds.includes(s._id)
                    ? "bg-gradient-to-r from-[#0077C8] to-[#00B4DB] border-[#7ED6F4] shadow-[0_0_20px_#0077C8aa]"
                    : "bg-white/10 border-white/20 hover:bg-white/20"
                }`}
              >
                <p className="font-semibold">{s.name}</p>
                <p className="text-sm text-gray-300">{s.mobile}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Time Select */}
        <div className="grid md:grid-cols-2 gap-5 mb-6">
          <div>
            <label className="text-sm text-gray-300 mb-1 block">Start Time</label>
            <div className="relative">
              <Clock size={18} className="absolute left-3 top-3 text-[#7ED6F4]" />
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                className="w-full pl-10 p-3 rounded-xl bg-white/20 text-white outline-none focus:ring-2 focus:ring-[#7ED6F4]"
              />
            </div>
            {form.startTime && (
              <p className="text-xs text-[#7ED6F4] mt-1 italic">
                {formatIST(form.startTime)} IST
              </p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-300 mb-1 block">End Time</label>
            <div className="relative">
              <Clock size={18} className="absolute left-3 top-3 text-[#7ED6F4]" />
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                className="w-full pl-10 p-3 rounded-xl bg-white/20 text-white outline-none focus:ring-2 focus:ring-[#7ED6F4]"
              />
            </div>
            {form.endTime && (
              <p className="text-xs text-[#7ED6F4] mt-1 italic">
                {formatIST(form.endTime)} IST
              </p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-[#0077C8] to-[#00B4DB] rounded-xl font-semibold hover:shadow-[0_0_20px_#00B4DBaa] transition"
          >
            {editMode ? "Update Schedule" : "Schedule Class"}
          </button>
          {editMode && (
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 bg-white/20 rounded-xl hover:bg-white/30 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </motion.form>

      {/* Schedule List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-xl"
      >
        <h2 className="text-xl font-semibold mb-6 text-[#7ED6F4] flex items-center gap-2">
          <Calendar size={20} /> All Scheduled Classes
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {schedules.map((s) => (
            <motion.div
              key={s._id}
              whileHover={{ scale: 1.03 }}
              className="relative bg-gradient-to-br from-[#002F6C]/40 to-[#0077C8]/30 border border-white/20 p-5 rounded-2xl shadow-[0_0_25px_rgba(126,214,244,0.2)] hover:shadow-[0_0_35px_rgba(126,214,244,0.4)] transition-all"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-[#7ED6F4] flex items-center gap-2">
                  <BookOpen size={18} /> {s.course}
                </h3>
                <div className="flex gap-2">
                  <Edit3
                    onClick={() => handleEdit(s)}
                    className="cursor-pointer text-[#7ED6F4] hover:text-white"
                    size={18}
                  />
                  <Trash2
                    onClick={() => handleDelete(s._id)}
                    className="cursor-pointer text-red-400 hover:text-red-600"
                    size={18}
                  />
                </div>
              </div>

              <p className="text-sm text-gray-300 mb-1">
                👩‍🏫 <b>{s.teacher?.name}</b>
              </p>
              <p className="text-sm text-gray-400">
                👨‍🎓 {s.students?.map((st) => st.name).join(", ")}
              </p>

              <div className="text-xs mt-3 text-gray-400 italic">
                {s.days.join(", ")} — {formatIST(s.startTime)} to {formatIST(s.endTime)} (IST)
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
