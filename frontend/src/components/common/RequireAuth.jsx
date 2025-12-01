// frontend/src/components/common/RequireAuth.jsx
import { Navigate, Outlet } from 'react-router-dom';

const RequireAuth = ({ allowedRoles }) => {
  // ১. লোকাল স্টোরেজ থেকে টোকেন এবং ইউজার ডাটা নিচ্ছি
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // ২. যদি টোকেন না থাকে, সোজা লগইন পেজে পাঠিয়ে দাও
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ৩. যদি রোল না মেলে (যেমন: স্টুডেন্ট হয়ে মাস্টারের পেজে যাওয়া)
  // allowedRoles যদি আমরা পাস করি, তবেই চেক হবে
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // অথবা Unauthorized পেজে পাঠাতে পারেন
  }

  // ৪. সব ঠিক থাকলে কাঙ্ক্ষিত পেজটি দেখাও
  return <Outlet />;
};

export default RequireAuth;