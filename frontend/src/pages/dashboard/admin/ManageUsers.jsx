import { useEffect, useState } from "react";
import API from "../../../utils/axiosInstance";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Trash2, Shield, Loader2, Plus, Edit3 } from "lucide-react";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Forms
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role: "",
  });
  const [editUser, setEditUser] = useState(null);

  // ✅ Fetch Users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/admin/users");
      setUsers(data);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Delete User
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      toast.success("User deleted successfully");
    } catch {
      toast.error("Failed to delete user");
    }
  };

  // ✅ Add New User
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newUser };
      if (payload.role === "student") delete payload.email;
      else delete payload.mobile;

      await API.post("/admin/users", payload);
      toast.success("User added successfully ✅");
      setShowAddModal(false);
      setNewUser({ name: "", email: "", mobile: "", password: "", role: "" });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add user");
    }
  };

  // ✅ Edit User
  const openEditModal = (user) => {
    setEditUser({
      ...user,
      password: "",
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...editUser };
      if (!payload.password) delete payload.password;
      await API.put(`/admin/users/${editUser._id}`, payload);
      toast.success("User updated successfully ✅");
      setShowEditModal(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.mobile?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-white"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#7ED6F4] to-[#0077C8] bg-clip-text text-transparent">
          👥 Manage Users
        </h1>

        <div className="flex gap-4 items-center">
          <div className="relative w-72">
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/10 text-white placeholder-gray-400 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-[#7ED6F4]"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-[#0077C8] hover:bg-[#0061A8] px-4 py-2 rounded-xl font-semibold shadow-lg shadow-[#0077C8]/30 transition-all"
          >
            <Plus size={18} /> Add User
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-4">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-[#7ED6F4] border-b border-white/10 uppercase tracking-wide text-xs">
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email / Mobile</th>
              <th className="py-3 px-4 text-left">Role</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-10">
                  <Loader2 className="animate-spin mx-auto text-[#7ED6F4]" size={28} />
                  <p className="mt-2 text-gray-400 text-sm">Loading users...</p>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-400 italic">
                  No users found
                </td>
              </tr>
            ) : (
              filtered.map((user, i) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-white/10 hover:bg-white/5 transition"
                >
                  <td className="py-3 px-4 font-medium">{user.name}</td>
                  <td className="py-3 px-4 text-gray-300">
                    {user.role === "student" ? user.mobile : user.email}
                  </td>
                  <td className="py-3 px-4 capitalize">{user.role}</td>

                  <td className="py-3 px-4 text-center flex justify-center gap-2">
                    <button
                      onClick={() => openEditModal(user)}
                      className="p-2 bg-[#0077C8]/70 hover:bg-[#0061A8] rounded-xl transition shadow-md hover:shadow-[#0077C8]/40"
                      title="Edit User"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="p-2 bg-red-500/70 hover:bg-red-600 rounded-xl transition shadow-md hover:shadow-red-500/40"
                      title="Delete User"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ADD USER MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <Modal
            title="➕ Add New User"
            user={newUser}
            setUser={setNewUser}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddUser}
          />
        )}
      </AnimatePresence>

      {/* EDIT USER MODAL */}
      <AnimatePresence>
        {showEditModal && editUser && (
          <Modal
            title="✏️ Edit User"
            user={editUser}
            setUser={setEditUser}
            onClose={() => setShowEditModal(false)}
            onSubmit={handleUpdateUser}
            isEdit
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ---------- REUSABLE MODAL COMPONENT ---------- */
const Modal = ({ title, user, setUser, onClose, onSubmit, isEdit }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
  >
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.9 }}
      className="bg-gradient-to-br from-[#002F6C]/90 to-[#0077C8]/80 p-6 rounded-2xl shadow-2xl w-[400px] text-white"
    >
      <h2 className="text-xl font-semibold mb-4 text-[#7ED6F4]">{title}</h2>

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Full Name"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          className="w-full bg-white/10 px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-[#7ED6F4]"
        />

        {user.role === "student" ? (
          <input
            type="tel"
            placeholder="Mobile Number"
            value={user.mobile || ""}
            onChange={(e) => setUser({ ...user, mobile: e.target.value })}
            className="w-full bg-white/10 px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-[#7ED6F4]"
          />
        ) : (
          <input
            type="email"
            placeholder="Email Address"
            value={user.email || ""}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="w-full bg-white/10 px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-[#7ED6F4]"
          />
        )}

        <input
          type="password"
          placeholder={isEdit ? "New Password (optional)" : "Password"}
          value={user.password || ""}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          className="w-full bg-white/10 px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-[#7ED6F4]"
        />

        <select
          value={user.role}
          onChange={(e) => setUser({ ...user, role: e.target.value })}
          className="w-full bg-white/10 px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-[#7ED6F4]"
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="academicCoordinator">Coordinator</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
          <option value="socialMediaHandler">Social Media</option>
          <option value="videoEditor">Video Editor</option>
        </select>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#0077C8] hover:bg-[#0061A8] rounded-xl shadow-md transition"
          >
            {isEdit ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </motion.div>
  </motion.div>
);
