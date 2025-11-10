import { useEffect, useState } from "react";
import API from "../../../utils/axiosInstance";
import { motion } from "framer-motion";
import { Clock, User, Users, BookOpen, Search } from "lucide-react";
import toast from "react-hot-toast";

export default function AttendanceRecords() {
  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({ course: "", teacher: "", date: "" });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const { data } = await API.get("/attendance");
      setRecords(data);
      setFiltered(data);
    } catch (err) {
      console.error("Attendance fetch error:", err);
      toast.error("❌ Failed to load attendance records");
    }
  };

  // 🔍 Filter Logic
  const handleFilter = () => {
    let temp = records;

    if (filter.course)
      temp = temp.filter((r) =>
        r.classSchedule?.course
          ?.toLowerCase()
          .includes(filter.course.toLowerCase())
      );

    if (filter.teacher)
      temp = temp.filter((r) =>
        r.teacher?.name?.toLowerCase().includes(filter.teacher.toLowerCase())
      );

    if (filter.date)
      temp = temp.filter(
        (r) =>
          new Date(r.createdAt).toLocaleDateString("en-IN") ===
          new Date(filter.date).toLocaleDateString("en-IN")
      );

    if (search)
      temp = temp.filter(
        (r) =>
          r.classSchedule?.course
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          r.teacher?.name?.toLowerCase().includes(search.toLowerCase()) ||
          r.students?.some((s) =>
            s.student?.name?.toLowerCase().includes(search.toLowerCase())
          )
      );

    setFiltered(temp);
  };

  useEffect(() => {
    handleFilter();
  }, [search, filter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen text-white bg-gradient-to-br from-[#002F6C] via-[#003B89] to-[#0077C8] p-6"
    >
      {/* Header */}
      <h1 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-[#7ED6F4] to-[#00A9E0] bg-clip-text text-transparent">
        🧾 Attendance Records
      </h1>

      {/* 🔹 Filter Panel */}
      <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-6 mb-10 shadow-xl">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-3 text-[#7ED6F4] opacity-80"
            />
            <input
              type="text"
              placeholder="Search (Course / Teacher / Student)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 p-3 rounded-xl bg-white/10 placeholder-gray-400 text-white outline-none focus:ring-2 focus:ring-[#7ED6F4] border border-white/10"
            />
          </div>
          <input
            type="text"
            placeholder="Filter by Course"
            value={filter.course}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, course: e.target.value }))
            }
            className="p-3 rounded-xl bg-white/10 placeholder-gray-400 text-white outline-none focus:ring-2 focus:ring-[#7ED6F4] border border-white/10"
          />
          <input
            type="text"
            placeholder="Filter by Teacher"
            value={filter.teacher}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, teacher: e.target.value }))
            }
            className="p-3 rounded-xl bg-white/10 placeholder-gray-400 text-white outline-none focus:ring-2 focus:ring-[#7ED6F4] border border-white/10"
          />
          <input
            type="date"
            value={filter.date}
            onChange={(e) =>
              setFilter((prev) => ({ ...prev, date: e.target.value }))
            }
            className="p-3 rounded-xl bg-white/10 text-gray-200 outline-none focus:ring-2 focus:ring-[#7ED6F4] border border-white/10"
          />
        </div>
      </div>

      {/* 🔹 Attendance Cards */}
      {filtered.length === 0 ? (
        <div className="flex justify-center items-center min-h-[50vh] text-gray-300 text-lg">
          No attendance records found 📂
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r) => (
            <motion.div
              key={r._id}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white/10 border border-white/20 rounded-3xl p-5 backdrop-blur-xl shadow-lg hover:shadow-[#0077C8]/40 transition-all"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-[#7ED6F4]">
                  <BookOpen size={18} />
                  <span className="font-semibold">
                    {r.classSchedule?.course}
                  </span>
                </div>
                <span className="text-sm opacity-70">
                  {new Date(r.createdAt).toLocaleDateString("en-IN")}
                </span>
              </div>

              {/* Teacher Info */}
              <p className="text-sm text-gray-300">
                <User className="inline w-4 h-4 text-[#7ED6F4]" />{" "}
                {r.teacher?.name} —{" "}
                <span
                  className={`${
                    r.teacherStatus === "Present"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {r.teacherStatus}
                </span>
              </p>

              {/* Students */}
              <p className="text-sm mt-3 text-[#7ED6F4] font-medium flex items-center gap-2">
                <Users size={16} /> Students
              </p>
              <div className="max-h-28 overflow-y-auto mt-2 pr-2 custom-scrollbar">
                <ul className="text-xs space-y-1 pl-2">
                  {r.students.map((s, idx) => (
                    <li key={idx}>
                      {s.student?.name} —{" "}
                      <span
                        className={`${
                          s.status === "Present"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {s.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Remarks */}
              {r.remarks && (
                <p className="text-xs italic text-gray-400 mt-3 border-t border-white/10 pt-2">
                  “{r.remarks}”
                </p>
              )}

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between text-[11px] text-gray-400">
                <span>
                  Marked by:{" "}
                  <span className="text-[#7ED6F4]">
                    {r.markedBy?.name || "—"}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />{" "}
                  {new Date(r.createdAt).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 text-center text-xs text-gray-400 opacity-70">
        © {new Date().getFullYear()} Novum Labs IMS — Attendance Module
      </div>
    </motion.div>
  );
}
