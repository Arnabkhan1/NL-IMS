import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  LayoutDashboard,
  Users,
  LogOut,
  Settings,
  User,
  UserCog,
  CalendarDays
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [timeGreeting, setTimeGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName, setUserName] = useState(localStorage.getItem("name") || "User");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  // ✅ Role protection
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin" && role !== "superAdmin") {
      navigate("/login");
    }
  }, [navigate]);

  // ✅ Greeting updater
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setTimeGreeting("Good Morning");
      else if (hour < 18) setTimeGreeting("Good Afternoon");
      else setTimeGreeting("Good Evening");
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

  // ✅ Close dropdown outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Manage Users", path: "/admin/manage-users", icon: <Users size={20} /> },
    { name: "Assign Teacher", path: "/admin/assign", icon: <UserCog size={18} /> },
    { name: "Schedule Class", path: "/admin/schedule-class", icon: <CalendarDays size={18} /> },
  ];

  // 📅 Date & Time formatting
  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const digitalTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#002F6C] via-[#003B89] to-[#0077C8] text-white">
      {/* 🧭 Sidebar */}
      <aside className="w-64 h-screen fixed left-0 top-0 z-40 backdrop-blur-2xl border-r border-white/20 flex flex-col justify-between shadow-lg bg-white/10">
        <div>
          {/* Logo */}
          <div className="py-6 px-4 border-b border-white/10 text-center">
            <h1 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-[#7ED6F4] to-[#0077C8] bg-clip-text text-transparent">
              Novum Labs IMS
            </h1>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col mt-6 space-y-1 px-4">
            {menuItems.map((item, i) => (
              <NavLink
                key={i}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? "bg-[#0077C8]/80 font-semibold shadow-inner"
                      : "hover:bg-white/10"
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full py-2 px-4 rounded-xl bg-red-500/70 hover:bg-red-600 transition"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* 🌟 Main Section */}
      <div className="flex flex-col ml-64 w-full min-h-screen">
        {/* Top Navbar */}
        <motion.header
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed top-0 left-64 right-0 z-30 backdrop-blur-xl border-b border-white/20 shadow-md flex justify-between items-center px-8 py-3 bg-white/10"
        >
          {/* Greeting */}
          <div>
            <h2 className="text-lg font-semibold">
              {timeGreeting},{" "}
              <span className="text-[#7ED6F4]">{userName}</span> 👋
            </h2>
            <p className="text-xs opacity-80">Welcome back to Admin Dashboard</p>
          </div>

          {/* Clock */}
          <div className="flex flex-col items-center">
            <div className="relative w-52 h-10 rounded-xl border border-[#7ED6F4]/30 bg-[#002F6C]/50 backdrop-blur-xl shadow-inner flex justify-center items-center overflow-hidden">
              <p className="font-mono text-3xl tracking-wider text-[#7ED6F4] drop-shadow-[0_0_8px_rgba(126,214,244,0.8)]">
                {digitalTime}
              </p>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#0077C8]/15 to-[#002F6C]/15 blur-md animate-pulse" />
            </div>
            <p className="text-[11px] opacity-70 mt-1">{formattedDate}</p>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            <div
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="text-right">
                <p className="font-semibold text-sm">{userName}</p>
                <p className="text-xs opacity-70">{localStorage.getItem("role")}</p>
              </div>
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`}
                alt="Profile"
                className="w-9 h-9 rounded-full border border-[#7ED6F4] shadow-lg"
              />
            </div>

            {/* Dropdown Menu */}
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-40 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl overflow-hidden bg-white/10"
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

        {/* Page Outlet */}
        <main className="flex-1 overflow-y-auto p-8 mt-24">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
