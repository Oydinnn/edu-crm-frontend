import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSidebar } from "../../contexts/SidebarContext";

import GroupIcon from "@mui/icons-material/Group";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import ArchiveIcon from "@mui/icons-material/Archive";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import api from "../../services/axios";

// ============================================================
// JADVAL USTUNLARI — header va row uchun bir xil kenglik
// ============================================================
const COLS = [
  { label: "Status", cls: "flex-1" },
  { label: "Guruh", cls: "flex-1" },
  { label: "Kurs", cls: "flex-1" },
  { label: "Davomiyligi", cls: "flex-1" },
  { label: "Dars vaqti", cls: "flex-1" },
  { label: "Xona", cls: "flex-1" },
  { label: "O'qituvchi", cls: "flex-1" },
  { label: "Talabalar", cls: "flex-1" },
  { label: "Amallar", cls: "flex-1" },
];

function StatCard({ icon, label, value, bg, color }) {
  const Icon = icon;
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-sm p-6 hover:shadow-md hover:border-[#1f39a1]/20 dark:hover:border-blue-500/30 transition-all duration-300 group flex-1 min-w-[130px]">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-[#4a5568] dark:text-gray-400 font-medium">{label}</p>
          <div className="text-3xl font-bold mt-2 text-gray-800 dark:text-white">{value}</div>
        </div>
        <div className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}>
          {Icon ? <Icon className={`${color} w-6 h-6`} /> : null}
        </div>
      </div>
    </div>
  );
}

function GuruhQoshishModal({ onClose, onSave }) {
  // --- 1. FORM STATE (Backend kutgan formatda) ---
  const [forma, setForma] = useState({
    name: "",
    description: "",
    course_id: 0,
    room_id: 0,
    start_date: "",
    week_day: [], // ["MONDAY", "TUESDAY"]
    start_time: "09:00",
    max_student: 20,
    teachers: [], // [2, 5] kabi ID'lar massivi
    students: [], // [1, 2] kabi ID'lar massivi
  });

  // --- 2. BACKENDDAN KELGAN RO'YXATLAR ---
  const [options, setOptions] = useState({
    courses: [],
    rooms: [],
    allTeachers: [],
    allStudents: [],
  });

  // --- 3. MA'LUMOTLARNI YUKLASH ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [c, r, t, s] = await Promise.all([
          api.get("/courses"),
          api.get("/rooms"),
          api.get("/teachers"),
          api.get("/students"),
        ]);
        setOptions({
          courses: c.data?.data || c.data,
          rooms: r.data?.data || r.data,
          allTeachers: t.data?.data || t.data,
          allStudents: s.data?.data || s.data,
        });
      } catch (err) {
        console.error("Yuklashda xato:", err);
      }
    };
    fetchData();
  }, []);

  // --- 4. YORDAMCHI FUNKSIYALAR ---
  const toggleSelection = (type, id) => {
    const numericId = Number(id);
    if (!numericId) return;
    setForma((prev) => ({
      ...prev,
      [type]: prev[type].includes(numericId)
        ? prev[type].filter((item) => item !== numericId)
        : [...prev[type], numericId],
    }));
  };

  const handleDayClick = (day) => {
    setForma((f) => ({
      ...f,
      week_day: f.week_day.includes(day)
        ? f.week_day.filter((d) => d !== day)
        : [...f.week_day, day],
    }));
  };

  const inputCls =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#1f39a1] outline-none transition-all";

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex justify-end "
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 w-full sm:w-[450px] h-full overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Yangi guruh</h2>
          <CloseIcon
            className="cursor-pointer text-gray-400 hover:text-red-500"
            onClick={onClose}
          />
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 flex-1">
          {/* Asosiy ma'lumotlar */}
          <div className="space-y-3">
            <input
              placeholder="Guruh nomi *"
              className={inputCls}
              onChange={(e) => setForma({ ...forma, name: e.target.value })}
            />
            <textarea
              placeholder="Tavsif"
              className={inputCls}
              onChange={(e) =>
                setForma({ ...forma, description: e.target.value })
              }
            />
          </div>

          {/* Kurs va Xona */}
          <div className="grid grid-cols-2 gap-3">
            <select
              className={inputCls}
              onChange={(e) =>
                setForma({ ...forma, course_id: Number(e.target.value) })
              }
            >
              <option value="">Kursni tanlang</option>
              {options.courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              className={inputCls}
              onChange={(e) =>
                setForma({ ...forma, room_id: Number(e.target.value) })
              }
            >
              <option value="">Xonani tanlang</option>
              {options.rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Haftalik kunlar */}
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Dars kunlari
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                "MONDAY",
                "TUESDAY",
                "WEDNESDAY",
                "THURSDAY",
                "FRIDAY",
                "SATURDAY",
                "SUNDAY",
              ].map((day) => (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all 
                    ${forma.week_day.includes(day) ? "bg-[#1f39a1] text-white border-[#1f39a1]" : "bg-white text-gray-500 border-gray-200 hover:border-[#1f39a1]"}`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Vaqt va Sana */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-gray-400">
                Boshlanish vaqti
              </label>
              <input
                type="time"
                className={inputCls}
                value={forma.start_time}
                onChange={(e) =>
                  setForma({ ...forma, start_time: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-gray-400">
                Boshlanish sanasi
              </label>
              <input
                type="date"
                className={inputCls}
                onChange={(e) =>
                  setForma({ ...forma, start_date: e.target.value })
                }
              />
            </div>
          </div>

          {/* O'qituvchilar tanlovi */}
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              O'qituvchilar
            </label>
            <select
              className={`${inputCls} mt-1`}
              onChange={(e) => toggleSelection("teachers", e.target.value)}
              value=""
            >
              <option value="">O'qituvchi tanlang...</option>
              {options.allTeachers.map((t) => (
                <option
                  key={t.id}
                  value={t.id}
                  disabled={forma.teachers.includes(t.id)}
                >
                  {t.full_name}
                </option>
              ))}
            </select>
            {/* Tanlangan o'qituvchilar ro'yxati (Chips) */}
            <div className="flex flex-wrap gap-2 mt-2">
              {forma.teachers.map((id) => {
                const teacher = options.allTeachers.find((t) => t.id === id);
                return (
                  <div
                    key={id}
                    className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-2 py-1 rounded-lg"
                  >
                    <span className="text-xs font-medium text-[#1f39a1]">
                      {teacher?.full_name}
                    </span>
                    <CloseIcon
                      style={{ fontSize: 14 }}
                      className="cursor-pointer text-blue-400 hover:text-red-500"
                      onClick={() => toggleSelection("teachers", id)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* TALABALAR TANLOVI */}
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Talabalar
            </label>
            <select
              className={inputCls}
              value="" // Tanlangandan keyin yana "tanlang" holatiga qaytishi uchun
              onChange={(e) => toggleSelection("students", e.target.value)}
            >
              <option value="">O'quvchini tanlang...</option>
              {options.allStudents.map((s) => (
                <option
                  key={s.id}
                  value={s.id}
                  disabled={forma.students.includes(s.id)} // Tanlangan bo'lsa o'chirib qo'yamiz
                >
                  {s.full_name}
                </option>
              ))}
            </select>

            {/* Tanlangan talabalarni ko'rsatish (Chips) */}
            <div className="flex flex-wrap gap-2 mt-2">
              {forma.students.map((id) => {
                const student = options.allStudents.find((s) => s.id === id);
                return (
                  <div
                    key={id}
                    className="flex items-center gap-2 bg-gray-100 border border-gray-200 px-2 py-1 rounded-lg"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      {student?.full_name}
                    </span>
                    <CloseIcon
                      style={{ fontSize: 14 }}
                      className="cursor-pointer text-gray-400 hover:text-red-500"
                      onClick={() => toggleSelection("students", id)}
                    />
                  </div>
                );
              })}
            </div>
            {forma.students.length === 0 && (
              <p className="text-[10px] text-gray-400 mt-1 italic">
                Hozircha hech kim qo'shilmadi
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex gap-3 bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-100"
          >
            Bekor qilish
          </button>
          <button
            onClick={() => onSave(forma)}
            className="flex-1 py-2.5 text-sm font-medium text-white bg-[#1f39a1] rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-800 transition-all"
          >
            Saqlash
          </button>
        </div>
      </div>
    </div>
  );
}

function GuruhTahrirlashModal({ guruh, onClose, onSave }) {
  // console.log("Guruh students:", guruh);
  // console.log("Guruh studentGroups:", guruh.studentGroups);
  const [forma, setForma] = useState({
    name: guruh.name || "",
    description: guruh.description || "",
    course_id: guruh.course_id || 0,
    room_id: guruh.room_id || 0,
    start_date: guruh.start_date?.slice(0, 10) || "",
    week_day: guruh.weekDay || [],
    start_time: /^\d{2}:\d{2}/.test(guruh.start_time ?? "")
      ? guruh.start_time.slice(0, 5)
      : "09:00",
    max_student: guruh.max_student || 20,
    teachers: guruh.teachers?.map((t) => t.id).filter((id) => id) || [],
    students: guruh.students?.map((s) => s.id).filter((id) => id) || [],
  });

  const [options, setOptions] = useState({
    courses: [],
    rooms: [],
    allTeachers: [],
    allStudents: [],
  });

  // Options yuklash
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [c, r, t, s] = await Promise.all([
          api.get("/courses"),
          api.get("/rooms"),
          api.get("/teachers"),
          api.get("/students"),
        ]);
        setOptions({
          courses: c.data?.data || c.data,
          rooms: r.data?.data || r.data,
          allTeachers: t.data?.data || t.data,
          allStudents: s.data?.data || s.data,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const toggleSelection = (type, id) => {
    const numericId = Number(id);
    if (!numericId) return;
    setForma((prev) => ({
      ...prev,
      [type]: prev[type].includes(numericId)
        ? prev[type].filter((item) => item !== numericId)
        : [...prev[type], numericId],
    }));
  };

  const inputCls =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#1f39a1] outline-none transition-all";

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex justify-end"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 w-full sm:w-[450px] h-full overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">
            Guruhni tahrirlash
          </h2>
          <CloseIcon
            className="cursor-pointer text-gray-400 hover:text-red-500"
            onClick={onClose}
          />
        </div>

        {/* Form */}
        <div className="p-6 space-y-5 flex-1">
          {/* Nom va tavsif */}
          <input
            placeholder="Guruh nomi *"
            className={inputCls}
            value={forma.name}
            onChange={(e) => setForma({ ...forma, name: e.target.value })}
          />
          <textarea
            placeholder="Tavsif"
            className={inputCls}
            value={forma.description}
            onChange={(e) =>
              setForma({ ...forma, description: e.target.value })
            }
          />

          {/* Kurs va Xona */}
          <div className="grid grid-cols-2 gap-3">
            <select
              className={inputCls}
              value={forma.course_id}
              onChange={(e) =>
                setForma({ ...forma, course_id: Number(e.target.value) })
              }
            >
              <option value="">Kursni tanlang</option>
              {options.courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              className={inputCls}
              value={forma.room_id}
              onChange={(e) =>
                setForma({ ...forma, room_id: Number(e.target.value) })
              }
            >
              <option value="">Xonani tanlang</option>
              {options.rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dars kunlari */}
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Dars kunlari
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                "MONDAY",
                "TUESDAY",
                "WEDNESDAY",
                "THURSDAY",
                "FRIDAY",
                "SATURDAY",
                "SUNDAY",
              ].map((day) => (
                <button
                  key={day}
                  onClick={() =>
                    setForma((f) => ({
                      ...f,
                      week_day: f.week_day.includes(day)
                        ? f.week_day.filter((d) => d !== day)
                        : [...f.week_day, day],
                    }))
                  }
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all
                    ${forma.week_day.includes(day) ? "bg-[#1f39a1] text-white border-[#1f39a1]" : "bg-white text-gray-500 border-gray-200"}`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Vaqt va sana */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-gray-400">
                Boshlanish vaqti
              </label>
              <input
                type="time"
                className={inputCls}
                value={forma.start_time}
                onChange={(e) =>
                  setForma({ ...forma, start_time: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-gray-400">
                Boshlanish sanasi
              </label>
              <input
                type="date"
                className={inputCls}
                value={forma.start_date}
                onChange={(e) =>
                  setForma({ ...forma, start_date: e.target.value })
                }
              />
            </div>
          </div>

          {/* O'qituvchilar */}
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              O'qituvchilar
            </label>
            <select
              className={`${inputCls} mt-1`}
              value=""
              onChange={(e) => toggleSelection("teachers", e.target.value)}
            >
              <option value="">O'qituvchi tanlang...</option>
              {options.allTeachers.map((t) => (
                <option
                  key={t.id}
                  value={t.id}
                  disabled={forma.teachers.includes(t.id)}
                >
                  {t.full_name}
                </option>
              ))}
            </select>
            <div className="flex flex-wrap gap-2 mt-2">
              {forma.teachers.map((id) => {
                const t = options.allTeachers.find((t) => t.id === id);
                return (
                  <div
                    key={id}
                    className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-2 py-1 rounded-lg"
                  >
                    <span className="text-xs font-medium text-[#1f39a1]">
                      {t?.full_name}
                    </span>
                    <CloseIcon
                      style={{ fontSize: 14 }}
                      className="cursor-pointer text-blue-400 hover:text-red-500"
                      onClick={() => toggleSelection("teachers", id)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Talabalar */}
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Talabalar
            </label>

            <select
              className={inputCls}
              value=""
              onChange={(e) => toggleSelection("students", e.target.value)}
            >
              <option value="">O'quvchini tanlang...</option>
              {options.allStudents.map((s) => (
                <option
                  key={s.id}
                  value={s.id}
                  disabled={forma.students.includes(s.id)}
                >
                  {s.full_name}
                </option>
              ))}
            </select>
            <div className="flex flex-wrap gap-2 mt-2">
              {forma.students.map((id) => {
                const s = options.allStudents.find((s) => s.id === id);
                return (
                  <div
                    key={id}
                    className="flex items-center gap-2 bg-gray-100 border border-gray-200 px-2 py-1 rounded-lg"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      {s?.full_name}
                    </span>
                    <CloseIcon
                      style={{ fontSize: 14 }}
                      className="cursor-pointer text-gray-400 hover:text-red-500"
                      onClick={() => toggleSelection("students", id)}
                    />
                  </div>
                );
              })}
            </div>
            {forma.students.length === 0 && (
              <p className="text-[10px] text-gray-400 mt-1 italic">
                Hozircha hech kim qo'shilmadi
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex gap-3 bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-100"
          >
            Bekor qilish
          </button>
          <button
            onClick={() => onSave(guruh.id, forma)}
            className="flex-1 py-2.5 text-sm font-medium text-white bg-[#1f39a1] rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-800 transition-all"
          >
            Saqlash
          </button>
        </div>
      </div>
    </div>
  );
}

function GuruhKorishModal({ guruh, onClose }) {
  if (!guruh) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h2 className="text-2xl font-bold text-[#1f39a1]">{guruh.name}</h2>

            <p className="text-sm text-gray-400 mt-1">{guruh.course}</p>
          </div>

          <button onClick={onClose}>
            <CloseIcon className="text-gray-400 hover:text-red-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Info cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Xona</p>

              <p className="font-semibold text-[#4a5568]">{guruh.room}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Status</p>

              <p
                className={`font-semibold ${
                  guruh.status === "active" ? "text-green-500" : "text-gray-500"
                }`}
              >
                {guruh.status}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Boshlanish sanasi</p>

              <p className="font-semibold text-[#4a5568]">
                {new Date(guruh.start_date).toLocaleDateString("ru-RU")}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Dars vaqti</p>

              <p className="font-semibold text-[#4a5568]">{guruh.start_time}</p>
            </div>
          </div>

          {/* Dars kunlari */}
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-2">
              Dars kunlari
            </p>

            <div className="flex flex-wrap gap-2">
              {guruh.weekDay?.map((day, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-[#1f39a1] text-white text-xs"
                >
                  {day}
                </span>
              ))}
            </div>
          </div>

          {/* Teachers */}
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-2">
              O'qituvchilar
            </p>

            <div className="flex flex-wrap gap-2">
              {guruh.teachers?.map((t) => (
                <span
                  key={t.id}
                  className="px-3 py-1 rounded-full bg-blue-100 text-[#1f39a1] text-sm"
                >
                  {t.full_name}
                </span>
              ))}
            </div>
          </div>

          {/* Students */}
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-2">
              Talabalar
            </p>

            <div className="flex flex-wrap gap-2">
              {guruh.students?.length > 0 ? (
                guruh.students.map((s) => (
                  <span
                    key={s.id}
                    className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm"
                  >
                    {s.full_name}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-400">Talabalar mavjud emas</p>
              )}
            </div>
          </div>

          {/* Description */}
          {guruh.description && (
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-2">Tavsif</p>

              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                {guruh.description}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Groups() {
  // isCollapsed Layout da ml ni boshqaradi — bu yerda ishlatilmaydi
  const [modalOchiq, setModalOchiq] = useState(false);
  const [aktifTab, setAktifTab] = useState("guruhlar");
  const [guruhlar, setGuruhlar] = useState([]);
  const [ochiqMenu, setOchiqMenu] = useState(null);
  const [tahrirlashModal, setTahrirlashModal] = useState(false);
  const [tanlangan, setTanlangan] = useState(null); // tahrirlash uchun guruh
  const [korishModal, setKorishModal] = useState(false);

  // Groups() ichida getGroups funksiyasini o'zgartiring:
  const getGroups = async (status = "active") => {
    try {
      // status parametrini query ga qo'shamiz
      const res = await api.get(`/groups/all?status=${status}`);
      const list = res.data?.data ?? res.data;
      setGuruhlar(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Xato:", error);
    }
  };

  // Sahifa ochilganda — active guruhlar
  useEffect(() => {
    getGroups("active");
  }, []);

  // Tab o'zgarganda — mos statusdagi guruhlarni yuklaymiz
  useEffect(() => {
    if (aktifTab === "guruhlar") {
      getGroups("active");
    } else {
      getGroups("completed"); // arxiv = completed
    }
  }, [aktifTab]); // ← aktifTab o'zgarganda ishga tushadi

  // Toggle — backend bilan
  const toggleFaol = async (id, joriyStatus) => {
    // active → completed (arxiv), completed → active
    const yangiStatus = joriyStatus === "active" ? "completed" : "active";

    // UI ni darhol yangilaymiz
    setGuruhlar((prev) => prev.filter((g) => g.id !== id));

    try {
      await api.patch(`/groups/${id}/status`, { status: yangiStatus });
    } catch (error) {
      getGroups(aktifTab === "guruhlar" ? "active" : "completed");
      alert("Status o'zgartirib bo'lmadi!");
    }
  };

  // Modal saqlash
  const guruhSaqlash = async (formaData) => {
    // Oddiy validatsiya
    if (
      !formaData.name ||
      !formaData.course_id ||
      !formaData.room_id ||
      formaData.week_day.length === 0
    ) {
      alert("Iltimos, yulduzcha bilan belgilangan maydonlarni to'ldiring!");
      return;
    }

    try {
      // SIZ TAQDIM ETGAN PAYLOAD FORMATIDA:
      const finalPayload = {
        name: formaData.name,
        description: formaData.description || "",
        course_id: formaData.course_id,
        room_id: formaData.room_id,
        start_date: formaData.start_date,
        week_day: formaData.week_day, // ["MONDAY", "TUESDAY"]
        start_time: formaData.start_time,
        max_student: Number(formaData.max_student) || 20,
        teachers: formaData.teachers, // [2, 5]
        students: formaData.students, // [1, 2]
      };

      const res = await api.post("/groups", finalPayload);

      if (res.status === 200 || res.status === 201) {
        await getGroups();
        // setGuruhlar((prev) => [res.data?.data || res.data, ...prev]);
        setModalOchiq(false);
        alert("Guruh muvaffaqiyatli saqlandi!");
      }
    } catch (error) {
      console.error("To'liq xato obyekti:", error); // Hammasini ko'rish uchun
      if (error.response) {
        // Server javob qaytardi, lekin status 2xx emas
        alert(error.response.data?.message || "Serverda xatolik");
      } else if (error.request) {
        // So'rov yuborildi, lekin javob kelmadi
        alert("Server bilan aloqa yo'q (Network Error)");
      } else {
        // So'rovni shakllantirishda xato
        alert("Xatolik: " + error.message);
      }
    }
  };

  // Groups() return dan oldin:
  useEffect(() => {
    const handler = () => setOchiqMenu(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    // Layout ml ni boshqaradi — bu yerda faqat bg
    <div className="min-h-screen bg-gray-50/50  dark:bg-slate-950">
      <div className="p-4 sm:p-6">
        {/* ── Sarlavha + tugma ── */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-[#4a5568]  dark:text-blue-400">
            Guruhlar
          </h1>
          <button
            onClick={() => setModalOchiq(true)}
            className="bg-[#1f39a1] hover:bg-[#162870] text-white font-normal py-2 px-3 sm:px-4
              rounded-lg transition-all duration-300 shadow-md hover:shadow-lg
              flex items-center gap-2 text-sm"
          >
            <AddIcon style={{ fontSize: 18 }} />
            <span className="hidden sm:inline">Guruh qo'shish</span>
            <span className="sm:hidden">Qo'shish</span>
          </button>
        </div>

        {/* ── Tablar ── */}
        <div className="flex gap-1 border-b border-gray-200 mb-6">
          {[
            { key: "guruhlar", label: "Guruhlar", icon: null },
            {
              key: "arxiv",
              label: "Arxiv",
              icon: <ArchiveIcon style={{ fontSize: 16 }} />,
            },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setAktifTab(key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium
                border-b-2 transition-all duration-300 -mb-px
                ${
                  aktifTab === key
                    ? "border-[#1f39a1] text-[#1f39a1]"
                    : "border-transparent text-[#4a5568] hover:text-[#1f39a1] hover:bg-[#f0f4ff] rounded-t-lg"
                }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* ── Statistika kartochkalari ── */}
        {/* flex-wrap: kichik ekranda ostiga tushadi, min-w: haddan kichik bo'lmaydi */}
        <div className="flex flex-wrap gap-3 sm:gap-4 mb-6">
          <StatCard
            icon={GroupIcon}
            bg="bg-[#f0f4ff] dark:bg-slate-700/50"
            color="text-[#1f39a1] dark:text-blue-400"
            label="Jami guruhlar"
            value={guruhlar.length}
          />
          <StatCard
            icon={SchoolIcon}
            bg="bg-[#f0f4ff] dark:bg-slate-700/50"
            color="text-[#1f39a1] dark:text-blue-400"
            label="O'qituvchilar"
            value="11"
          />
          <StatCard
            icon={PersonIcon}
            bg="bg-[#f0f4ff] dark:bg-slate-700/50"
            color="text-[#1f39a1] dark:text-blue-400"
            label="O'quvchilar"
            value={guruhlar.reduce((s, g) => s + (g.student_count ?? 0), 0)}
          />
        </div>

        {/* ── Jadval ── */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            {/* Header */}
            <div className="flex items-center px-4 py-3.5 bg-[#f0f4ff]/60 border-b border-gray-100 min-w-max">
              {COLS.map((col, i) => (
                <div key={i} className={`${col.cls} px-1`}>
                  <span className="text-xs font-semibold text-[#1f39a1]/60 uppercase tracking-wide">
                    {col.icon ? (
                      <span
                        className="flex justify-center items-center gap-1 cursor-pointer"
                        onClick={() =>
                          getGroups(
                            aktifTab === "guruhlar" ? "active" : "completed",
                          )
                        }
                      >
                        {col.label} <RefreshIcon style={{ fontSize: 15 }} />
                      </span>
                    ) : (
                      col.label
                    )}
                  </span>
                </div>
              ))}
            </div>

            {/* Ma'lumotlarni filtrlash va chiqarish */}
            {guruhlar.map((guruh) => (
              <div
                key={guruh.id}
                className="flex items-center px-4 py-3.5 border-b border-gray-50
                hover:bg-[#f0f4ff]/30 transition-all duration-300 min-w-max"
              >
                {/* Status Toggle */}
                <div className="flex-1 px-1 flex items-center gap-1">
                  <button
                    onClick={() => toggleFaol(guruh.id, guruh.status)}
                    className="transition-transform active:scale-95"
                  >
                    {guruh.status === "active" ? (
                      <ToggleOnIcon
                        style={{ fontSize: 34, color: "#1f39a1" }}
                      />
                    ) : (
                      <ToggleOffIcon
                        style={{ fontSize: 34, color: "#d1d5db" }}
                      />
                    )}
                  </button>
                  <span
                    className={`text-[10px] font-bold ${guruh.status === "active" ? "text-green-500" : "text-gray-400"}`}
                  >
                    {guruh.status === "active" ? "ACTIVE" : "OFF"}
                  </span>
                </div>

                {/* Guruh nomi */}
                <div className="flex-1 px-1">
                  <Link
                    to={`/groups/${guruh.id}`}
                    className="text-sm font-semibold text-[#1f39a1] hover:underline"
                  >
                    {guruh.name}
                  </Link>
                </div>

                {/* Kurs badge */}
                <div className="flex-1 px-1">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#6366f118] text-[#6366f1]">
                    {guruh.course}
                  </span>
                </div>

                {/* Davomiyligi */}
                <div className="flex-1 px-1">
                  <p className="text-sm text-[#4a5568]">
                    {guruh.course_duration_hours} minut
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(guruh.start_date).toLocaleDateString("ru-RU")} dan
                    / {guruh.course_duration_month} oy
                  </p>
                </div>

                {/* Dars vaqti */}
                <div className="flex-1 px-1">
                  <p className="text-sm font-medium text-[#4a5568]">
                    {guruh.start_time}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {guruh.weekDay?.join(", ")}
                  </p>
                </div>

                {/* Xona */}
                <div className="flex-1 px-1">
                  <span className="text-sm text-[#4a5568]">{guruh.room}</span>
                </div>

                {/* O'qituvchilar */}
                <div className="flex-1 px-1 flex flex-wrap gap-1 items-center">
                  {guruh.teachers?.slice(0, 2).map((t, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-[#1f39a1] text-white px-2 py-0.5 rounded-full truncate 
                    max-w-[120px]"
                    >
                      {t.full_name}
                    </span>
                  ))}
                  {guruh.teachers?.length > 2 && (
                    <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                      +{guruh.teachers.length - 2}
                    </span>
                  )}
                </div>

                {/* Talabalar soni */}
                <div className="flex-1 px-1">
                  <span className="text-sm font-bold text-[#4a5568]">
                    {guruh.student_count}
                  </span>
                </div>

                {/* Amallar */}
                <div className="flex-1 px-1 flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTanlangan(guruh);
                      setKorishModal(true);
                    }}
                    className="p-1.5 rounded-lg text-gray-400 hover:bg-[#f0f4ff] hover:text-[#1f39a1] transition-colors"
                  >
                    <VisibilityIcon style={{ fontSize: 18 }} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTanlangan(guruh);
                      setTahrirlashModal(true);
                    }}
                    className="p-1.5 rounded-lg text-gray-400 hover:bg-[#f0f4ff] hover:text-[#1f39a1] transition-colors"
                  >
                    <EditIcon style={{ fontSize: 18 }} />
                  </button>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (!confirm("Guruhni o'chirmoqchimisiz?")) return;
                      try {
                        await api.delete(`/groups/${guruh.id}`);
                        setGuruhlar((prev) =>
                          prev.filter((g) => g.id !== guruh.id),
                        );
                        alert("Guruh muvaffaqiyatli o'chirildi! ✅");
                      } catch {
                        alert("O'chirishda xato!");
                      }
                    }}
                    className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <DeleteIcon style={{ fontSize: 18 }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {modalOchiq && (
        <GuruhQoshishModal
          onClose={() => setModalOchiq(false)}
          onSave={guruhSaqlash}
        />
      )}

      {tahrirlashModal && tanlangan && (
        <GuruhTahrirlashModal
          guruh={tanlangan}
          onClose={() => {
            setTahrirlashModal(false);
            setTanlangan(null);
          }}
          onSave={async (id, formaData) => {
            try {
              const original = tanlangan;
              const payload = {};

              if (formaData.name && formaData.name !== original.name)
                payload.name = formaData.name;

              if (
                formaData.course_id &&
                formaData.course_id !== original.course_id
              )
                payload.course_id = Number(formaData.course_id);

              if (formaData.room_id && formaData.room_id !== original.room_id)
                payload.room_id = Number(formaData.room_id);

              if (
                formaData.start_time &&
                formaData.start_time !== original.start_time?.slice(0, 5)
              )
                payload.start_time = formaData.start_time;

              // start_date — har doim yuboramiz (bo'sh bo'lmasa)
              if (formaData.start_date)
                payload.start_date = formaData.start_date;

              if (
                formaData.week_day?.length > 0 &&
                JSON.stringify(formaData.week_day) !==
                  JSON.stringify(original.weekDay)
              )
                payload.week_day = formaData.week_day;

              if (
                formaData.max_student &&
                formaData.max_student !== original.max_student
              )
                payload.max_student = Number(formaData.max_student);

              // Teachers — har doim yuboramiz (bo'sh bo'lsa ham)
              payload.teachers = formaData.teachers
                .map((id) => Number(id))
                .filter((id) => !isNaN(id) && id > 0);

              // Students — qo'shilgan bo'lsa yuboramiz
              if (formaData.students?.length > 0)
                payload.students = formaData.students
                  .map((id) => Number(id))
                  .filter((id) => !isNaN(id) && id > 0);

              if (Object.keys(payload).length === 0) {
                alert("Hech narsa o'zgartirilmadi!");
                return;
              }

              await api.patch(`/groups/${id}`, payload);
              await getGroups();
              setTahrirlashModal(false);
              setTanlangan(null);
              alert("Guruh muvaffaqiyatli yangilandi! ✅");
            } catch (e) {
              const msg = e.response?.data?.message;
              alert(
                Array.isArray(msg)
                  ? msg.join("\n")
                  : msg || "Yangilashda xato!",
              );
            }
          }}
        />
      )}

      {korishModal && tanlangan && (
        <GuruhKorishModal
          guruh={tanlangan}
          onClose={() => {
            setKorishModal(false);
            setTanlangan(null);
          }}
        />
      )}
    </div>
  );
}
