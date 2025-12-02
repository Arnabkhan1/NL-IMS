// frontend/src/pages/student/Attendance.jsx
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // পরিসংখ্যান (Stats)
  const [stats, setStats] = useState({ total: 0, present: 0, percentage: 0 });

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const { data } = await api.get('/student/attendance');
        setRecords(data);

        // ক্যালকুলেশন
        const total = data.length;
        const present = data.filter(r => r.status === 'Present').length;
        const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
        
        setStats({ total, present, percentage });

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading Attendance... ⏳</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Attendance History 📊</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold text-blue-800">Total Classes</h3>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold text-green-800">Present</h3>
          <p className="text-3xl font-bold">{stats.present}</p>
        </div>
        <div className={`p-4 rounded shadow text-center ${stats.percentage < 70 ? 'bg-red-100 text-red-800' : 'bg-purple-100 text-purple-800'}`}>
          <h3 className="text-lg font-semibold">Percentage</h3>
          <p className="text-3xl font-bold">{stats.percentage}%</p>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden border">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Batch</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.length > 0 ? (
              records.map((record) => (
                <tr key={record._id} className="border-b hover:bg-gray-50">
                  <td className="px-5 py-4 text-sm font-medium">
                    {new Date(record.date).toDateString()}
                  </td>
                  <td className="px-5 py-4 text-sm">{record.batch?.name}</td>
                  <td className="px-5 py-4 text-sm">
                    {record.status === 'Present' && (
                      <span className="flex items-center gap-2 text-green-600 font-bold bg-green-100 px-3 py-1 rounded-full w-fit">
                        <FaCheckCircle /> Present
                      </span>
                    )}
                    {record.status === 'Absent' && (
                      <span className="flex items-center gap-2 text-red-600 font-bold bg-red-100 px-3 py-1 rounded-full w-fit">
                        <FaTimesCircle /> Absent
                      </span>
                    )}
                    {record.status === 'Late' && (
                      <span className="flex items-center gap-2 text-orange-600 font-bold bg-orange-100 px-3 py-1 rounded-full w-fit">
                        <FaClock /> Late
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-8 text-center text-gray-500">
                  No attendance records found yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;