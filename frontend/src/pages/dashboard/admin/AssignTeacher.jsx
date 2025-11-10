import { useEffect, useState } from "react";
import API from "../../../utils/axiosInstance";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, UserMinus2, Loader2 } from "lucide-react";

export default function AssignTeacher() {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [course, setCourse] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [studentIds, setStudentIds] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchAssignments();
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

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/assignments");
      setAssignments(data);
    } catch {
      toast.error("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!teacherId || studentIds.length === 0 || !course)
      return toast.error("Please fill all fields");

    try {
      await API.post("/assignments", { teacherId, studentIds, course });
      toast.success("Teacher assigned successfully!");
      setTeacherId("");
      setStudentIds([]);
      setCourse("");
      fetchAssignments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error assigning teacher");
    }
  };

  const handleDeleteAssignment = async (id) => {
    if (!window.confirm("Delete this assignment completely?")) return;
    try {
      await API.delete(`/assignments/${id}`);
      toast.success("Assignment deleted");
      fetchAssignments();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleRemoveStudent = async (assignmentId, studentId) => {
    try {
      await API.delete(`/assignments/${assignmentId}/student/${studentId}`);
      toast.success("Student removed");
      fetchAssignments();
    } catch {
      toast.error("Failed to remove student");
    }
  };

  // handle selection like modern radio tile
  const toggleStudent = (id) => {
    setStudentIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-white"
    >
      {/* Header */}
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-[#7ED6F4] to-[#0077C8] bg-clip-text text-transparent">
        🎓 Assign Teachers to Students
      </h1>

      {/* Assign Form */}
      <form
        onSubmit={handleAssign}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl"
      >
        {/* Teacher + Course */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <select
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            className="bg-white/20 p-3 rounded-xl outline-none text-white"
          >
            <option value="">Select Teacher</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            placeholder="Enter Course Name"
            className="bg-white/20 p-3 rounded-xl outline-none text-white placeholder-gray-300"
          />
        </div>

        {/* Student Selection Grid */}
        <p className="text-[#7ED6F4] mb-3 font-semibold">Select Students:</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
          {students.map((s) => (
            <motion.div
              key={s._id}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleStudent(s._id)}
              className={`cursor-pointer p-4 rounded-2xl border text-center transition-all duration-200 ${
                studentIds.includes(s._id)
                  ? "bg-[#0077C8]/60 border-[#7ED6F4]"
                  : "bg-white/10 border-white/20 hover:bg-white/20"
              }`}
            >
              <p className="font-semibold">{s.name}</p>
              <p className="text-sm text-gray-300">{s.mobile}</p>
              <div
                className={`mt-2 w-4 h-4 mx-auto rounded-full border-2 ${
                  studentIds.includes(s._id)
                    ? "border-[#7ED6F4] bg-[#7ED6F4]"
                    : "border-gray-400"
                }`}
              ></div>
            </motion.div>
          ))}
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-[#0077C8] rounded-xl font-semibold hover:bg-[#0061A8] transition-all shadow-md"
        >
          Assign
        </button>
      </form>

      {/* Current Assignments */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 mt-8 shadow-2xl">
        <h2 className="text-xl font-semibold mb-4 text-[#7ED6F4]">
          📋 Current Assignments
        </h2>

        {loading ? (
          <div className="text-center py-10">
            <Loader2 className="animate-spin mx-auto text-[#7ED6F4]" size={28} />
            <p className="text-gray-400 mt-2 text-sm">Loading assignments...</p>
          </div>
        ) : assignments.length === 0 ? (
          <p className="text-gray-300 italic">No assignments yet</p>
        ) : (
          <div className="space-y-4">
            {assignments.map((a) => (
              <motion.div
                key={a._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/20 p-4 rounded-2xl shadow-lg"
              >
                {/* Teacher Header */}
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="text-[#7ED6F4] font-semibold text-lg">
                      👩‍🏫 {a.teacher?.name}
                    </p>
                    <p className="text-gray-300 text-sm">
                      Course: <span className="text-white">{a.course}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteAssignment(a._id)}
                    className="p-2 bg-red-500/70 hover:bg-red-600 rounded-xl transition shadow-md"
                    title="Delete assignment"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Student List */}
                <div className="pl-2">
                  <p className="text-sm text-gray-400 mb-2 font-medium uppercase tracking-wide">
                    Students under this teacher:
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {a.students?.map((s) => (
                      <motion.div
                        key={s._id}
                        whileHover={{ scale: 1.03 }}
                        className="bg-white/10 p-2 rounded-xl flex justify-between items-center"
                      >
                        <span className="truncate text-sm">
                          {s.name}{" "}
                          <span className="text-gray-400">({s.mobile})</span>
                        </span>
                        <button
                          onClick={() =>
                            handleRemoveStudent(a._id, s._id)
                          }
                          className="text-red-400 hover:text-red-600"
                          title="Remove Student"
                        >
                          <UserMinus2 size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
