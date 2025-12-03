// frontend/src/pages/student/Notifications.jsx
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { FaBullhorn, FaCalendarAlt } from 'react-icons/fa';

const Notifications = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const { data } = await api.get('/notices/student');
        setNotices(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading Notices... ⏳</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FaBullhorn className="text-blue-600" /> Notice Board
      </h1>

      <div className="space-y-4">
        {notices.length > 0 ? (
          notices.map((notice) => (
            <div key={notice._id} className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-800">{notice.title}</h3>
                <span className="text-xs text-gray-500 flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                  <FaCalendarAlt /> {new Date(notice.createdAt).toDateString()}
                </span>
              </div>
              <p className="text-gray-600 whitespace-pre-wrap">{notice.message}</p>
            </div>
          ))
        ) : (
          <div className="text-center p-10 bg-white rounded shadow text-gray-500">
            No active notices available right now.
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;