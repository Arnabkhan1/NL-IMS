// frontend/src/components/layout/TeacherLayout.jsx
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaChalkboardTeacher, FaUserCheck, FaSignOutAlt, FaHome } from 'react-icons/fa';

const TeacherLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 text-white flex flex-col">
        <div className="p-6 text-center border-b border-slate-700">
          <FaChalkboardTeacher className="text-4xl mx-auto mb-2 text-yellow-400" />
          <h2 className="text-lg font-bold">Teacher Panel</h2>
          <p className="text-xs text-gray-400">Hello, {user?.name}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/teacher/dashboard" className="flex items-center space-x-3 p-3 rounded hover:bg-slate-700 transition">
            <FaHome /> <span>My Batches</span>
          </Link>
          <Link to="/teacher/attendance" className="flex items-center space-x-3 p-3 rounded hover:bg-slate-700 transition">
            <FaUserCheck /> <span>Take Attendance</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button onClick={handleLogout} className="flex items-center space-x-3 w-full p-3 rounded text-red-400 hover:bg-red-900/20 transition">
            <FaSignOutAlt /> <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default TeacherLayout;