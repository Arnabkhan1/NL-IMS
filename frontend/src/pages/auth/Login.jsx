// frontend/src/pages/auth/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // আমাদের তৈরি করা api

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // পেজ চেঞ্জ করার জন্য

  const handleSubmit = async (e) => {
    e.preventDefault(); // পেজ রিলোড হওয়া আটকাবে
    setError('');

    try {
      // ১. ব্যাকএন্ডে রিকোয়েস্ট পাঠানো
      const response = await api.post('/auth/login', { email, password });

      // ২. সফল হলে টোকেন এবং ইউজার ডাটা ব্রাউজারে সেভ করা
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));

      // ৩. ড্যাশবোর্ডে পাঠিয়ে দেওয়া
      // (এখানে আমরা চেক করতে পারি রোল কী, সেই অনুযায়ী আলাদা ড্যাশবোর্ডে পাঠাবো)
      if(response.data.role === 'admin') {
        navigate('/admin/dashboard'); // আগে ছিল '/admin-dashboard' (ভুল)
      } else if (response.data.role === 'student') {
        navigate('/student/dashboard'); // ফিউচারের জন্য
      } else if (response.data.role === 'teacher') {
        navigate('/teacher/dashboard');
      }else if (response.data.role === 'coordinator') {
        navigate('/coordinator/dashboard');
      }else {
        navigate('/');
      }

    } catch (err) {
      // ৪. ভুল হলে এরর দেখানো
      setError(err.response?.data?.message || 'Login Failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Login</h2>
        
        {/* Error Message দেখানোর জায়গা */}
        {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              className="w-full p-2 border rounded focus:outline-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              className="w-full p-2 border rounded focus:outline-blue-500"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;