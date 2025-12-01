// frontend/src/pages/admin/Teachers.jsx
import { useEffect, useState } from 'react';
import api from '../../services/api';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const fetchTeachers = async () => {
    try {
      const { data } = await api.get('/users/role/teacher'); // 👈 পরিবর্তন ১
      setTeachers(data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', { ...formData, role: 'teacher' }); // 👈 পরিবর্তন ২
      alert('Teacher Added Successfully! 👨‍🏫');
      setFormData({ name: '', email: '', password: '' });
      setShowForm(false);
      fetchTeachers();
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding teacher');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Teachers 👨‍🏫</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          {showForm ? 'Close Form' : '+ Add Teacher'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded shadow-md mb-8 border">
          <h2 className="text-xl font-semibold mb-4">Add New Teacher</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input placeholder="Full Name" className="p-2 border rounded" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            <input type="email" placeholder="Email" className="p-2 border rounded" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            <input type="password" placeholder="Password" className="p-2 border rounded" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
            <button type="submit" className="bg-purple-600 text-white p-2 rounded hover:bg-purple-700 md:col-span-3">Register Teacher</button>
          </form>
        </div>
      )}

      <div className="bg-white shadow rounded overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher._id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold">{teacher.name}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{teacher.email}</td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span className="px-3 py-1 font-semibold text-purple-900 bg-purple-200 rounded-full">Teacher</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {teachers.length === 0 && <p className="p-5 text-center text-gray-500">No teachers found.</p>}
      </div>
    </div>
  );
};

export default Teachers;