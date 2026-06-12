// GroupInner.jsx — Guruh ichki sahifasi (/groups/:id)
// guruh mentorlari, parametrlar, dars jadvali akkardionlari sahifasi



import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import api from "../../services/axios";
import GroupLessonDay from "./GroupLessonDay";
import GroupLessons from "./GroupLessons";

// ─── Hafta kunlari ──────────────────────────────────────────────
const WEEK_DAY_MAP = {
  MONDAY: "Du",
  TUESDAY: "Se",
  WEDNESDAY: "Ch",
  THURSDAY: "Pa",
  FRIDAY: "Ju",
  SATURDAY: "Sh",
  SUNDAY: "Ya",
};

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

// ─── Dars kunlarini hisoblash ───────────────────────────────────
function computeLessonDays(weekDays, year, month) {
  if (!weekDays?.length) return [];
  const dayIndex = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
  };
  const targets = weekDays
    .map((d) => dayIndex[d])
    .filter((d) => d !== undefined);
  const result = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    if (targets.includes(date.getDay())) result.push(date);
  }
  return result;
}

// ════════════════════════════════════════════════════════════════
// Accordion
// ════════════════════════════════════════════════════════════════
function Accordion({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className={`rounded-xl mb-4 overflow-hidden transition-all duration-300
    ${
      open
        ? "bg-white border border-gray-200 shadow-sm"
        : "border border-transparent shadow-none"
    }`}
    >
      <div
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center justify-between px-5 py-3.5 cursor-pointer
          select-none transition-colors duration-200 rounded-xl
          ${
            open
              ? "bg-[#1f39a1] hover:bg-[#162870] rounded-b-none"
              : "bg-[#f0f4ff]/80 hover:bg-[#f0f4ff]"
          }`}
      >
        <span
          className={`text-sm font-semibold tracking-wide
          ${open ? "text-white" : "text-[#1f39a1]/80"}`}
        >
          {title}
        </span>
        <span className={open ? "text-white" : "text-[#1f39a1]/80"}>
          {open ? (
            <CloseIcon style={{ fontSize: 18 }} />
          ) : (
            <AddIcon style={{ fontSize: 18 }} />
          )}
        </span>
      </div>

      <div
        style={{
          maxHeight: open ? "3000px" : "0px",
          opacity: open ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 0.35s ease, opacity 0.2s ease",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Mentorlar ──────────────────────────────────────────────────
function MentorlarContent({ teachers }) {
  if (!teachers?.length) {
    return (
      <div className="px-5 py-4 text-sm text-gray-400">
        O'qituvchi biriktirilmagan
      </div>
    );
  }
  const base =
    import.meta.env.VITE_API_URL?.replace("/api/v1", "") ||
    "http://localhost:3000";
  return (
    <div className="p-5 flex flex-wrap gap-6">
      {teachers.map((t, i) => (
        <div key={t.id || i} className="flex flex-col items-center gap-1.5">
          {t.photo ? (
            <img
              src={`${base}/uploads/${t.photo}`}
              alt={t.full_name}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#1f39a1]/20"
            />
          ) : (
            <div
              className="w-14 h-14 rounded-full bg-[#eef2ff] border-2 border-[#1f39a1]/10
              flex items-center justify-center text-[#1f39a1] font-bold text-lg"
            >
              {t.full_name?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}
          <span className="text-[10px] font-semibold text-[#1f39a1]">
            Teacher
          </span>
          <span className="text-xs text-[#4a5568] text-center leading-tight max-w-[80px]">
            {t.full_name}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Parametrlar ────────────────────────────────────────────────
function ParametrlarContent({ guruh }) {
  const kursNomi =
    typeof guruh.course === "object" && guruh.course !== null
      ? guruh.course.name
      : guruh.course || "—";

  const darsKunlari =
    guruh.week_day?.map((d) => WEEK_DAY_MAP[d] || d).join(", ") || "—";

  const boshlanishSanasi = guruh.start_date
    ? new Date(guruh.start_date).toLocaleDateString("ru-RU")
    : "—";

  const kursDavomiyligi =
    guruh.course_duration_month ||
    (typeof guruh.course === "object" ? guruh.course?.duration_month : null) ||
    "—";

  const rows = [
    { label: "Kurs", value: kursNomi },
    { label: "Dars kunlari", value: darsKunlari },
    { label: "Dars vaqti", value: guruh.start_time || "—" },
    { label: "Xona", value: guruh.room || "—" },
    { label: "Xona sig'imi", value: guruh.room_capacity ?? "—" },
    { label: "Boshlanish sanasi", value: boshlanishSanasi },
    { label: "Kurs davomiyligi (oy)", value: kursDavomiyligi },
    { label: "O'quvchilar soni", value: guruh.student_count ?? "—" },
    { label: "Max talabalar", value: guruh.max_student ?? "—" },
    { label: "O'rta yosh", value: guruh.students_avg_age || "—" },
  ];

  return (
    <div className="divide-y divide-gray-50">
      {rows.map((row, i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-5 px-5 py-3
            hover:bg-[#f0f4ff]/30 transition-all duration-200"
        >
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {row.label}:
          </span>
          <span className="text-sm font-medium text-[#4a5568] text-right break-words">
            {row.value || "—"}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Kun kartasi komponenti ─────────────────────────────────────
function DayCard({ date, isCompleted, onClick }) {
  const bugun = new Date();
  bugun.setHours(0, 0, 0, 0);

  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  const isToday = d.getTime() === bugun.getTime();
  const isPast = d < bugun;

  // isCompleted bo'lsa yashil rang
  const wrapCls = isCompleted
    ? "bg-green-100 border-green-300 text-green-700"
    : isToday
      ? "bg-[#1f39a1] border-[#1f39a1] text-white shadow-md"
      : isPast
        ? "bg-gray-100 border-gray-200 text-gray-400"
        : "bg-white border-gray-200 text-[#4a5568] hover:bg-[#f0f4ff] hover:border-[#1f39a1]/30";

  const monthCls = isCompleted
    ? "text-green-500"
    : isToday
      ? "text-blue-200"
      : "text-gray-400";

  const dayCls = isCompleted
    ? "text-green-700"
    : isToday
      ? "text-white"
      : isPast
        ? "text-gray-400"
        : "text-[#4a5568]";

  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center px-2.5 py-2 rounded-xl min-w-[44px]
      border transition-all cursor-pointer ${wrapCls}`}
    >
      <span className={`text-[10px] font-medium ${monthCls}`}>
        {OY_QISQA[d.getMonth()]}
      </span>
      <span className={`text-sm font-bold ${dayCls}`}>{d.getDate()}</span>
    </div>
  );
}

// ─── Schedules API dan oy ma'lumotlarini olish ─────────────────
// API javobi: { "1": { isActive, day: [{day, month, isCompleted}] }, "2": {...}, ... }
// month nomi inglizcha: "February", "March", ...
const MONTH_NAME_TO_IDX = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

// Schedules obyektini tekis massivga aylantirish
function flattenSchedules(schedulesObj) {
  // [ { weekNum, isActive, days: [{day, month, isCompleted, date}] } ]
  const result = [];
  if (!schedulesObj) return result;
  Object.entries(schedulesObj).forEach(([weekNum, val]) => {
    const days = (val.day || []).map((d) => {
      const monthIdx = MONTH_NAME_TO_IDX[d.month] ?? 0;
      // Yilni aniqlash: oddiy holda joriy yil yoki keyingisi
      const now = new Date();
      let year = now.getFullYear();
      // Agar oy o'tgan bo'lsa, keyingi yilga o'tkazish (ixtiyoriy, kichik logika)
      if (monthIdx < now.getMonth() - 2) year += 1;
      return {
        day: d.day,
        month: d.month,
        isCompleted: d.isCompleted,
        date: new Date(year, monthIdx, d.day),
      };
    });
    result.push({ weekNum: Number(weekNum), isActive: val.isActive, days });
  });
  return result.sort((a, b) => a.weekNum - b.weekNum);
}

// ─── Dars jadvali kontent ───────────────────────────────────────
function DarsJadvaliContent({ guruh, onDayClick }) {
  const [barchasi, setBarchasi] = useState(false);
  const [tanlananOyIdx, setTanlananOyIdx] = useState(null);
  const [schedules, setSchedules] = useState(null);
  const [schedulesLoading, setSchedulesLoading] = useState(true);

  const startDate = guruh.start_date ? new Date(guruh.start_date) : null;
  const weekDays = guruh.week_day || [];
  const kursOylari = Math.ceil(
    Number(guruh.course_duration_month) ||
      Number(guruh.course?.duration_month) ||
      3,
  );

  const oquvOylari = [];
  if (startDate) {
    for (let i = 0; i < kursOylari; i++) {
      const rawMonth = startDate.getMonth() + i;
      oquvOylari.push({
        year: startDate.getFullYear() + Math.floor(rawMonth / 12),
        month: rawMonth % 12,
        label: `${i + 1}-o'quv oyi`,
      });
    }
  }

  useEffect(() => {
    if (!oquvOylari.length) return;
    const bugun = new Date();
    const idx = oquvOylari.findIndex(
      (o) => o.year === bugun.getFullYear() && o.month === bugun.getMonth(),
    );
    setTanlananOyIdx(idx >= 0 ? idx : 0);
  }, [guruh.id, oquvOylari.length]);

  // ── Schedules API ──
  useEffect(() => {
    if (!guruh.id) return;
    setSchedulesLoading(true);
    api
      .get(`/groups/${guruh.id}/schedules`)
      .then((res) => {
        const data = res.data?.data ?? res.data ?? null;
        setSchedules(flattenSchedules(data));
      })
      .catch(() => setSchedules(null))
      .finally(() => setSchedulesLoading(false));
  }, [guruh.id]);

  if (!startDate) {
    return (
      <div className="px-5 py-4 text-sm text-gray-400">
        Boshlanish sanasi kiritilmagan
      </div>
    );
  }

  const tanlananOy = tanlananOyIdx !== null ? oquvOylari[tanlananOyIdx] : null;

  // Schedules dan joriy oy kunlarini topish
  // Schedules bo'lmasa — computeLessonDays fallback
  function getDaysForMonth(year, month) {
    if (schedules) {
      // API dagi barcha kunlarni yig'ib, shu oyga tegishlilarini qaytarish
      const allDays = schedules.flatMap((w) => w.days);
      const filtered = allDays.filter(
        (d) => d.date.getFullYear() === year && d.date.getMonth() === month,
      );
      if (filtered.length > 0) return filtered; // { date, isCompleted }
    }
    // Fallback: computeLessonDays
    return computeLessonDays(weekDays, year, month).map((date) => ({
      date,
      isCompleted: false,
    }));
  }

  const darsKunlari = tanlananOy
    ? getDaysForMonth(tanlananOy.year, tanlananOy.month)
    : [];

  return (
    <div className="p-5">
      {/* O'qituvchi qatorlari */}
      {guruh.teachers?.length > 0 && (
        <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden mb-6">
          {guruh.teachers.map((t, i) => (
            <div
              key={t.id || i}
              className="flex flex-wrap items-center gap-4 px-4 py-3
                border-b border-gray-100 last:border-0
                hover:bg-[#f0f4ff]/40 transition-all duration-200"
            >
              <span className="text-sm font-medium text-[#1f39a1] w-44 shrink-0">
                {t.full_name}
              </span>
              <span className="text-sm text-[#4a5568] whitespace-nowrap shrink-0">
                {weekDays.map((d) => WEEK_DAY_MAP[d] || d).join("/")}
              </span>
              <span className="text-sm text-gray-500 flex items-center gap-1 shrink-0">
                <AccessTimeIcon style={{ fontSize: 14, color: "#1f39a1" }} />
                {guruh.start_time} dan
              </span>
              <span className="text-sm text-gray-400 flex-1">
                {new Date(guruh.start_date).toLocaleDateString("ru-RU")}
              </span>
              <span className="text-sm text-gray-500">{guruh.room || "—"}</span>
            </div>
          ))}
        </div>
      )}

      {/* Loading */}
      {schedulesLoading && (
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1f39a1]" />
          Jadval yuklanmoqda...
        </div>
      )}

      {/* ODDIY KO'RINISH: joriy oy + navigation */}
      {!barchasi && (
        <>
          {/* Oy navigatsiya */}
          {oquvOylari.length > 0 && tanlananOyIdx !== null && (
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setTanlananOyIdx((i) => Math.max(0, i - 1))}
                disabled={tanlananOyIdx === 0}
                className="p-1.5 rounded-lg text-gray-400
                  hover:bg-[#f0f4ff] hover:text-[#1f39a1]
                  disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeftIcon style={{ fontSize: 18 }} />
              </button>

              <span className="text-sm font-semibold text-[#4a5568] min-w-[200px] text-center">
                {oquvOylari[tanlananOyIdx]?.label}
                <span className="text-gray-400 font-normal ml-1 text-xs">
                  ({OY_NOMLARI[oquvOylari[tanlananOyIdx]?.month]}{" "}
                  {oquvOylari[tanlananOyIdx]?.year})
                </span>
              </span>

              <button
                onClick={() =>
                  setTanlananOyIdx((i) =>
                    Math.min(oquvOylari.length - 1, i + 1),
                  )
                }
                disabled={tanlananOyIdx === oquvOylari.length - 1}
                className="p-1.5 rounded-lg text-gray-400
                  hover:bg-[#f0f4ff] hover:text-[#1f39a1]
                  disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRightIcon style={{ fontSize: 18 }} />
              </button>
            </div>
          )}

          {/* Joriy oyning BARCHA dars kunlari */}
          {darsKunlari.length > 0 ? (
            <div className="flex gap-2 flex-wrap mb-4">
              {darsKunlari.map((item, i) => (
                <DayCard
                  key={i}
                  date={item.date}
                  isCompleted={item.isCompleted}
                  onClick={() => onDayClick(item.date)}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 mb-4">
              Bu oyda dars kunlari mavjud emas
            </p>
          )}
        </>
      )}

      {/* KENGAYTIRILGAN KO'RINISH: barcha oylar */}
      {barchasi && (
        <div className="space-y-6 mb-4">
          {oquvOylari.map((oy, oyIdx) => {
            const kunlar = getDaysForMonth(oy.year, oy.month);
            if (!kunlar.length) return null;
            return (
              <div key={oyIdx}>
                <p className="text-sm font-semibold text-[#4a5568] mb-2">
                  {oy.label}
                  <span className="text-xs text-gray-400 font-normal ml-1">
                    ({OY_NOMLARI[oy.month]} {oy.year})
                  </span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {kunlar.map((item, i) => (
                    <DayCard
                      key={i}
                      date={item.date}
                      isCompleted={item.isCompleted}
                      onClick={() => onDayClick(item.date)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tugma */}
      <div className="flex justify-center mt-2">
        <button
          onClick={() => setBarchasi((v) => !v)}
          className="px-6 py-2 rounded-lg border border-gray-300 text-sm text-gray-600
            hover:bg-[#f0f4ff] hover:text-[#1f39a1] hover:border-[#1f39a1]/40
            transition-all duration-200"
        >
          {barchasi ? "Kamroq ko'rsatish" : "Barchasini ko'rish"}
        </button>
      </div>
    </div>
  );
}

// ─── ASOSIY KOMPONENT ───────────────────────────────────────────
// ─── Asosiy tablar ──────────────────────────────────────────────
const MAIN_TABS = [
  { key: "info", label: "Ma'lumotlar" },
  { key: "lessons", label: "Guruh darsliklari" },
  { key: "attendance", label: "Akademik davomati" },
];

export default function GroupInner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [guruh, setGuruh] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeTab, setActiveTab] = useState("info");

  // read `?tab=` from URL and sync activeTab
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get("tab");
    if (t && MAIN_TABS.some((m) => m.key === t)) {
      setActiveTab(t);
    } else {
      setActiveTab("info");
    }
  }, [location.search]);

  // Foydalanuvchi teacher panelida yoki admin panelida ekanligini aniqlash
  const isTeacherPanel = location.pathname.startsWith("/teacher");
  const groupsBase = isTeacherPanel ? "/teacher/groups" : "/groups";

  const handleHeaderBack = () => {
    if (activeTab !== "info") {
      navigate(`${groupsBase}/${id}`);
      return;
    }
    navigate(groupsBase);
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    api
      .get(`/groups/${id}`)
      .then((res) => {
        setGuruh(res.data?.data ?? res.data ?? null);
        setLoading(false);
      })
      .catch(() => {
        api
          .get("/groups/all")
          .then((res2) => {
            const list = res2.data?.data ?? res2.data ?? [];
            const found = list.find((g) => String(g.id) === String(id));
            if (found) setGuruh(found);
            else setError("Guruh topilmadi");
          })
          .catch(() => setError("Ma'lumotlarni yuklashda xatolik"))
          .finally(() => setLoading(false));
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1f39a1] mx-auto mb-3" />
          <span className="text-gray-400 text-sm">Yuklanmoqda...</span>
        </div>
      </div>
    );
  }

  if (error || !guruh) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center gap-3">
        <p className="text-gray-400 text-sm">{error || "Guruh topilmadi"}</p>
        <button
          onClick={() => navigate("/groups")}
          className="bg-[#1f39a1] hover:bg-[#162870] text-white text-sm px-4 py-2
            rounded-lg transition-all"
        >
          Guruhlarga qaytish
        </button>
      </div>
    );
  }

  if (selectedDate) {
    return (
      <GroupLessonDay
        date={selectedDate}
        guruh={guruh}
        onBack={() => setSelectedDate(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* ── Sarlavha ── */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <button
            onClick={handleHeaderBack}
            className="p-1.5 rounded-lg text-gray-400
              hover:bg-[#f0f4ff] hover:text-[#1f39a1] transition-colors"
          >
            <ArrowBackIcon style={{ fontSize: 20 }} />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-[#4a5568]">
            {guruh.name}
          </h1>
          <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-full
            ${
              guruh.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {guruh.status === "active" ? "Aktiv" : "Arxiv"}
          </span>
        </div>

        {/* ── Asosiy tablar ── */}
        <div className="flex items-center gap-1 mb-6 border-b border-gray-200">
          {MAIN_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => navigate(`?tab=${tab.key}`)}
              className={`px-4 py-2.5 text-sm font-medium transition-all relative whitespace-nowrap
                ${
                  activeTab === tab.key
                    ? "text-[#1f39a1] font-semibold"
                    : "text-gray-400 hover:text-gray-600"
                }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#1f39a1] rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* ── Tab kontentlari ── */}

        {/* 1. Ma'lumotlar */}
        {activeTab === "info" && (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-2">
              <Accordion title="Guruh mentorlari" defaultOpen={true}>
                <MentorlarContent teachers={guruh.teachers} />
              </Accordion>

              <Accordion title="Parametrlar" defaultOpen={true}>
                <ParametrlarContent guruh={guruh} />
              </Accordion>
            </div>

            <Accordion title="Dars jadvali" defaultOpen={true}>
              <DarsJadvaliContent guruh={guruh} onDayClick={setSelectedDate} />
            </Accordion>
          </>
        )}

        {/* 2. Guruh darsliklari */}
        {activeTab === "lessons" && <GroupLessons guruh={guruh} />}

        {/* 3. Akademik davomati */}
        {activeTab === "attendance" && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p className="text-sm">
              Akademik davomati bo'limi tez orada qo'shiladi
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
