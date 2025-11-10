import { useEffect, useState } from "react";
import API from "../../../utils/axiosInstance";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  Download,
  Edit3,
  Trash2,
  Users,
} from "lucide-react";
import * as XLSX from "xlsx";

export default function TeachingRecords() {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    teacherId: "",
    studentIds: [],
    course: "",
    topic: "",
    remarks: "",
  });

  // 🧠 Fetch Data
  useEffect(() => {
    fetchTeachers();
    fetchStudents();
    fetchRecords();
  }, []);

  const fetchTeachers = async () => {
    try {
      const { data } = await API.get("/coordinator/teachers");
      setTeachers(data);
    } catch {
      toast.error("Failed to load teachers");
    }
  };

  const fetchStudents = async () => {
    try {
      const { data } = await API.get("/coordinator/students");
      setStudents(data);
    } catch {
      toast.error("Failed to load students");
    }
  };

  const fetchRecords = async () => {
    try {
      const { data } = await API.get("/teaching-records");
      setRecords(data);
    } catch {
      toast.error("Failed to load records");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const toggleStudent = (id) => {
    setForm((prev) => ({
      ...prev,
      studentIds: prev.studentIds.includes(id)
        ? prev.studentIds.filter((sid) => sid !== id)
        : [...prev.studentIds, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.teacherId || !form.course || !form.topic)
      return toast.error("Please fill all required fields!");

    try {
      if (editMode) {
        await API.put(`/teaching-records/${editId}`, form);
        toast.success("Record updated successfully ✅");
      } else {
        await API.post("/teaching-records", form);
        toast.success("Teaching record added successfully ✅");
      }
      fetchRecords();
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save record");
    }
  };

  const handleEdit = (record) => {
    setEditMode(true);
    setEditId(record._id);
    setForm({
      teacherId: record.teacher?._id || "",
      studentIds: record.students?.map((s) => s._id) || [],
      course: record.course,
      topic: record.topic,
      remarks: record.remarks || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    await API.delete(`/teaching-records/${id}`);
    toast.success("Record deleted ❌");
    fetchRecords();
  };

  const resetForm = () => {
    setForm({ teacherId: "", studentIds: [], course: "", topic: "", remarks: "" });
    setEditMode(false);
  };

  // 📤 Export to Excel
  const handleExport = () => {
    if (records.length === 0) return toast.error("No records to export!");
    const data = records.map((r) => ({
      Date: new Date(r.date).toLocaleDateString("en-IN"),
      Teacher: r.teacher?.name,
      Course: r.course,
      Topic: r.topic,
      Students: r.students?.map((s) => s.name).join(", "),
      Remarks: r.remarks || "-",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(ws, [["Novum Labs IMS - Teaching Records Report"]], { origin: "A1" });
    XLSX.utils.book_append_sheet(wb, ws, "Teaching Records");
    XLSX.writeFile(wb, "Teaching_Records_Report.xlsx");
    toast.success("✅ Exported Successfully!");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[70vh] text-white text-lg">
        Loading Teaching Records...
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen text-white bg-gradient-to-br from-[#002F6C] via-[#003B89] to-[#0077C8]"
    >
      <h1 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-[#7ED6F4] to-[#00A9E0] bg-clip-text text-transparent">
        📘 Daily Teaching Records
      </h1>

      {/* 🧾 Form Section */}
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl mb-10"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <select
            name="teacherId"
            value={form.teacherId}
            onChange={handleChange}
            className="bg-white/10 border border-[#7ED6F4]/40 p-3 rounded-xl text-white outline-none focus:ring-2 focus:ring-[#7ED6F4] text-sm placeholder-gray-400"
          >
            <option value="">Select Teacher</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id} className="text-black">
                {t.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="course"
            placeholder="Course Name"
            value={form.course}
            onChange={handleChange}
            className="bg-white/10 border border-[#7ED6F4]/40 p-3 rounded-xl text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#7ED6F4]"
          />

          <input
            type="text"
            name="topic"
            placeholder="Topic Covered"
            value={form.topic}
            onChange={handleChange}
            className="bg-white/10 border border-[#7ED6F4]/40 p-3 rounded-xl text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#7ED6F4]"
          />

          <input
            type="text"
            name="remarks"
            placeholder="Remarks (optional)"
            value={form.remarks}
            onChange={handleChange}
            className="bg-white/10 border border-[#7ED6F4]/40 p-3 rounded-xl text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#7ED6F4]"
          />
        </div>

        {/* 👨‍🎓 Student Selection */}
        <div className="mt-6">
          <p className="font-semibold mb-3 text-[#7ED6F4] flex items-center gap-2">
            <Users size={18} /> Select Students
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {students.map((s) => (
              <motion.div
                key={s._id}
                whileTap={{ scale: 0.96 }}
                onClick={() => toggleStudent(s._id)}
                className={`cursor-pointer p-4 rounded-2xl border text-center transition-all backdrop-blur-xl ${
                  form.studentIds.includes(s._id)
                    ? "bg-gradient-to-r from-[#0077C8]/90 to-[#00A9E0]/80 border-[#7ED6F4] text-white shadow-lg shadow-[#0077C8]/40"
                    : "bg-white/10 border-white/20 hover:bg-white/20 text-white/90"
                }`}
              >
                <p className="font-semibold">{s.name}</p>
                <p className="text-sm opacity-70">{s.mobile}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-[#0077C8] to-[#00A9E0] text-white rounded-xl font-semibold hover:scale-105 transition-all shadow-lg"
          >
            {editMode ? "Update Record" : "Add Record"}
          </button>
          {editMode && (
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 bg-gray-500/30 rounded-xl hover:bg-gray-500/50 transition"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handleExport}
            className="ml-auto px-6 py-3 bg-gradient-to-r from-[#7ED6F4] to-[#00A9E0] text-[#002F6C] rounded-xl font-semibold hover:scale-105 transition-all shadow-lg flex items-center gap-2"
          >
            <Download size={18} /> Export
          </button>
        </div>
      </form>

      {/* 🗂 Teaching Records Display */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-[#7ED6F4]">
          <FileText size={18} /> Teaching Records
        </h2>
        {records.length === 0 ? (
          <p className="opacity-70 text-center py-8">No teaching records yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {records.map((r) => (
              <motion.div
                key={r._id}
                whileHover={{ scale: 1.02 }}
                className="rounded-2xl border border-white/20 bg-white/10 p-4 shadow-lg"
              >
                <div className="flex justify-between items-center">
                  <div className="font-semibold flex items-center gap-2 text-[#7ED6F4]">
                    <BookOpen size={18} /> {r.course}
                  </div>
                  <div className="flex gap-2">
                    <Edit3
                      onClick={() => handleEdit(r)}
                      className="cursor-pointer hover:text-white"
                      size={18}
                    />
                    <Trash2
                      onClick={() => handleDelete(r._id)}
                      className="cursor-pointer text-red-400 hover:text-red-600"
                      size={18}
                    />
                  </div>
                </div>
                <p className="font-semibold mt-1">{r.topic}</p>
                <p className="text-sm opacity-80 mt-1">👨‍🏫 {r.teacher?.name}</p>
                {r.students?.length > 0 && (
                  <p className="text-xs opacity-70 mt-1">
                    👨‍🎓 {r.students.map((s) => s.name).join(", ")}
                  </p>
                )}
                <p className="text-xs opacity-60 mt-1">
                  {new Date(r.date).toLocaleDateString("en-IN")}
                </p>
                {r.remarks && (
                  <p className="text-xs italic opacity-70 mt-2">
                    “{r.remarks}”
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-xs text-gray-400 opacity-70">
        © {new Date().getFullYear()} Novum Labs IMS — All Rights Reserved
      </div>
    </motion.div>
  );
}
