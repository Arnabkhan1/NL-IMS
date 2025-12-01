// frontend/src/pages/admin/Batches.jsx
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { FaUserPlus, FaTimes } from 'react-icons/fa';

const Batches = () => {
  // State for Data
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]); // 👈 নতুন: সব স্টুডেন্টের লিস্ট

  // State for UI
  const [showForm, setShowForm] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null); // কোন ব্যাচে ভর্তি করাবো
  const [studentToEnroll, setStudentToEnroll] = useState(''); // কোন ছাত্রকে ভর্তি করাবো

  // State for Form Data
  const [formData, setFormData] = useState({
    name: '', course: '', teacher: '', startDate: '', days: '', time: ''
  });

  // ১. সব ডাটা নিয়ে আসা (Batch, Course, Teacher + Student)
  const fetchInitialData = async () => {
    try {
      const [batchRes, courseRes, teacherRes, studentRes] = await Promise.all([
        api.get('/batches'),
        api.get('/courses'),
        api.get('/users/role/teacher'),
        api.get('/users/role/student') // 👈 নতুন: স্টুডেন্ট লিস্ট আনা হচ্ছে
      ]);

      setBatches(batchRes.data);
      setCourses(courseRes.data);
      setTeachers(teacherRes.data);
      setStudents(studentRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // ২. ব্যাচ তৈরি করা
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, days: formData.days.split(',').map(d => d.trim()) };
      await api.post('/batches', payload);
      alert('Batch Created Successfully!');
      setShowForm(false);
      setFormData({ name: '', course: '', teacher: '', startDate: '', days: '', time: '' });
      fetchInitialData();
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  // ৩. ছাত্র ভর্তি করানোর ফাংশন (Enroll Logic)
  const handleEnroll = async () => {
    if(!studentToEnroll) return alert("Please select a student");

    try {
      await api.post(`/batches/${selectedBatch._id}/enroll`, { studentId: studentToEnroll });
      alert('Student Enrolled Successfully! 🎉');
      setSelectedBatch(null); // Modal বন্ধ করা
      setStudentToEnroll('');
      fetchInitialData(); // ডাটা রিফ্রেশ (যাতে কাউন্ট বাড়ে)
    } catch (error) {
      alert(error.response?.data?.message || 'Enrollment Failed');
    }
  };

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Batches 🗓️</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          {showForm ? 'Close Form' : '+ Create Batch'}
        </button>
      </div>

      {/* === Create Batch Form === */}
      {showForm && (
        <div className="bg-white p-6 rounded shadow-md mb-8 border">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Batch Name" className="p-2 border rounded" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            <select className="p-2 border rounded" value={formData.course} onChange={(e) => setFormData({...formData, course: e.target.value})} required>
              <option value="">Select Course</option>
              {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
            <select className="p-2 border rounded" value={formData.teacher} onChange={(e) => setFormData({...formData, teacher: e.target.value})} required>
              <option value="">Select Teacher</option>
              {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
            </select>
            <input type="date" className="p-2 border rounded" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} required />
            <input placeholder="Days (Mon, Wed)" className="p-2 border rounded" value={formData.days} onChange={(e) => setFormData({...formData, days: e.target.value})} required />
            <input type="time" className="p-2 border rounded" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} required />
            <button type="submit" className="bg-green-600 text-white p-2 rounded md:col-span-2">Save Batch</button>
          </form>
        </div>
      )}

      {/* === Batch List === */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map((batch) => (
          <div key={batch._id} className="bg-white p-5 rounded shadow border-l-4 border-indigo-500 relative">
            <h3 className="font-bold text-xl">{batch.name}</h3>
            <p className="text-sm text-gray-500 mb-2">Course: {batch.course?.title}</p>
            <div className="text-sm space-y-1 mt-2">
              <p>👨‍🏫 <b>Teacher:</b> {batch.teacher?.name}</p>
              <p>📅 <b>Schedule:</b> {batch.schedule.days.join(', ')} at {batch.schedule.time}</p>
              <p className="text-blue-600 font-bold">🎓 Students Enrolled: {batch.students.length}</p>
            </div>
            
            {/* Enroll Button */}
            <button 
              onClick={() => setSelectedBatch(batch)}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-slate-800 text-white py-2 rounded hover:bg-slate-900 transition text-sm"
            >
              <FaUserPlus /> Enroll Student
            </button>
          </div>
        ))}
      </div>

      {/* === Enroll Modal (Popup) === */}
      {selectedBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Enroll into {selectedBatch.name}</h3>
              <button onClick={() => setSelectedBatch(null)} className="text-red-500"><FaTimes /></button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">Select a student to add to this batch.</p>
            
            <select 
              className="w-full p-2 border rounded mb-4"
              value={studentToEnroll}
              onChange={(e) => setStudentToEnroll(e.target.value)}
            >
              <option value="">-- Select Student --</option>
              {students.map(s => (
                <option key={s._id} value={s._id}>{s.name} ({s.email})</option>
              ))}
            </select>

            <button 
              onClick={handleEnroll}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Confirm Enrollment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Batches;