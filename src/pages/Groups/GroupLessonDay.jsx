// dars jadvalidagi dars kunlarini ustiga bosgandagi sahifa, o'sha kungi dars ma'lumotlari va yo'qlama jadvali chiqadi

import { useState, useEffect } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import api from "../../services/axios";

// Hafta kunlari va oylar (GroupInner.jsx bilan bir xil)
const OY_NOMLARI = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "Iyun",
  "Iyul",
  "Avgust",
  "Sentabr",
  "Oktabr",
  "Noyabr",
  "Dekabr",
];
const OY_QISQA = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const WEEK_DAY_MAP_INDEX = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

function computeLessonDays(weekDays, year, month) {
  if (!weekDays?.length) return [];
  const targets = weekDays
    .map((d) => WEEK_DAY_MAP_INDEX[d])
    .filter((d) => d !== undefined);
  const result = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    if (targets.includes(date.getDay())) result.push(date);
  }
  return result;
}

export default function GroupLessonDay({ date, guruh, onBack }) {
  const [activeTab, setActiveTab] = useState("Teacher");
  const [isOtherTheme, setIsOtherTheme] = useState(false);
  const [themeText, setThemeText] = useState("CRM groupinner full");

  const [students, setStudents] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  // Guruh o'quvchilarini API dan yuklash
  useEffect(() => {
    if (!guruh?.id) return;

    // Avval guruh prop ichidagi students ni ishlatamiz
    if (guruh.students?.length > 0) {
      // default: yangi dars uchun hamma qatnashmagan deb belgilaymiz
      setStudents(guruh.students.map((s) => ({ ...s, attended: false })));
      // lekin keyin API dan dars bor-yo'qligini tekshiramiz
    }

    // Agar students bo'sh bo'lsa, API dan qayta yuklash
    api
      .get(`/groups/${guruh.id}`)
      .then((res) => {
        const data = res.data?.data ?? res.data;
        const studentList = data?.students || [];
        // if we didn't already set students from prop, set defaults
        setStudents((prev) =>
          prev.length
            ? prev
            : studentList.map((s) => ({ ...s, attended: false })),
        );
      })
      .catch(() => setStudents((prev) => (prev.length ? prev : [])));
  }, [guruh?.id, guruh?.students]);

  // yuklash: dars va yo'qlama uchun API chaqiruvi (date param ga mos)
  useEffect(() => {
    if (!guruh?.id || !date) return;
    const isoDate = new Date(date).toISOString().split("T")[0];
    setLoading(true);
    api
      .get(`/groups/${guruh.id}/lessons?date=${isoDate}`)
      .then((res) => {
        const data = res.data?.data ?? res.data;
        if (data?.lesson) {
          setLesson(data.lesson);
          setThemeText(data.lesson.topic || "");
          setDescription(data.lesson.description || "");
          // map attendance
          if (Array.isArray(data.attendance)) {
            setStudents((prevStudents) => {
              // ensure we have students list
              const base = prevStudents.length
                ? prevStudents
                : data.attendance.map((a) => ({
                    id: a.student_id,
                    full_name: a.full_name,
                    photo: a.photo,
                  }));
              return base.map((s) => {
                const att = data.attendance.find((a) => a.student_id === s.id);
                return { ...s, attended: !!att?.isPresent };
              });
            });
          }
        } else {
          setLesson(null);
        }
      })
      .catch((err) => {
        // 404 means no lesson on that date — treat as new lesson (don't overwrite students)
        if (err?.response?.status === 404) {
          setLesson(null);
        } else {
          console.error(err);
        }
      })
      .finally(() => setLoading(false));
  }, [guruh?.id, date]);

  const saveLesson = async () => {
    if (!isToday || !guruh?.id) return;
    const isoDate = new Date(date).toISOString().split("T")[0];
    const payload = {
      topic: themeText,
      description: description,
      attendances: students.map((s) => ({
        student_id: s.id,
        isPresent: !!s.attended,
      })),
    };
    try {
      setLoading(true);
      const res = await api.post(
        `/groups/${guruh.id}/lessons?date=${isoDate}`,
        payload,
      );
      const data = res.data?.data ?? res.data;
      if (data) {
        setLesson(data);
        // refresh attendance from server to ensure we have the same representation
        try {
          const ref = await api.get(
            `/groups/${guruh.id}/lessons?date=${isoDate}`,
          );
          const refData = ref.data?.data ?? ref.data;
          if (refData?.lesson) {
            setLesson(refData.lesson);
            setThemeText(refData.lesson.topic || "");
            setDescription(refData.lesson.description || "");
          }
          if (Array.isArray(refData?.attendance)) {
            setStudents((prevStudents) => {
              const base = prevStudents.length
                ? prevStudents
                : refData.attendance.map((a) => ({
                    id: a.student_id,
                    full_name: a.full_name,
                    photo: a.photo,
                  }));
              return base.map((s) => {
                const att = refData.attendance.find(
                  (a) => a.student_id === s.id,
                );
                return { ...s, attended: !!att?.isPresent };
              });
            });
          }
        } catch (e) {
          console.error("refresh after save failed", e);
        }
      }
      setSuccessOpen(true);
    } catch (e) {
      console.error(e);
      const status = e?.response?.status;
      if (status === 409) {
        // Lesson already exists for this date — fetch it and update UI
        try {
          const ref = await api.get(
            `/groups/${guruh.id}/lessons?date=${isoDate}`,
          );
          const refData = ref.data?.data ?? ref.data;
          if (refData?.lesson) {
            setLesson(refData.lesson);
            setThemeText(refData.lesson.topic || "");
            setDescription(refData.lesson.description || "");
          }
          if (Array.isArray(refData?.attendance)) {
            setStudents((prevStudents) => {
              const base = prevStudents.length
                ? prevStudents
                : refData.attendance.map((a) => ({
                    id: a.student_id,
                    full_name: a.full_name,
                    photo: a.photo,
                  }));
              return base.map((s) => {
                const att = refData.attendance.find(
                  (a) => a.student_id === s.id,
                );
                return { ...s, attended: !!att?.isPresent };
              });
            });
          }
          alert("Bu sanada dars allaqachon mavjud. Mavjud dars yuklandi.");
        } catch (re) {
          console.error("refresh after conflict failed", re);
          alert(e?.response?.data?.message || "Xatolik: dars saqlanmadi");
        }
      } else {
        alert(e?.response?.data?.message || "Xatolik: dars saqlanmadi");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleStudent = (id) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, attended: !s.attended } : s)),
    );
  };

  const d = new Date(date);
  // sanalar solishtirish uchun startOfDay
  const startOfDay = (dt) =>
    new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
  const today = startOfDay(new Date());
  const current = startOfDay(d);
  const isToday = today.getTime() === current.getTime();
  const isPast = current.getTime() < today.getTime();
  const isFuture = current.getTime() > today.getTime();
  const formattedDate = `${d.getDate()} ${OY_NOMLARI[d.getMonth()]}, ${d.getFullYear()}`;
  const formattedDateDot = `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;

  const monthDays = computeLessonDays(
    guruh.week_day || [],
    d.getFullYear(),
    d.getMonth(),
  );

  return (
    <div className="min-h-screen bg-white">
      <Snackbar
        open={successOpen}
        autoHideDuration={2500}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setSuccessOpen(false)}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setSuccessOpen(false)}
          sx={{ width: "100%" }}
        >
          Dars va yo'qlama saqlandi!
        </Alert>
      </Snackbar>

      <div className="p-4 sm:p-8 max-w-7xl mx-auto">
        {/* Header / Back button */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={onBack}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
          >
            <ArrowBackIcon />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Dars tafsilotlari
          </h1>
        </div>

        {/* Top section: Month timeline */}
        <div className="mb-8 mt-2">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            O'quv oyi kunlari
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {monthDays.map((md, idx) => {
              const isSelected =
                md.getDate() === d.getDate() && md.getMonth() === d.getMonth();
              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center min-w-[56px] h-14 rounded-lg transition-colors ${isSelected ? "bg-[#10b981] text-white shadow-md" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                >
                  <span
                    className={`text-[10px] uppercase font-semibold ${isSelected ? "text-white" : "text-gray-400"}`}
                  >
                    {OY_QISQA[md.getMonth()]}
                  </span>
                  <span className="text-sm font-bold leading-tight mt-0.5">
                    {String(md.getDate()).padStart(2, "0")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-6">
          {["Assistant", "Teacher"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-semibold transition-colors relative ${activeTab === tab ? "text-[#10b981]" : "text-gray-400 hover:text-gray-600"}`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#10b981] rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Teacher Card */}
        <div className="bg-[#f8fafc] rounded-xl p-5 mb-8 border border-gray-100 w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
          <h4 className="text-sm font-bold text-gray-800 mb-4">Ma'lumot</h4>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xl shadow-sm">
              <PersonIcon />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">
                {guruh.teachers?.[0]?.full_name || "O'qituvchi nomi"}
              </p>
              <p className="text-xs text-[#10b981] font-medium mt-0.5">
                Teacher
              </p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-[10px] text-gray-400 mb-1 font-medium">
                Dars kuni
              </p>
              <p className="text-xs font-bold text-gray-700 leading-tight">
                {formattedDate}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 mb-1 font-medium">
                Dars vaqti
              </p>
              <p className="text-xs font-bold text-gray-700 leading-tight">
                {guruh.start_time || "09:30"} - {guruh.end_time || "12:30"}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 mb-1 font-medium">
                Filial
              </p>
              <p className="text-xs font-bold text-gray-700 leading-tight">
                {guruh.branch || "Chilonzor"}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 mb-1 font-medium">Xona</p>
              <p className="text-xs font-bold text-gray-700 leading-tight">
                {guruh.room || "F2 Autodesk // 18"}
              </p>
            </div>
          </div>
        </div>

        {/* Group Info */}
        <h2 className="text-lg font-extrabold text-gray-800 mb-8">
          {guruh.name || "Bootcamp Full Stack N26"} {formattedDateDot}
        </h2>

        <div className="mb-4">
          <h3 className="text-base font-bold text-gray-800 mb-4">
            Yo'qlama va mavzu kiritish
          </h3>

          <div className="flex items-center gap-6 mb-5 pl-1">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${!isOtherTheme ? "border-[#10b981]" : "border-gray-300 group-hover:border-gray-400"}`}
              >
                {!isOtherTheme && (
                  <div className="w-2 h-2 rounded-full bg-[#10b981]" />
                )}
              </div>
              <input
                type="radio"
                className="hidden"
                checked={!isOtherTheme}
                onChange={() => isToday && setIsOtherTheme(false)}
              />
              <span
                className={`text-sm ${!isOtherTheme ? "text-[#10b981] font-semibold" : "text-gray-500 font-medium"}`}
              >
                O'quv reja bo'yicha
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${isOtherTheme ? "border-[#10b981]" : "border-gray-300 group-hover:border-gray-400"}`}
              >
                {isOtherTheme && (
                  <div className="w-2 h-2 rounded-full bg-[#10b981]" />
                )}
              </div>
              <input
                type="radio"
                className="hidden"
                checked={isOtherTheme}
                onChange={() => isToday && setIsOtherTheme(true)}
              />
              <span
                className={`text-sm ${isOtherTheme ? "text-[#10b981] font-semibold" : "text-gray-500 font-medium"}`}
              >
                Boshqa
              </span>
            </label>
          </div>

          <div className="mb-8">
            <label className="block text-xs font-bold text-gray-600 mb-1.5 ml-1">
              <span className="text-red-500 mr-1">*</span>Mavzu
            </label>
            <input
              type="text"
              value={themeText}
              onChange={(e) => isToday && setThemeText(e.target.value)}
              readOnly={!isToday}
              className="w-full sm:w-1/2 lg:w-1/3 p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#10b981]/30 focus:border-[#10b981] transition-all"
              placeholder="Mavzuni kiriting..."
            />
          </div>

          {/* Attendance Table */}
          {isFuture ? (
            <div className="w-full mt-4 border border-gray-100 rounded-xl overflow-hidden p-8 text-center">
              <p className="text-lg font-semibold text-gray-700">
                Bu dars hali kelmagan
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Kelajakdagi darslarni ochish mumkin emas.
              </p>
            </div>
          ) : (
            <div className="w-full mt-4 border border-gray-100 rounded-xl overflow-hidden">
              <div className="flex px-5 py-3 border-b border-gray-100 bg-gray-50/80">
                <div className="w-12 text-xs font-bold text-gray-500">#</div>
                <div className="flex-1 text-xs font-bold text-gray-500">
                  O'quvchi ismi
                </div>
                <div className="w-24 text-xs font-bold text-gray-500 text-center">
                  Vaqti
                </div>
                <div className="w-20 text-xs font-bold text-gray-500 text-center pr-2">
                  Keldi
                </div>
              </div>

              <div className="bg-white">
                {students.length > 0 ? (
                  students.map((s, idx) => (
                    <div
                      key={s.id || idx}
                      className="flex px-5 py-4 border-b border-gray-50 items-center hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="w-12 text-sm text-gray-500 font-medium">
                        {idx + 1}
                      </div>
                      <div className="flex-1 text-sm font-semibold text-gray-800">
                        {s.full_name}
                      </div>
                      <div className="w-24 text-sm font-semibold text-gray-600 text-center">
                        {guruh.start_time || "09:30"}
                      </div>
                      <div className="w-20 flex justify-center">
                        <button
                          onClick={() => isToday && toggleStudent(s.id)}
                          className={`w-10 h-5 rounded-full relative transition-colors ${s.attended ? "bg-[#10b981]" : "bg-gray-200"} ${!isToday ? "opacity-60 cursor-not-allowed" : ""}`}
                          aria-disabled={!isToday}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${s.attended ? "left-5" : "left-0.5"}`}
                          />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-sm text-gray-400 text-center border-b border-gray-50">
                    Talabalar topilmadi
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action buttons */}
          {!isFuture && (
            <div className="mt-8 flex justify-end gap-3 pb-10">
              <button
                onClick={onBack}
                className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-semibold text-sm"
              >
                Bekor qilish
              </button>
              <button
                onClick={saveLesson}
                disabled={!isToday || loading}
                className={`px-8 py-2.5 rounded-xl text-white shadow-md transition-all font-semibold text-sm ${isToday ? "bg-[#10b981] shadow-emerald-200 hover:bg-[#059669]" : "bg-gray-300 cursor-not-allowed"}`}
              >
                {loading ? "Saqlanmoqda..." : "Saqlash"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
