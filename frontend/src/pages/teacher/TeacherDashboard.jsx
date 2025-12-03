// frontend/src/pages/teacher/TeacherDashboard.jsx
import { useEffect, useState } from 'react';
import api from '../../services/api';

const TeacherDashboard = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/teacher/dashboard');
        setBatches(data.batches);
      } catch (error) {
        console.error("Error fetching teacher dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading Classes... ⏳</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">My Assigned Classes 👨‍🏫</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.length > 0 ? (
          batches.map((batch) => (
            <div key={batch._id} className="bg-white p-6 rounded shadow-md border-t-4 border-yellow-500">
              <h3 className="text-xl font-bold text-gray-800">{batch.name}</h3>
              <p className="text-yellow-600 font-semibold text-sm mb-3">{batch.course?.title}</p>
              
              <div className="bg-gray-50 p-3 rounded text-sm space-y-2 text-gray-600">
                <p>📅 <b>Days:</b> {batch.schedule?.days.join(', ')}</p>
                <p>⏰ <b>Time:</b> {batch.schedule?.time}</p>
                <p>🎓 <b>Students:</b> {batch.students.length} Enrolled</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 bg-red-50 p-4 rounded text-red-700 border border-red-200 text-center">
             You have not been assigned to any batch yet. Please contact Admin.
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;