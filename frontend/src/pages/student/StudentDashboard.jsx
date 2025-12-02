// frontend/src/pages/student/StudentDashboard.jsx
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const StudentDashboard = () => {
  const [data, setData] = useState({ batches: [], payments: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/student/dashboard');
        setData(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // 🟢 নতুন ফাংশন: চেক করবে এই মাসে পেমেন্ট হয়েছে কিনা
  const getPaymentStatus = (batchId) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0 = Jan, 1 = Feb...
    const currentYear = currentDate.getFullYear();

    // পেমেন্ট লিস্ট চেক করি
    const hasPaid = data.payments.some((payment) => {
      const payDate = new Date(payment.paymentDate);
      return (
        payment.batch?._id === batchId && 
        payDate.getMonth() === currentMonth && 
        payDate.getFullYear() === currentYear
      );
    });

    return hasPaid;
  };

  // বর্তমান মাসের নাম বের করার জন্য (যেমন: December)
  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });

  if (loading) return <div className="p-10 text-center">Loading dashboard... ⏳</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Student Dashboard 🚀</h1>

      {/* === Enrolled Batches Section === */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">My Active Batches & Payment Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.batches.length > 0 ? (
            data.batches.map((batch) => {
              const isPaid = getPaymentStatus(batch._id); // স্ট্যাটাস চেক করছি

              return (
                <div key={batch._id} className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500 hover:shadow-lg transition relative">
                  
                  {/* Payment Status Badge (New Feature) */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {isPaid ? <FaCheckCircle /> : <FaExclamationCircle />}
                    {isPaid ? `${currentMonthName} Paid` : `${currentMonthName} Due`}
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mt-2">{batch.name}</h3>
                  <p className="text-blue-600 font-medium text-sm mb-3">{batch.course?.title}</p>
                  
                  <div className="text-sm text-gray-600 space-y-2 bg-gray-50 p-3 rounded">
                    <p>👨‍🏫 <b>Instructor:</b> {batch.teacher?.name}</p>
                    <p>📅 <b>Days:</b> {batch.schedule?.days?.join(', ')}</p>
                    <p>⏰ <b>Time:</b> {batch.schedule?.time}</p>
                  </div>

                  {/* যদি ডিউ থাকে তবে ওয়ার্নিং দেখাবে */}
                  {!isPaid && (
                    <p className="text-xs text-red-500 mt-2 text-center">
                      ⚠️ Please clear your dues for {currentMonthName}.
                    </p>
                  )}
                </div>
              );
            })
          ) : (
            <div className="col-span-3 bg-yellow-50 p-4 rounded text-yellow-700 border border-yellow-200">
              You are not enrolled in any batch yet.
            </div>
          )}
        </div>
      </div>

      {/* === Payment History Section (আগের ফিচার থাকছে) === */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">All Payment History 💰</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden border">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Batch</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Method</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.payments.map((pay) => (
                <tr key={pay._id} className="border-b hover:bg-gray-50">
                  <td className="px-5 py-4 text-sm">{new Date(pay.paymentDate).toLocaleDateString()}</td>
                  <td className="px-5 py-4 text-sm">{pay.batch?.name}</td>
                  <td className="px-5 py-4 text-sm font-bold text-green-600">{pay.amount}</td>
                  <td className="px-5 py-4 text-sm">{pay.paymentMethod}</td>
                  <td className="px-5 py-4 text-sm">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">Paid</span>
                  </td>
                </tr>
              ))}
              {data.payments.length === 0 && (
                <tr>
                   <td colSpan="5" className="p-8 text-center text-gray-500">No payment history found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;