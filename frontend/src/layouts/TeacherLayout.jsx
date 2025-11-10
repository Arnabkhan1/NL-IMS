import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Clock,
  LogOut,
  User,
  Settings,
} from "lucide-react";

export default function TeacherLayout() {
  const navigate = useNavigate();
  const [timeGreeting, setTimeGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName] = useState(localStorage.getItem("name") || "Teacher");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  // ✅ Role Protection
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "teacher") navigate("/login");
  }, [navigate]);

  // ✅ Greeting + Clock
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setTimeGreeting("Good Morning ☀️");
      else if (hour < 17) setTimeGreeting("Good Afternoon 🌤️");
      else if (hour < 21) setTimeGreeting("Good Evening 🌇");
      else setTimeGreeting("Good Night 🌙");
    };
    updateGreeting();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const greetTimer = setInterval(updateGreeting, 60000);
    return () => {
      clearInterval(timer);
      clearInterval(greetTimer);
    };
  }, []);

  // ✅ Dropdown close
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

  // ✅ Sidebar Menu
  const menuItems = [
    {
      name: "Dashboard",
      path: "/teacher/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Upcoming Classes",
      path: "/teacher/upcoming-classes",
      icon: <Clock size={18} />,
    },
    {
      name: "Homework Manager",
      path: "/teacher/homework",
      icon: <ClipboardList size={18} />,
    },
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
    <div className="flex min-h-screen bg-gradient-to-br from-[#002F6C] via-[#003B89] to-[#0077C8] text-white transition-all duration-700">
      {/* 🌙 SIDEBAR */}
      <aside className="w-64 h-screen fixed left-0 top-0 backdrop-blur-2xl flex flex-col justify-between shadow-lg border-r border-white/10 bg-white/10">
        <div>
          <div className="py-6 px-4 border-b border-white/10 text-center">
            <h1 className="text-2xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-[#7ED6F4] to-[#0077C8]">
              Novum Labs IMS
            </h1>
            <p className="text-xs opacity-70 mt-1">Teacher Panel</p>
          </div>

          <nav className="flex flex-col mt-6 space-y-1 px-4">
            {menuItems.map((item, i) => (
              <NavLink
                key={i}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? "bg-[#0077C8]/90 text-white font-semibold shadow-[0_0_12px_rgba(0,119,200,0.3)]"
                      : "hover:bg-white/20 text-white/80"
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full py-2 px-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:from-red-600 hover:to-red-700 shadow-[0_0_15px_rgba(255,0,0,0.3)] transition-all"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* 🌈 MAIN CONTENT */}
      <div className="flex flex-col ml-64 w-full min-h-screen">
        {/* 🧭 TOP NAVBAR */}
        <motion.header
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed top-0 left-64 right-0 z-30 backdrop-blur-2xl border-b border-white/10 shadow-md flex justify-between items-center px-8 py-3 bg-white/10 text-white"
        >
          <div>
            <h2 className="text-lg font-semibold">
              {timeGreeting}, <span className="text-[#7ED6F4]">{userName}</span> 👋
            </h2>
            <p className="text-xs opacity-80">Welcome to Teacher Dashboard</p>
          </div>

          {/* 🕒 Clock */}
          <div className="flex flex-col items-center">
            <div className="w-52 h-10 flex justify-center items-center rounded-xl border border-[#7ED6F4]/30 shadow-inner font-mono text-lg tracking-widest bg-[#001A38]/60 text-[#7ED6F4]">
              {formattedTime}
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
                <p className="text-xs opacity-70">Teacher</p>
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
                className="absolute right-0 mt-3 w-40 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl overflow-hidden bg-white/10 text-white"
              >
                <button className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 w-full text-sm">
                  <User size={16} /> Profile
                </button>
                <button className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 w-full text-sm">
                  <Settings size={16} /> Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-red-500/50 w-full text-sm text-red-500"
                >
                  <LogOut size={16} /> Logout
                </button>
              </motion.div>
            )}
          </div>
        </motion.header>

        {/* 📄 CONTENT */}
        <main className="flex-1 overflow-y-auto p-8 mt-24">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
