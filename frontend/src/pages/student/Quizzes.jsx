// frontend/src/pages/student/Quizzes.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FaBrain, FaCheckCircle, FaClock } from 'react-icons/fa';

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const { data } = await api.get('/quizzes/student');
        setQuizzes(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading Quizzes... ⏳</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FaBrain className="text-purple-600" /> My Quizzes
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <div key={quiz._id} className={`p-6 rounded-lg shadow border-t-4 ${quiz.isTaken ? 'border-green-500 bg-green-50' : 'border-purple-500 bg-white'}`}>
              <h3 className="text-xl font-bold text-gray-800">{quiz.title}</h3>
              <p className="text-gray-500 text-sm mb-4">Duration: {quiz.duration} Minutes</p>

              {quiz.isTaken ? (
                <div className="bg-white p-4 rounded shadow-sm text-center">
                  <p className="text-sm text-gray-500">Your Score</p>
                  <p className="text-3xl font-bold text-green-600">
                    {quiz.score} / {quiz.total}
                  </p>
                  <div className="mt-2 text-xs text-gray-400 flex justify-center items-center gap-1">
                    <FaCheckCircle /> Completed
                  </div>
                </div>
              ) : (
                <Link 
                  to={`/student/quiz/${quiz._id}`} 
                  className="block w-full text-center bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
                >
                  Start Quiz 🚀
                </Link>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-3 text-center">No quizzes assigned yet.</p>
        )}
      </div>
    </div>
  );
};

export default Quizzes;