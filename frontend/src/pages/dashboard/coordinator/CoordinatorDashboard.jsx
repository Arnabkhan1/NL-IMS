import { useEffect, useState } from "react";
import API from "../../../utils/axiosInstance";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  GraduationCap,
  Clock,
  UserCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function CoordinatorDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchAttendance();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data } = await API.get("/coordinator/stats");
      setStats(data);
    } catch {
      toast.error("❌ Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      const { data } = await API.get("/attendance");
      setAttendance(data.reverse());
    } catch {
      toast.error("❌ Failed to load attendance records");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[70vh] text-[#7ED6F4] text-lg">
        Loading Dashboard...
      </div>
    );

  // 📊 Summary Cards
  const cards = [
    {
      title: "Teachers",
      value: stats.teacherCount || 0,
      icon: <GraduationCap size={26} />,
      color: "from-[#0077C8] to-[#00A9E0]",
    },
    {
      title: "Students",
      value: stats.studentCount || 0,
      icon: <Users size={26} />,
      color: "from-[#7ED6F4] to-[#0077C8]",
    },
    {
      title: "Scheduled Classes",
      value: stats.classCount || 0,
      icon: <BookOpen size={26} />,
      color: "from-[#00A9E0] to-[#0077C8]",
    },
    {
      title: "Attendance Recorded",
      value: stats.attendanceCount || 0,
      icon: <UserCheck size={26} />,
      color: "from-[#004B8D] to-[#0077C8]",
    },
    {
      title: "Classes (This Week)",
      value: attendance.length || 0,
      icon: <Clock size={26} />,
      color: "from-[#002F6C] to-[#0077C8]",
    },
  ];

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-[#002F6C] via-[#003B89] to-[#0077C8] text-white">
      {/* 🌟 Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between mb-10"
      >
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#7ED6F4] to-[#00A9E0] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(126,214,244,0.4)]">
          Welcome, Coordinator 👋
        </h1>
        <p className="mt-2 md:mt-0 text-sm md:text-base text-gray-300">
          Overview of Teaching & Attendance —{" "}
          <span className="font-medium text-[#7ED6F4]">Novum Labs IMS</span>
        </p>
      </motion.div>

      {/* 📈 Summary Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        {cards.map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className={`relative rounded-3xl p-[2px] bg-gradient-to-br ${card.color} shadow-lg`}
          >
            <div className="relative backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-6 flex flex-col items-center justify-center h-[160px] text-center group overflow-hidden">
              <div className="mb-3 text-[#7ED6F4] group-hover:scale-110 transition-transform duration-300">
                {card.icon}
              </div>
              <h2 className="text-lg font-semibold tracking-wide">
                {card.title}
              </h2>
              <p className="text-3xl font-extrabold mt-2 text-white drop-shadow-md">
                {card.value}
              </p>

              {/* Ambient light pulse */}
              <motion.div
                animate={{
                  opacity: [0.2, 0.4, 0.2],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
                className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#7ED6F4]/10 to-[#0077C8]/10 blur-2xl -z-10"
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 🧾 Attendance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-12 rounded-3xl border border-white/20 shadow-2xl backdrop-blur-2xl bg-white/10 p-6"
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#7ED6F4] to-[#0077C8] bg-clip-text text-transparent">
            🧾 Recent Attendance Records
          </h2>
          <button
            onClick={() => navigate("/academicCoordinator/attendance-records")}
            className="text-[#7ED6F4] text-sm hover:underline transition"
          >
            View all →
          </button>
        </div>

        {attendance.length === 0 ? (
          <p className="text-gray-300">No attendance marked yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {attendance.slice(0, 6).map((r) => (
              <motion.div
                key={r._id}
                whileHover={{ scale: 1.03 }}
                className="rounded-2xl p-4 border border-white/20 bg-white/10 shadow-lg hover:shadow-[#0077C8]/30 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-[#7ED6F4]">
                    {r.classSchedule?.course}
                  </span>
                  <span className="text-xs opacity-70">
                    {new Date(r.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>

                <p className="text-sm text-gray-200">
                  👨‍🏫 {r.teacher?.name} —{" "}
                  <span
                    className={`${
                      r.teacherStatus === "Present"
                        ? "text-green-400"
                        : "text-red-400"
                    } font-medium`}
                  >
                    {r.teacherStatus}
                  </span>
                </p>

                <div className="mt-2 text-xs opacity-80">
                  {r.students.slice(0, 3).map((s, i) => (
                    <span key={i}>
                      {s.student?.name}{" "}
                      <span
                        className={`${
                          s.status === "Present"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        ({s.status})
                      </span>
                      {i < r.students.length - 1 && ", "}
                    </span>
                  ))}
                  {r.students.length > 3 && (
                    <span className="opacity-60"> ...more</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-gray-400 opacity-80">
        © {new Date().getFullYear()} Novum Labs IMS — Designed with 💙 by Arnab Khan
      </div>
    </div>
  );
}
