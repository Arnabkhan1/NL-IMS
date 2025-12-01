// frontend/src/pages/admin/Students.jsx
import { useEffect, useState } from 'react';
import api from '../../services/api';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  // ১. সব স্টুডেন্ট লোড করা
  const fetchStudents = async () => {
    try {
      const { data } = await api.get('/users/role/student');
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ২. নতুন স্টুডেন্ট তৈরি করা
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // role: 'student' হার্ডকোড করে দিচ্ছি
      await api.post('/users', { ...formData, role: 'student' });
      alert('Student Added Successfully! 🎓');
      setFormData({ name: '', email: '', password: '' });
      setShowForm(false);
      fetchStudents(); // লিস্ট রিফ্রেশ
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding student');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Students 🎓</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {showForm ? 'Close Form' : '+ Add Student'}
        </button>
      </div>

      {/* Add Student Form */}
      {showForm && (
        <div className="bg-white p-6 rounded shadow-md mb-8 border">
          <h2 className="text-xl font-semibold mb-4">Add New Student</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              placeholder="Full Name" 
              className="p-2 border rounded"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <input 
              type="email" placeholder="Email" 
              className="p-2 border rounded"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <input 
              type="password" placeholder="Password" 
              className="p-2 border rounded"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700 md:col-span-3">
              Register Student
            </button>
          </form>
        </div>
      )}

      {/* Students Table */}
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Role
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap font-bold">{student.name}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{student.email}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                    <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                    <span className="relative">Student</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {students.length === 0 && <p className="p-5 text-center text-gray-500">No students found.</p>}
      </div>
    </div>
  );
};

export default Students;