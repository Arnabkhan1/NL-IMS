// frontend/src/pages/admin/Payments.jsx
import { useEffect, useState } from 'react';
import api from '../../services/api';

const Payments = () => {
  // State
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    student: '',
    batch: '',
    amount: '',
    paymentMethod: 'Cash',
    remarks: '',
    date: new Date().toISOString().split('T')[0] // আজকের তারিখ
  });

  // ১. সব ডাটা লোড করা
  const fetchData = async () => {
    try {
      const [payRes, stuRes, batRes] = await Promise.all([
        api.get('/payments'),
        api.get('/users/role/student'),
        api.get('/batches')
      ]);
      setPayments(payRes.data);
      setStudents(stuRes.data);
      setBatches(batRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ২. পেমেন্ট সাবমিট করা
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/payments', formData);
      alert('Payment Recorded Successfully! 💰');
      setShowForm(false);
      setFormData({ student: '', batch: '', amount: '', paymentMethod: 'Cash', remarks: '', date: '' });
      fetchData(); // টেবিল আপডেট
    } catch (error) {
      alert('Error recording payment');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Fee Collection 💰</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          {showForm ? 'Close Form' : '+ Add Payment'}
        </button>
      </div>

      {/* Payment Form */}
      {showForm && (
        <div className="bg-white p-6 rounded shadow mb-8 border border-green-200">
          <h3 className="font-bold mb-4">Record New Payment</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Student Dropdown */}
            <select className="p-2 border rounded" value={formData.student} onChange={(e) => setFormData({...formData, student: e.target.value})} required>
              <option value="">-- Select Student --</option>
              {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.email})</option>)}
            </select>

            {/* Batch Dropdown */}
            <select className="p-2 border rounded" value={formData.batch} onChange={(e) => setFormData({...formData, batch: e.target.value})} required>
              <option value="">-- Select Batch --</option>
              {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>

            <input type="number" placeholder="Amount" className="p-2 border rounded" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
            
            <select className="p-2 border rounded" value={formData.paymentMethod} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}>
              <option value="Cash">Cash</option>
              <option value="Online">Online</option>
            </select>

            <input type="text" placeholder="Remarks (e.g. Jan Fee)" className="p-2 border rounded" value={formData.remarks} onChange={(e) => setFormData({...formData, remarks: e.target.value})} />
            <input type="date" className="p-2 border rounded" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />

            <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 md:col-span-2">Save Record</button>
          </form>
        </div>
      )}

      {/* Payment History Table */}
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
              <th className="px-5 py-3 text-left">Date</th>
              <th className="px-5 py-3 text-left">Student Name</th>
              <th className="px-5 py-3 text-left">Batch</th>
              <th className="px-5 py-3 text-left">Amount</th>
              <th className="px-5 py-3 text-left">Method</th>
              <th className="px-5 py-3 text-left">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((pay) => (
              <tr key={pay._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-5 py-5 text-sm">{new Date(pay.paymentDate).toLocaleDateString()}</td>
                <td className="px-5 py-5 text-sm font-bold">{pay.student?.name}</td>
                <td className="px-5 py-5 text-sm">{pay.batch?.name}</td>
                <td className="px-5 py-5 text-sm font-bold text-green-600">{pay.amount}</td>
                <td className="px-5 py-5 text-sm">{pay.paymentMethod}</td>
                <td className="px-5 py-5 text-sm text-gray-500">{pay.remarks || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {payments.length === 0 && <p className="p-5 text-center text-gray-500">No payment records found.</p>}
      </div>
    </div>
  );
};

export default Payments;