import { useEffect, useState } from "react";
import API from "../../../utils/axiosInstance";
import { motion } from "framer-motion";
import {
  Users,
  User,
  BookOpen,
  GraduationCap,
  Camera,
  Edit3,
  Crown,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const { data } = await API.get("/admin/stats");
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[70vh] text-white text-lg font-semibold animate-pulse">
        Loading Dashboard...
      </div>
    );

  const cards = [
    {
      title: "Super Admins",
      value: stats.superAdmin || 0,
      icon: <Crown size={30} />,
      color: "from-[#0077C8] to-[#00A9E0]",
      glow: "shadow-cyan-400/40",
    },
    {
      title: "Admins",
      value: stats.admin || 0,
      icon: <User size={30} />,
      color: "from-[#002F6C] to-[#0077C8]",
      glow: "shadow-blue-400/40",
    },
    {
      title: "Coordinators",
      value: stats.academicCoordinator || 0,
      icon: <BookOpen size={30} />,
      color: "from-[#0077C8] to-[#7ED6F4]",
      glow: "shadow-cyan-400/40",
    },
    {
      title: "Teachers",
      value: stats.teacher || 0,
      icon: <GraduationCap size={30} />,
      color: "from-[#002F6C] to-[#0077C8]",
      glow: "shadow-blue-500/40",
    },
    {
      title: "Students",
      value: stats.student || 0,
      icon: <Users size={30} />,
      color: "from-[#7ED6F4] to-[#0077C8]",
      glow: "shadow-cyan-300/40",
    },
    {
      title: "Social Media Handlers",
      value: stats.socialMediaHandler || 0,
      icon: <Camera size={30} />,
      color: "from-[#0077C8] to-[#002F6C]",
      glow: "shadow-sky-500/40",
    },
    {
      title: "Video Editors",
      value: stats.videoEditor || 0,
      icon: <Edit3 size={30} />,
      color: "from-[#00A9E0] to-[#0077C8]",
      glow: "shadow-cyan-300/40",
    },
  ];

  return (
    <div className="p-8 min-h-screen text-white relative overflow-hidden">
      {/* Animated Background Lights */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#001F4D] via-[#002F6C] to-[#004B8D] opacity-80 -z-20" />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(126,214,244,0.12),transparent_70%)] -z-10"
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ repeat: Infinity, duration: 10 }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between mb-10"
      >
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#7ED6F4] to-[#0077C8] bg-clip-text text-transparent drop-shadow-lg">
            Welcome, Admin 👋
          </h1>
          <div className="w-24 h-[3px] bg-gradient-to-r from-[#7ED6F4] to-transparent rounded-full mt-2"></div>
        </div>
        <p className="text-gray-300 mt-3 md:mt-0 text-sm md:text-base italic">
          Overview of Institute Statistics —{" "}
          <span className="text-[#7ED6F4] font-medium">Novum Labs IMS</span>
        </p>
      </motion.div>

      {/* Dashboard Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className={`relative rounded-3xl p-[2px] bg-gradient-to-br ${card.color} ${card.glow} shadow-lg transition-all duration-300`}
          >
            <div className="relative backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center h-[180px] text-center overflow-hidden group">
              {/* Icon */}
              <motion.div
                whileHover={{ rotate: 15 }}
                className="text-[#7ED6F4] mb-3 group-hover:scale-110 transition-transform duration-300"
              >
                {card.icon}
              </motion.div>

              {/* Title */}
              <h2 className="text-lg font-semibold tracking-wide text-white/90">
                {card.title}
              </h2>

              {/* Count */}
              <motion.p
                key={card.value}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="text-4xl font-extrabold mt-2 bg-gradient-to-r from-[#7ED6F4] to-[#00AEEF] bg-clip-text text-transparent drop-shadow-sm"
              >
                {card.value}
              </motion.p>

              {/* Animated Glow Light */}
              <motion.div
                animate={{
                  x: [0, 8, -8, 0],
                  opacity: [0.15, 0.4, 0.15],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                }}
                className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#7ED6F4]/10 to-[#0077C8]/10 blur-2xl -z-10"
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Divider Line */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ delay: 1, duration: 1 }}
        className="h-[1px] bg-gradient-to-r from-transparent via-[#7ED6F4]/50 to-transparent mt-14 mb-6"
      />

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center text-xs sm:text-sm text-gray-400 tracking-wide"
      >
        © {new Date().getFullYear()} <span className="text-[#7ED6F4]">Novum Labs IMS</span> — Designed with 💙 by{" "}
        <span className="text-white font-medium">Arnab Khan</span>
      </motion.div>
    </div>
  );
}
