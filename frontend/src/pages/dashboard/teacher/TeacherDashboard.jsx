import { motion } from "framer-motion";
import { BookOpen, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";

export default function TeacherDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-white p-6"
    >
      <h1 className="text-3xl font-bold text-[#7ED6F4] mb-8">
        👨‍🏫 Teacher Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Link to="/teacher/upcoming-classes">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 border border-white/20 backdrop-blur-2xl p-6 rounded-2xl shadow-xl"
          >
            <BookOpen className="text-[#7ED6F4] mb-3" size={28} />
            <h2 className="text-xl font-semibold mb-2">Upcoming Classes</h2>
            <p className="opacity-80 text-sm">
              View your upcoming classes for the next 7 days.
            </p>
          </motion.div>
        </Link>

        <Link to="/teacher/homework">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 border border-white/20 backdrop-blur-2xl p-6 rounded-2xl shadow-xl"
          >
            <ClipboardList className="text-[#7ED6F4] mb-3" size={28} />
            <h2 className="text-xl font-semibold mb-2">Homework Manager</h2>
            <p className="opacity-80 text-sm">
              Create and send homework for admin approval.
            </p>
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
}
