import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// 🔹 Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// 🔹 Admin
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import ManageUsers from "./pages/dashboard/admin/ManageUsers";
import AssignTeacher from "./pages/dashboard/admin/AssignTeacher";
import ScheduleClass from "./pages/dashboard/admin/ScheduleClass";


//Coordinator
import CoordinatorLayout from "./layouts/CoordinatorLayout";
import CoordinatorDashboard from "./pages/dashboard/coordinator/CoordinatorDashboard";
import TeachingRecords from "./pages/dashboard/coordinator/TeachingRecords";
import AttendanceManager from "./pages/dashboard/coordinator/AttendanceManager";
import AttendanceRecords from "./pages/dashboard/coordinator/AttendanceRecords";
import StudentRoadmap from "./pages/dashboard/coordinator/StudentRoadmap";
import MarksTracking from "./pages/dashboard/coordinator/MarksTracking";


//Teacher
import HomeworkManager from "./pages/dashboard/teacher/HomeworkManager";
import TeacherDashboard from "./pages/dashboard/teacher/TeacherDashboard";
import UpcomingClasses from "./pages/dashboard/teacher/UpcomingClasses";
import TeacherLayout from "./layouts/TeacherLayout";
// 🔹 Utilities
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>
        {/* 🏠 Default Route */}
        <Route
          path="/"
          element={
            token ? (
              <Navigate to={`/${role}`} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* 🔐 Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* 🧩 Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="assign" element={<AssignTeacher />} />
          <Route path="schedule-class" element={<ScheduleClass />} />
        </Route>

        {/* 🔹 Academic Coordinator Routes */}
        <Route
          path="/academicCoordinator"
          element={
            <ProtectedRoute allowedRole="academicCoordinator">
              <CoordinatorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CoordinatorDashboard />} />
          <Route path="teaching-records" element={<TeachingRecords />} />
          <Route path="attendance-manager" element={<AttendanceManager />} />
          <Route path="attendance-records" element={<AttendanceRecords />} />
          <Route path="roadmap" element={<StudentRoadmap />} />
          <Route path="marks-tracking" element={<MarksTracking />} />
        </Route>

 {/* 🔹 Teacher Routes */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute role="teacher">
              <TeacherLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="upcoming-classes" element={<UpcomingClasses />} />
          <Route path="homework" element={<HomeworkManager />} />
        </Route>


        {/* 🚫 404 Fallback */}
        <Route
          path="*"
          element={
            <div className="flex flex-col items-center justify-center min-h-screen text-white bg-gradient-to-br from-[#002F6C] via-[#003B89] to-[#0077C8]">
              <h1 className="text-5xl font-bold mb-4">404</h1>
              <p className="text-gray-300 text-lg mb-6">
                Page not found or you don’t have permission.
              </p>
              <button
                onClick={() =>
                (token
                  ? (window.location.href = `/${role}`)
                  : (window.location.href = "/login"))
                }
                className="px-6 py-2 bg-[#0077C8] rounded-xl font-semibold hover:bg-[#0061A8] transition-all duration-200"
              >
                Go Back
              </button>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
