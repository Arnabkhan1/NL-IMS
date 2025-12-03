import { useEffect, useState } from 'react';
import api from '../../services/api';

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const { data } = await api.get('/student/attendance');
        console.log("Attendance Data:", data); // কনসোল চেক করুন
        setRecords(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Attendance History 📊</h1>
      
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-left text-xs uppercase">
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Batch</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record._id} className="border-b">
                <td className="px-5 py-4">{record.date}</td> {/* সরাসরি স্ট্রিং ডেট দেখাচ্ছি */}
                <td className="px-5 py-4">{record.batch?.name}</td>
                <td className="px-5 py-4 font-bold">
                  <span className={
                    record.status === 'Present' ? 'text-green-600' : 
                    record.status === 'Absent' ? 'text-red-600' : 'text-orange-600'
                  }>
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
            {records.length === 0 && <tr><td colSpan="3" className="p-5 text-center">No records found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;