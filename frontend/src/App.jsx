import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts & Guards
import AdminLayout from './components/layout/AdminLayout';
import RequireAuth from './components/common/RequireAuth';

// Public Pages
import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Courses from './pages/admin/Courses'; // নতুন তৈরি করা পেজ
import Students from './pages/admin/Students';
import Teachers from './pages/admin/Teachers';
import Batches from './pages/admin/Batches';
import Payments from './pages/admin/Payments';

// Student Pages
import StudentLayout from './components/layout/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import Attendance from './pages/student/Attendance';
import Assignments from './pages/student/Assignments';
import Notifications from './pages/student/Notifications';
import Quizzes from './pages/student/Quizzes';
import TakeExam from './pages/student/TakeExam';

//Teacher Pages
import TeacherLayout from './components/layout/TeacherLayout';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherAttendance from './pages/teacher/TeacherAttendance';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ==========================
            🌍 PUBLIC ROUTES (সবার জন্য)
           ========================== */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<RequireAuth allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="courses" element={<Courses />} />
            <Route path="students" element={<Students />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="batches" element={<Batches />} />
            <Route path="payments" element={<Payments />} />
          </Route>
        </Route>

        {/* 🔒 Student Routes */}
        <Route element={<RequireAuth allowedRoles={['student']} />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="my-courses" element={<h1 className="p-10">Classroom Coming Soon...</h1>} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="quizzes" element={<Quizzes />} />
            <Route path="quiz/:id" element={<TakeExam />} />
          </Route>
        </Route>

        {/* 🔒 Teacher Routes */}
        <Route element={<RequireAuth allowedRoles={['teacher']} />}>
          <Route path="/teacher" element={<TeacherLayout />}>
            <Route path="dashboard" element={<TeacherDashboard />} />
            {/* Attendance Page পরের ধাপে বানাবো */}
            <Route path="attendance" element={<TeacherAttendance />} />
          </Route>
        </Route>



        {/* ==========================
            🚫 404 ROUTE (ভুল লিংকের জন্য)
           ========================== */}
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold text-red-500">404</h1>
            <p className="text-xl mt-2">Page Not Found 😢</p>
          </div>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;