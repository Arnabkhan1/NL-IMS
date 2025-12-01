// frontend/src/services/api.js
import axios from 'axios';

// ব্যাকএন্ডের বেস URL সেট করছি
const api = axios.create({
  baseURL: 'http://localhost:5000/api', 
});

// রিকোয়েস্টের সাথে অটোমেটিক টোকেন পাঠানোর জন্য (ইন্টারসেপ্টর)
// এটি পরে আমাদের কাজে লাগবে যখন আমরা প্রোটেক্টেড রাউটে রিকোয়েস্ট পাঠাবো
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;