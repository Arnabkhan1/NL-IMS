// frontend/src/components/layout/AdminLayout.jsx
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaBook, FaUserGraduate, FaChalkboardTeacher, FaSignOutAlt, FaHome, FaLayerGroup, FaMoneyBillWave } from 'react-icons/fa';

const AdminLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-slate-800 text-white flex flex-col">
                <div className="p-4 text-2xl font-bold text-center border-b border-slate-700">
                    IMS Admin 🚀
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin/dashboard" className="flex items-center space-x-3 p-3 rounded hover:bg-slate-700 transition">
                        <FaHome /> <span>Dashboard</span>
                    </Link>
                    <Link to="/admin/courses" className="flex items-center space-x-3 p-3 rounded hover:bg-slate-700 transition">
                        <FaBook /> <span>Courses</span>
                    </Link>
                    <Link to="/admin/students" className="flex items-center space-x-3 p-3 rounded hover:bg-slate-700 transition">
                        <FaUserGraduate /> <span>Students</span>
                    </Link>
                    <Link to="/admin/teachers" className="flex items-center space-x-3 p-3 rounded hover:bg-slate-700 transition">
                        <FaChalkboardTeacher /> <span>Teachers</span>
                    </Link>
                    <Link to="/admin/batches" className="flex items-center space-x-3 p-3 rounded hover:bg-slate-700 transition">
                        <FaLayerGroup /> <span>Batches</span>
                    </Link>
                    <Link to="/admin/payments" className="flex items-center space-x-3 p-3 rounded hover:bg-slate-700 transition">
                        <FaMoneyBillWave /> <span>Payments</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full p-3 rounded hover:bg-red-600 transition text-red-200 hover:text-white"
                    >
                        <FaSignOutAlt /> <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-auto p-8">
                <Outlet /> {/* এখানেই আমাদের সব পেজ রেন্ডার হবে */}
            </div>
        </div>
    );
};

export default AdminLayout;