import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaHome, FaSignOutAlt, FaUserCircle, FaUserCheck, FaClipboardList, FaBell, FaBrain } from 'react-icons/fa';

const StudentLayout = () => {
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
            <div className="w-64 bg-white border-r shadow-sm flex flex-col">
                <div className="p-6 text-center border-b">
                    <FaUserCircle className="text-4xl text-blue-500 mx-auto mb-2" />
                    <h2 className="text-lg font-bold text-gray-800">{user?.name}</h2>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Student</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/student/dashboard" className="flex items-center space-x-3 p-3 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition">
                        <FaHome /> <span>Dashboard</span>
                    </Link>
                    <Link to="/student/attendance" className="flex items-center space-x-3 p-3 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition">
                        <FaUserCheck /> <span>Attendance</span>
                    </Link>
                    <Link to="/student/assignments" className="flex items-center space-x-3 p-3 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition">
                        <FaClipboardList /> <span>Assignments</span>
                    </Link>
                    <Link to="/student/notifications" className="flex items-center space-x-3 p-3 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition">
                        <FaBell /> <span>Notifications</span>
                    </Link>
                    <Link to="/student/quizzes" className="flex items-center space-x-3 p-3 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition">
                        <FaBrain /> <span>Quizzes</span>
                    </Link>
                </nav>

                <div className="p-4 border-t">
                    <button onClick={handleLogout} className="flex items-center space-x-3 w-full p-3 rounded text-red-500 hover:bg-red-50 transition">
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

export default StudentLayout;