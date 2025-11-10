import { useEffect, useState } from "react";
import API from "../../../utils/axiosInstance";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ClipboardList, User, BookOpen, Calendar, FileText } from "lucide-react";

export default function MarksTracking() {
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [records, setRecords] = useState([]);
    const [form, setForm] = useState({
        teacherId: "",
        course: "",
        subject: "",
        examTitle: "",
        examDate: "",
        marksData: [],
    });

    // ✅ Load initial data
    useEffect(() => {
        fetchTeachers();
        fetchStudents();
        fetchMarksRecords();
    }, []);

    const fetchTeachers = async () => {
        try {
            const { data } = await API.get("/coordinator/teachers");
            setTeachers(data);
        } catch {
            toast.error("Failed to load teachers ❌");
        }
    };

    const fetchStudents = async () => {
        try {
            const { data } = await API.get("/coordinator/students");
            setStudents(data);
            // initialize empty marksData
            setForm((prev) => ({
                ...prev,
                marksData: data.map((s) => ({
                    student: s._id,
                    marksObtained: "",
                    totalMarks: "",
                })),
            }));
        } catch {
            toast.error("Failed to load students ❌");
        }
    };

    const fetchMarksRecords = async () => {
        try {
            const { data } = await API.get("/marks");
            setRecords(data);
        } catch {
            toast.error("Failed to load marks records ❌");
        }
    };

    // ✅ Handle input
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleMarksChange = (index, field, value) => {
        const updated = [...form.marksData];
        updated[index][field] = value;
        setForm({ ...form, marksData: updated });
    };

    // ✅ Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.teacherId || !form.course || !form.subject || !form.examTitle || !form.examDate)
            return toast.error("All fields are required!");

        try {
            await API.post("/marks", form);
            toast.success("Marks record added successfully ✅");
            fetchMarksRecords();
            setForm({
                teacherId: "",
                course: "",
                subject: "",
                examTitle: "",
                examDate: "",
                marksData: students.map((s) => ({
                    student: s._id,
                    marksObtained: "",
                    totalMarks: "",
                })),
            });
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save marks ❌");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-white"
        >
            <h1 className="text-3xl font-extrabold mb-10 bg-gradient-to-r from-[#7ED6F4] to-[#0077C8] bg-clip-text text-transparent flex items-center gap-2">
                <ClipboardList size={26} /> Marks Tracking
            </h1>

            {/* 🧾 Add Marks Form */}
            <form
                onSubmit={handleSubmit}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl mb-10"
            >
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <select
                        name="teacherId"
                        value={form.teacherId}
                        onChange={handleChange}
                        className="bg-white/20 p-3 rounded-xl text-white outline-none focus:ring-2 focus:ring-[#7ED6F4]"
                    >
                        <option value="">Select Teacher</option>
                        {teachers.map((t) => (
                            <option key={t._id} value={t._id}>
                                {t.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        name="course"
                        placeholder="Course Name"
                        value={form.course}
                        onChange={handleChange}
                        className="bg-white/20 p-3 rounded-xl text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#7ED6F4]"
                    />

                    <input
                        type="text"
                        name="subject"
                        placeholder="Subject Name"
                        value={form.subject}
                        onChange={handleChange}
                        className="bg-white/20 p-3 rounded-xl text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#7ED6F4]"
                    />

                    <input
                        type="text"
                        name="examTitle"
                        placeholder="Exam Title (e.g., Midterm)"
                        value={form.examTitle}
                        onChange={handleChange}
                        className="bg-white/20 p-3 rounded-xl text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#7ED6F4]"
                    />

                    <input
                        type="date"
                        name="examDate"
                        value={form.examDate}
                        onChange={handleChange}
                        className="bg-white/20 p-3 rounded-xl text-white outline-none focus:ring-2 focus:ring-[#7ED6F4]"
                    />
                </div>

                <h2 className="mt-6 mb-3 font-semibold text-[#7ED6F4]">Enter Marks for Each Student:</h2>

                {/* 🎓 Student Marks Entry Section */}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-h-[480px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-[#0077C8]/40 scrollbar-track-transparent">
                    {students.map((s, i) => (
                        <motion.div
                            key={s._id}
                            whileHover={{ scale: 1.04 }}
                            transition={{ duration: 0.25 }}
                            className="relative rounded-2xl bg-white/10 backdrop-blur-2xl 
                 border border-white/20 shadow-[0_4px_15px_rgba(0,0,0,0.2)] 
                 hover:shadow-[0_0_20px_rgba(126,214,244,0.6)] 
                 transition-all duration-300 flex flex-col items-center 
                 justify-between p-5"
                        >
                            {/* 👨‍🎓 Student Name */}
                            <p className="font-semibold text-[#7ED6F4] text-center mb-3 border-b border-white/10 w-full pb-2 truncate">
                                {s.name}
                            </p>

                            {/* 🔢 Inputs */}
                            <div className="flex flex-col w-full gap-3">
                                <div className="relative">
                                    <input
                                        type="number"
                                        placeholder="Marks Obtained"
                                        value={form.marksData[i]?.marksObtained || ""}
                                        onChange={(e) =>
                                            handleMarksChange(i, "marksObtained", e.target.value)
                                        }
                                        className="w-full px-3 py-2 rounded-xl bg-white/15 text-white 
                       placeholder-gray-400 text-sm outline-none 
                       focus:ring-2 focus:ring-[#7ED6F4] focus:bg-white/20 
                       transition-all shadow-inner"
                                    />
                                    <span className="absolute top-2 right-3 text-xs opacity-60">/</span>
                                </div>
                                <input
                                    type="number"
                                    placeholder="Total Marks"
                                    value={form.marksData[i]?.totalMarks || ""}
                                    onChange={(e) => handleMarksChange(i, "totalMarks", e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-white/15 text-white 
                     placeholder-gray-400 text-sm outline-none 
                     focus:ring-2 focus:ring-[#7ED6F4] focus:bg-white/20 
                     transition-all shadow-inner"
                                />
                            </div>

                            {/* 🌟 Subtle Glow Animation */}
                            <motion.div
                                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#0077C8]/10 to-[#7ED6F4]/10 opacity-0 group-hover:opacity-100 transition duration-500 blur-xl -z-10"
                            />
                        </motion.div>
                    ))}
                </div>


                <button
                    type="submit"
                    className="mt-6 px-8 py-3 rounded-xl bg-[#0077C8] hover:bg-[#0061A8] transition-all font-semibold shadow-lg flex items-center gap-2 mx-auto"
                >
                    <FileText size={18} /> Save Marks Record
                </button>
            </form>

            {/* 📊 Records Display */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl">
                <h2 className="text-2xl font-semibold mb-4 text-[#7ED6F4] flex items-center gap-2">
                    <BookOpen size={20} /> All Exam Records
                </h2>

                {records.length === 0 ? (
                    <p className="text-gray-300 text-center py-8">No records yet.</p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {records.map((r) => (
                            <motion.div
                                key={r._id}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white/10 border border-white/20 p-4 rounded-2xl shadow-lg"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <p className="font-semibold text-[#7ED6F4]">{r.examTitle}</p>
                                    <span className="text-xs text-gray-400">
                                        {new Date(r.examDate).toLocaleDateString("en-IN")}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-300">
                                    👨‍🏫 {r.teacher?.name} — {r.subject}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">📘 {r.course}</p>

                                <ul className="text-xs text-gray-300 mt-3 max-h-28 overflow-y-auto list-disc ml-4 space-y-1">
                                    {r.marksData.map((m, i) => (
                                        <li key={i}>
                                            {m.student?.name}:{" "}
                                            <span className="text-[#7ED6F4] font-medium">
                                                {m.marksObtained}/{m.totalMarks}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
