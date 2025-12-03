import { useEffect, useState } from 'react';
import api from '../../services/api';

const TeacherAttendance = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // "YYYY-MM-DD"

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const { data } = await api.get('/teacher/dashboard');
        setBatches(data.batches);
      } catch (error) { console.error(error); }
    };
    fetchBatches();
  }, []);

  const handleBatchChange = (e) => {
    const batchId = e.target.value;
    setSelectedBatch(batchId);
    
    const batch = batches.find(b => b._id === batchId);
    if (batch) {
      setStudents(batch.students);
      const initialData = {};
      batch.students.forEach(s => initialData[s._id] = 'Present');
      setAttendanceData(initialData);
    } else { setStudents([]); }
  };

  const handleSubmit = async () => {
    // ডাটা ফরম্যাট তৈরি
    const studentsPayload = students.map(s => ({
      student: s._id,
      status: attendanceData[s._id]
    }));

    try {
      await api.post('/attendance', {
        batchId: selectedBatch,
        date: date, // স্ট্রিং হিসেবে যাচ্ছে
        students: studentsPayload
      });
      alert('Attendance Saved Successfully! ✅');
    } catch (error) {
      alert('Error saving attendance');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Take Attendance</h1>
      <div className="flex gap-4 mb-6 bg-white p-4 rounded shadow">
        <select className="border p-2 rounded" value={selectedBatch} onChange={handleBatchChange}>
          <option value="">-- Select Batch --</option>
          {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
        </select>
        <input type="date" className="border p-2 rounded" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      {students.length > 0 && (
        <div className="bg-white shadow rounded p-4">
          {students.map(student => (
            <div key={student._id} className="flex justify-between items-center border-b py-2">
              <span className="font-bold">{student.name}</span>
              <div className="flex gap-4">
                {['Present', 'Absent', 'Late'].map(status => (
                  <label key={status} className="flex items-center gap-1 cursor-pointer">
                    <input 
                      type="radio" 
                      name={student._id} 
                      checked={attendanceData[student._id] === status} 
                      onChange={() => setAttendanceData({...attendanceData, [student._id]: status})}
                    /> {status}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button onClick={handleSubmit} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded">Save</button>
        </div>
      )}
    </div>
  );
};

export default TeacherAttendance;