import { useEffect, useState } from "react";
import API from "../../../utils/axiosInstance";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Users, ClipboardCheck, Clock } from "lucide-react";

export default function AttendanceManager() {
  const [classes, setClasses] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    fetchTodayClasses();
  }, []);

  const fetchTodayClasses = async () => {
    try {
      const { data } = await API.get("/attendance/today");
      setClasses(data);
    } catch {
      toast.error("❌ Failed to load today’s classes");
    }
  };

  const handleTeacherStatus = (classId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [classId]: { ...prev[classId], teacherStatus: status },
    }));
  };

  const handleStudentStatus = (classId, studentId, status) => {
    setAttendance((prev) => {
      const classData = prev[classId] || { students: {} };
      return {
        ...prev,
        [classId]: {
          ...classData,
          students: {
            ...classData.students,
            [studentId]: status,
          },
        },
      };
    });
  };

  const handleSubmit = async (classId) => {
    const selected = attendance[classId];
    if (!selected) return toast.error("Please mark attendance first");

    const cls = classes.find((c) => c._id === classId);
    const studentsList = Object.keys(selected.students || {}).map((id) => ({
      student: id,
      status: selected.students[id],
    }));

    try {
      await API.post("/attendance/mark", {
        classScheduleId: classId,
        teacherId: cls.teacher._id,
        teacherStatus: selected.teacherStatus || "Present",
        students: { list: studentsList },
        remarks: remarks || "",
      });

      toast.success("✅ Attendance marked successfully!");
      setRemarks("");
      fetchTodayClasses();
    } catch (err) {
      console.error("Attendance Save Error:", err.response?.data);
      toast.error(err.response?.data?.message || "Failed to save attendance");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen text-white bg-gradient-to-br from-[#002F6C] via-[#003B89] to-[#0077C8] p-6 rounded-3xl"
    >
      {/* Header */}
      <h1 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-[#7ED6F4] to-[#00A9E0] bg-clip-text text-transparent">
        🧾 Attendance Manager
      </h1>

      {/* No Classes */}
      {classes.length === 0 ? (
        <div className="flex justify-center items-center min-h-[60vh] text-gray-300 text-lg">
          No classes scheduled for today 📅
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <motion.div
              key={cls._id}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-5 shadow-xl hover:shadow-[#0077C8]/30 transition-all"
            >
              {/* Class Header */}
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-[#7ED6F4] tracking-wide">
                  {cls.course}
                </h2>
                <Clock size={18} className="text-[#7ED6F4]" />
              </div>

              <p className="text-sm text-gray-300">
                👩‍🏫 <strong>{cls.teacher?.name}</strong>
              </p>
              <p className="text-sm text-gray-400 mb-4">
                🕒 {cls.startTime} - {cls.endTime}
              </p>

              {/* Teacher Attendance */}
              <div className="mb-4">
                <p className="font-medium text-sm mb-1 text-[#7ED6F4]">
                  Teacher Attendance:
                </p>
                <div className="flex gap-3">
                  {["Present", "Absent"].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleTeacherStatus(cls._id, status)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md ${
                        attendance[cls._id]?.teacherStatus === status
                          ? status === "Present"
                            ? "bg-[#0077C8] text-white shadow-[#0077C8]/50"
                            : "bg-red-500/70 text-white shadow-red-400/40"
                          : "bg-white/10 text-gray-300 hover:bg-white/20"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Students Attendance */}
              <div>
                <p className="font-medium text-sm mb-2 text-[#7ED6F4] flex items-center gap-2">
                  <Users size={16} /> Students:
                </p>
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {cls.students.map((s) => (
                    <div
                      key={s._id}
                      className="flex justify-between items-center bg-white/10 border border-white/10 px-3 py-2 rounded-xl"
                    >
                      <span className="text-sm text-gray-200">{s.name}</span>
                      <div className="flex gap-2">
                        {["Present", "Absent"].map((st) => (
                          <button
                            key={st}
                            onClick={() =>
                              handleStudentStatus(cls._id, s._id, st)
                            }
                            className={`px-2 py-1 rounded-lg text-xs font-semibold transition ${
                              attendance[cls._id]?.students?.[s._id] === st
                                ? st === "Present"
                                  ? "bg-[#0077C8] text-white shadow-md shadow-[#0077C8]/50"
                                  : "bg-red-500/70 text-white shadow-md shadow-red-400/40"
                                : "bg-white/10 text-gray-300 hover:bg-white/20"
                            }`}
                          >
                            {st === "Present" ? "✅" : "❌"}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Remarks */}
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add remarks (optional)"
                className="w-full mt-4 p-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#7ED6F4] resize-none"
                rows={2}
              ></textarea>

              {/* Save Button */}
              <button
                onClick={() => handleSubmit(cls._id)}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-[#0077C8] to-[#00A9E0] hover:opacity-90 transition-all py-3 rounded-xl font-semibold shadow-lg"
              >
                <ClipboardCheck size={18} /> Save Attendance
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
