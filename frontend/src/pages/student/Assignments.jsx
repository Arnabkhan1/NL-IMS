import { useEffect, useState } from 'react';
import api from '../../services/api';
import { FaCheckCircle, FaClock, FaPaperPlane } from 'react-icons/fa';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submitLink, setSubmitLink] = useState('');

  const fetchAssignments = async () => {
    try {
      const { data } = await api.get('/assignments/student');
      setAssignments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // সাবমিট হ্যান্ডলার
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/assignments/submit', {
        assignmentId: selectedAssignment._id,
        link: submitLink
      });
      alert('Assignment Submitted! 🎉');
      setShowModal(false);
      setSubmitLink('');
      fetchAssignments(); // লিস্ট রিফ্রেশ
    } catch (error) {
      alert('Error submitting assignment');
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Assignments... ⏳</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Assignments 📝</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assignments.length > 0 ? (
          assignments.map((assign) => (
            <div key={assign._id} className={`p-6 rounded-lg shadow border-l-4 ${assign.isSubmitted ? 'border-green-500 bg-green-50' : 'border-blue-500 bg-white'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">{assign.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">Batch: {assign.batch?.name}</p>
                  <p className="text-gray-700 mb-4">{assign.description}</p>
                  <p className="text-xs text-red-500 font-semibold">
                    Due Date: {new Date(assign.dueDate).toLocaleDateString()}
                  </p>
                </div>
                
                {/* Status Icon */}
                {assign.isSubmitted ? (
                   <FaCheckCircle className="text-3xl text-green-500" />
                ) : (
                   <FaClock className="text-3xl text-blue-300" />
                )}
              </div>

              {/* Action Button */}
              <div className="mt-4">
                {assign.isSubmitted ? (
                  <button disabled className="w-full bg-gray-300 text-gray-600 py-2 rounded cursor-not-allowed">
                    Already Submitted
                  </button>
                ) : (
                  <button 
                    onClick={() => { setSelectedAssignment(assign); setShowModal(true); }}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex justify-center items-center gap-2"
                  >
                    <FaPaperPlane /> Submit Now
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-2 text-center text-gray-500">No pending assignments! 😎</p>
        )}
      </div>

      {/* === Submission Modal === */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Submit: {selectedAssignment?.title}</h3>
            <form onSubmit={handleSubmit}>
              <label className="block text-sm text-gray-600 mb-2">Google Drive / GitHub Link:</label>
              <input 
                type="url" 
                className="w-full p-2 border rounded mb-4" 
                placeholder="https://drive.google.com/..."
                value={submitLink}
                onChange={(e) => setSubmitLink(e.target.value)}
                required
              />
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;