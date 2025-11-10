import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ClipboardList,
  BookOpen,
  LogOut,
  Settings,
  User,
  Clock,
  Map,
  Award
} from "lucide-react";

export default function CoordinatorLayout() {
  const navigate = useNavigate();
  const [timeGreeting, setTimeGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName] = useState(localStorage.getItem("name") || "Coordinator");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  // ✅ Role Protection
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "academicCoordinator") navigate("/login");
  }, [navigate]);

  // ✅ Greeting Update
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setTimeGreeting("Good Morning 🌅");
      else if (hour < 17) setTimeGreeting("Good Afternoon ☀️");
      else if (hour < 21) setTimeGreeting("Good Evening 🌇");
      else setTimeGreeting("Good Night 🌙");
    };
    updateGreeting();
    const timer = setInterval(updateGreeting, 60000);
    return () => clearInterval(timer);
  }, []);

  // ✅ Live Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ✅ Dropdown Close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/academicCoordinator", icon: <LayoutDashboard size={18} /> },
    { name: "Teaching Records", path: "/academicCoordinator/teaching-records", icon: <BookOpen size={18} /> },
    { name: "Attendance Manager", path: "/academicCoordinator/attendance-manager", icon: <ClipboardList size={18} /> },
    { name: "Attendance Records", path: "/academicCoordinator/attendance-records", icon: <Clock size={18} /> },
    { name: "Student Roadmap", path: "/academicCoordinator/roadmap", icon: <Map size={18} /> },
    { name: "marks-tracking", path: "/academicCoordinator/marks-tracking", icon: <Award size={18} /> },
  ];

  const formattedTime = currentTime.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const formattedDate = currentTime.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex min-h-screen text-white bg-gradient-to-br from-[#002F6C] via-[#003B89] to-[#0077C8]">
      {/* 🌟 SIDEBAR */}
      <aside className="w-64 h-screen fixed left-0 top-0 backdrop-blur-2xl bg-white/10 border-r border-white/20 flex flex-col justify-between shadow-[0_0_25px_rgba(0,0,0,0.4)]">
        <div>
          <div className="py-6 px-4 border-b border-white/10 text-center">
            <h1 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-[#7ED6F4] to-[#00A9E0] bg-clip-text text-transparent">
              Novum Labs IMS
            </h1>
            <p className="text-xs opacity-70 mt-1">Coordinator Panel</p>
          </div>

          {/* 🔹 Sidebar Menu */}
          <nav className="flex flex-col mt-6 space-y-1 px-4">
            {menuItems.map((item, i) => (
              <NavLink
                key={i}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? "bg-[#0077C8]/90 font-semibold text-white shadow-[0_0_10px_rgba(0,119,200,0.4)]"
                      : "hover:bg-white/10 text-gray-300 hover:text-[#7ED6F4]"
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* 🔻 Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full py-2 px-4 rounded-xl bg-red-500/70 hover:bg-red-600 transition shadow-lg font-medium"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* 🌈 MAIN CONTENT */}
      <div className="flex flex-col ml-64 w-full min-h-screen">
        {/* 🧭 NAVBAR */}
        <motion.header
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed top-0 left-64 right-0 z-30 backdrop-blur-2xl bg-white/10 border-b border-white/20 shadow-md flex justify-between items-center px-8 py-3"
        >
          <div>
            <h2 className="text-lg font-semibold">
              {timeGreeting},{" "}
              <span className="text-[#7ED6F4]">{userName}</span> 👋
            </h2>
            <p className="text-xs opacity-80">
              Welcome back to Coordinator Dashboard
            </p>
          </div>

          {/* ⏰ Clock */}
          <div className="flex flex-col items-center">
            <div className="relative w-52 h-10 rounded-xl border border-[#7ED6F4]/30 backdrop-blur-xl bg-[#001A38]/60 shadow-inner flex justify-center items-center">
              <p className="font-mono text-2xl text-[#7ED6F4] drop-shadow-[0_0_6px_rgba(126,214,244,0.8)] animate-pulse">
                {formattedTime}
              </p>
            </div>
            <p className="text-[11px] opacity-70 mt-1">{formattedDate}</p>
          </div>

          {/* 👤 Profile */}
          <div className="relative" ref={menuRef}>
            <div
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="text-right">
                <p className="font-semibold text-sm">{userName}</p>
                <p className="text-xs opacity-70">Coordinator</p>
              </div>
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`}
                alt="Profile"
                className="w-9 h-9 rounded-full border border-[#7ED6F4] shadow-lg"
              />
            </div>

            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-40 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl shadow-xl overflow-hidden"
              >
                <button className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 w-full text-sm">
                  <User size={16} /> Profile
                </button>
                <button className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 w-full text-sm">
                  <Settings size={16} /> Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-red-500/50 w-full text-sm text-red-300"
                >
                  <LogOut size={16} /> Logout
                </button>
              </motion.div>
            )}
          </div>
        </motion.header>

        {/* 📄 PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-8 mt-24">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
