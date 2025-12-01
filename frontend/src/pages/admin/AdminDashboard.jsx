import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')); // ইউজারের নাম দেখানোর জন্য

  const handleLogout = () => {
    // ১. টোকেন ডিলিট করে দিচ্ছি
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // ২. লগইন পেজে পাঠিয়ে দিচ্ছি
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="bg-white p-6 rounded shadow-lg max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">Admin Dashboard</h1>
          <button 
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
        
        <p className="text-lg">Welcome back, <span className="font-bold">{user?.name}</span>!</p>
        <p className="text-gray-600 mt-2">You have full control over the system.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;