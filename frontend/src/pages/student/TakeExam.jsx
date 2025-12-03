// frontend/src/pages/student/TakeExam.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const TakeExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({}); // { 0: 1, 1: 3 } -> QuestionIndex: OptionIndex
  const [timeLeft, setTimeLeft] = useState(0);

  // ১. কুইজ লোড করা
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await api.get(`/quizzes/${id}`);
        setQuiz(data);
        setTimeLeft(data.duration * 60); // মিনিটকে সেকেন্ডে কনভার্ট করা
      } catch (error) {
        alert("Error loading quiz");
        navigate('/student/quizzes');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id, navigate]);

  // ২. টাইমার চালানো
  useEffect(() => {
    if (!timeLeft || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    // সময় শেষ হলে অটোমেটিক সাবমিট
    if (timeLeft === 0) handleSubmit();

    return () => clearInterval(timer);
  }, [timeLeft]);

  // ৩. অপশন সিলেক্ট করা
  const handleOptionSelect = (questionIndex, optionIndex) => {
    setAnswers({ ...answers, [questionIndex]: optionIndex });
  };

  // ৪. সাবমিট করা
  const handleSubmit = async () => {
    // উত্তরগুলো অ্যারে আকারে সাজাই (ব্যাকএন্ডের জন্য)
    const formattedAnswers = quiz.questions.map((_, index) => answers[index] ?? -1);

    try {
      const { data } = await api.post('/quizzes/submit', {
        quizId: id,
        answers: formattedAnswers
      });
      alert(`Quiz Submitted! You scored: ${data.result.score}/${data.result.totalMarks}`);
      navigate('/student/quizzes');
    } catch (error) {
      alert(error.response?.data?.message || "Submission failed");
    }
  };

  // সময় ফরম্যাট (MM:SS)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) return <div className="p-10 text-center">Loading Exam... ⏳</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header & Timer */}
      <div className="flex justify-between items-center bg-white p-4 rounded shadow mb-6 sticky top-0 z-10 border-b-4 border-blue-500">
        <h1 className="text-xl font-bold">{quiz.title}</h1>
        <div className={`text-xl font-mono font-bold px-4 py-2 rounded ${timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
          ⏱️ {formatTime(timeLeft)}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-8">
        {quiz.questions.map((q, qIndex) => (
          <div key={q._id} className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">
              {qIndex + 1}. {q.questionText}
            </h3>
            <div className="space-y-2">
              {q.options.map((opt, oIndex) => (
                <label 
                  key={oIndex} 
                  className={`block p-3 border rounded cursor-pointer transition ${answers[qIndex] === oIndex ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'}`}
                >
                  <input 
                    type="radio" 
                    name={`q-${qIndex}`} 
                    className="mr-3"
                    checked={answers[qIndex] === oIndex}
                    onChange={() => handleOptionSelect(qIndex, oIndex)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="mt-8 text-center">
        <button 
          onClick={handleSubmit}
          className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-700 shadow-lg transition transform hover:scale-105"
        >
          Submit Exam ✅
        </button>
      </div>
    </div>
  );
};

export default TakeExam;