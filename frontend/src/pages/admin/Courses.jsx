// frontend/src/pages/admin/Courses.jsx
import { useEffect, useState } from 'react';
import api from '../../services/api';

const Courses = () => {
    const [courses, setCourses] = useState([]); // কোর্স লিস্ট রাখার জন্য
    const [showForm, setShowForm] = useState(false); // ফর্ম দেখাবো কি না
    const [formData, setFormData] = useState({
        title: '',
        courseCode: '',
        description: '',
        price: '',
        duration: ''
    });

    // ১. পেজ লোড হলেই কোর্সগুলো নিয়ে আসবে
    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const { data } = await api.get('/courses');
            setCourses(data);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    // ২. ফর্মের ইনপুট হ্যান্ডেল করা
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ৩. নতুন কোর্স সাবমিট করা
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/courses', formData);
            alert('Course Created Successfully! 🎉');
            setFormData({ title: '', courseCode: '', description: '', price: '', duration: '' }); // ফর্ম ক্লিয়ার
            setShowForm(false); // ফর্ম লুকিয়ে ফেলা
            fetchCourses(); // লিস্ট রিফ্রেশ করা
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating course');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Courses 📚</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    {showForm ? 'Close Form' : '+ Add New Course'}
                </button>
            </div>

            {/* 📝 Add Course Form (Condition based) */}
            {showForm && (
                <div className="bg-white p-6 rounded shadow-md mb-8 border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Add New Course</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="title" placeholder="Course Title" value={formData.title} onChange={handleChange} className="p-2 border rounded" required />
                        <input name="courseCode" placeholder="Code (e.g., CSE101)" value={formData.courseCode} onChange={handleChange} className="p-2 border rounded" required />
                        <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} className="p-2 border rounded" required />
                        <input name="duration" placeholder="Duration" value={formData.duration} onChange={handleChange} className="p-2 border rounded" required />
                        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="p-2 border rounded md:col-span-2" required />

                        <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700 md:col-span-2">
                            Create Course
                        </button>
                    </form>
                </div>
            )}

            {/* 📋 Course List Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <div key={course._id} className="bg-white p-4 rounded shadow border hover:shadow-lg transition">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-lg text-blue-800">{course.title}</h3>
                                <span className="bg-gray-200 text-xs px-2 py-1 rounded">{course.courseCode}</span>
                            </div>
                            <p className="text-gray-600 text-sm mt-2">{course.description.substring(0, 60)}...</p>
                            <div className="mt-4 flex justify-between items-center text-sm font-semibold">
                                <span className="text-green-600">Price - {course.price}</span>
                                <span className="text-orange-600">Duration - {course.duration}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No courses found. Add one!</p>
                )}
            </div>
        </div>
    );
};

export default Courses;