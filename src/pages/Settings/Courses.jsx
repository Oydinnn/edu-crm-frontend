import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import RefreshIcon from "@mui/icons-material/Refresh";
import api from "../../services/axios";

const LESSON_DURATIONS = ["60 min", "90 min", "120 min", "150 min", "180 min"];
const COURSE_DURATIONS = ["1 oy", "2 oy", "3 oy", "4 oy", "6 oy", "8 oy"];

const emptyForm = {
  name: "",
  lessonDuration: "",
  courseDuration: "",
  price: "",
  description: "",
};

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [form, setForm] = useState(emptyForm);
  
  const [loading, setLoading] = useState(false);
  const [activeBranch, setActiveBranch] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    getCourses();
  }, []);

  const getCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/courses");
      if (res.status === 200) {
        setCourses(res.data.data || []);
      }
    } catch (error) {
      console.error("Kurslarni yuklashda xatolik:", error);
      showToast("Kurslarni yuklashda xatolik", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  const addCourse = async (courseData) => {
    try {
      const payload = {
        name: courseData.name,
        description: courseData.description,
        price: Number(courseData.price),
        duration_month: parseInt(courseData.courseDuration),
        duration_hours: parseInt(courseData.lessonDuration),
      };

      const res = await api.post("/courses", payload);
      if (res.status === 201 || res.data?.success) {
        await getCourses();
        showToast("Kurs muvaffaqiyatli qo'shildi", "success");
        return true;
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Xatolik yuz berdi", "error");
      return false;
    }
  };

  const updateCourse = async (id, courseData) => {
    try {
      const payload = {
        name: courseData.name,
        description: courseData.description,
        price: Number(courseData.price),
        duration_month: parseInt(courseData.courseDuration),
        duration_hours: parseInt(courseData.lessonDuration),
      };

      const res = await api.patch(`/courses/${id}`, payload);
      if (res.status === 200 || res.data?.success) {
        await getCourses();
        showToast("Kurs yangilandi", "success");
        return true;
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Xatolik yuz berdi", "error");
      return false;
    }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Bu kursni o'chirmoqchimisiz?")) return;
    
    try {
      const res = await api.delete(`/courses/${id}`);
      if (res.status === 200 || res.data?.success) {
        await getCourses();
        showToast("Kurs o'chirildi", "success");
      }
    } catch (error) {
      showToast("O'chirishda xatolik", "error");
    }
  };

  const filteredCourses = courses.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch; 
  });

  const openAddDrawer = () => {
    setEditCourse(null);
    setForm(emptyForm);
    setDrawerOpen(true);
  };

  const openEditDrawer = (course) => {
    setEditCourse(course);
    setForm({
      name: course.name,
      branchIds: course.branchIds || [],
      lessonDuration: course.duration_hours ? `${course.duration_hours} min` : "",
      courseDuration: course.duration_month ? `${course.duration_month} oy` : "",
      price: course.price?.toString() || "",
      description: course.description || "",
    });
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditCourse(null);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;

    if (editCourse) {
      const success = await updateCourse(editCourse.id, form);
      if (success) closeDrawer();
    } else {
      const success = await addCourse(form);
      if (success) closeDrawer();
    }
  };

  if (loading && courses.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1f39a1]"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* ✨ CSS-animatsiya */}
      <style>{`
        @keyframes courseFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .course-enter {
          animation: courseFadeIn 0.4s ease-out both;
        }
      `}</style>

      {/* 🔔 Toast */}
      {toast.show && (
        <div className={`fixed top-5 right-5 z-[100] px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium flex items-center gap-2 transition-all duration-300 ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.type === "success" ? "✅" : "❌"} {toast.message}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-5 gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-gray-800">Kurslar</h2>
            <button onClick={getCourses} className="text-gray-400 hover:text-[#1f39a1]">
              <RefreshIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Kurs nomi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-3 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1f39a1]/20"
            />
          </div>

          <button
            onClick={openAddDrawer}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-[#1f39a1] hover:bg-[#162870] text-white text-sm font-medium px-4 py-2 rounded-lg transition-all shadow-md"
          >
            <AddIcon className="w-5 h-5" />
            Kurs qo'shish
          </button>
        </div>

        {/* Courses grid */}
        {filteredCourses.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-12">Kurslar topilmadi</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="course-enter relative rounded-xl border border-gray-100 bg-white hover:bg-[#f0f4ff] hover:border-[#1f39a1]/20 p-4 transition-all duration-300 group shadow-sm hover:shadow-md"
              >
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={() => deleteCourse(course.id)} 
                    className="p-1.5 rounded-lg hover:bg-red-50/70 text-gray-400 hover:text-red-500 transition-all duration-200"
                  >
                    <DeleteIcon className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => openEditDrawer(course)} 
                    className="p-1.5 rounded-lg hover:bg-[#f0f4ff] text-gray-400 hover:text-[#1f39a1] transition-all duration-200"
                  >
                    <EditIcon className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm font-semibold text-gray-800 mb-1 pr-14">{course.name}</p>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{course.description}</p>

                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs px-2 py-0.5 bg-white/70 border border-gray-200 rounded-md text-gray-600">
                    {course.duration_hours} soat
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-white/70 border border-gray-200 rounded-md text-gray-600">
                    {course.duration_month} oy
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-white/70 border border-gray-200 rounded-md text-gray-600 font-medium">
                    {course.price} so'm
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Overlay & Drawer */}
      {drawerOpen && <div className="fixed inset-0 bg-black/40 z-40" onClick={closeDrawer} />}
      
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-gray-900 text-lg">{editCourse ? "Tahrirlash" : "Yangi kurs"}</h3>
          <button onClick={closeDrawer}><CloseIcon className="w-5 h-5 text-gray-400" /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nomi</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Dars davomiyligi</label>
            <select value={form.lessonDuration} onChange={(e) => setForm({ ...form, lessonDuration: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm">
              <option value="">Tanlang</option>
              {LESSON_DURATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Kurs davomiyligi (oy)</label>
            <select value={form.courseDuration} onChange={(e) => setForm({ ...form, courseDuration: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm">
              <option value="">Tanlang</option>
              {COURSE_DURATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Narx (so'm)</label>
            <div className="relative">
              <MonetizationOnIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tavsif</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm resize-none" />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={closeDrawer} className="px-5 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Bekor qilish</button>
          <button onClick={handleSave} disabled={!form.name} className="px-6 py-2 text-sm text-white bg-[#1f39a1] hover:bg-[#162870] rounded-lg disabled:opacity-40">Saqlash</button>
        </div>
      </div>
    </div>
  );
}