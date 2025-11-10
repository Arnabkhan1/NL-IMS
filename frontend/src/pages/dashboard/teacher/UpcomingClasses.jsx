import { useEffect, useState } from "react";
import API from "../../../utils/axiosInstance";
import { motion } from "framer-motion";

export default function UpcomingClasses() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await API.get("/teacher/upcoming-classes");
      setClasses(data);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold text-[#7ED6F4] mb-6">
        📅 Upcoming Classes (Next 7 Days)
      </h2>

      {classes.length === 0 ? (
        <p className="opacity-70">No upcoming classes this week.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-2xl"
            >
              <h3 className="text-[#7ED6F4] text-lg font-semibold">{cls.subject}</h3>
              <p className="text-sm mt-1">📍 {cls.room}</p>
              <p className="text-sm mt-1">🕒 {cls.day} — {cls.startTime}–{cls.endTime}</p>
              <p className="text-xs opacity-70 mt-1">
                {cls.date ? new Date(cls.date).toLocaleDateString() : ""}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
