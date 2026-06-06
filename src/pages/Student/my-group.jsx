import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import api from "../../services/axios";

// ──────────────────────────────────────────────────────────
// O'zbekcha oylar
// ──────────────────────────────────────────────────────────
const UZ_MONTHS = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr",
];

const formatDateUz = (isoDate, includeTime = false) => {
  if (!isoDate) return "—";
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "—";
  const day   = String(date.getDate()).padStart(2, "0");
  const month = UZ_MONTHS[date.getMonth()];
  const year  = date.getFullYear();
  if (includeTime) {
    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");
    return `${day} ${month}, ${year} ${h}:${m}`;
  }
  return `${day} ${month}, ${year}`;
};

// ──────────────────────────────────────────────────────────
// Status konfiguratsiyasi
// ──────────────────────────────────────────────────────────
const STATUS_MAP = {
  berilmagan:  { label: "Berilmagan",     bg: "#515357ff" },  // gray
  kutilmoqda:  { label: "Kutayotganlar",  bg: "#2e51ddff" },  // blue  (dropdown bilan bir xil)
  bajarilgan:  { label: "Qabul qilingan", bg: "#0fbe18ff" },  // green
  qaytarilgan: { label: "Qaytarilgan",    bg: "#e8a020" },  // amber
  bajarilmagan:{ label: "Bajarilmagan",   bg: "#e81411ff" },  // red
};

const FILTER_OPTIONS = [
  { value: "Barchasi",       label: "Barchasi",        bg: "#f3f4f6", color: "#374151" },
  { value: "Qabul qilingan", label: "Qabul qilingan",  bg: "#0fbe18ff", color: "#fff"   },
  { value: "Berilmagan",     label: "Berilmagan",      bg: "#515357ff", color: "#fff"   },
  { value: "Qaytarilgan",    label: "Qaytarilgan",     bg: "#e8a020", color: "#fff"   },
  { value: "Bajarilmagan",   label: "Bajarilmagan",    bg: "#e81411ff", color: "#fff"   },
  { value: "Kutayotganlar",  label: "Kutayotganlar",   bg: "#2e51ddff", color: "#fff"   },
];

// ──────────────────────────────────────────────────────────
// Asosiy komponent
// ──────────────────────────────────────────────────────────
export default function StudentMyGroup() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const location     = useLocation();
  const dropRef      = useRef(null);

  // Guruh ma'lumotlarini navigatsiya state'idan olamiz (StudentGroups tomonidan uzatiladi)
  const stateGroup   = location.state?.group || null;

  const [lessons,      setLessons]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [statusFilter, setStatusFilter] = useState("Barchasi");
  const [dropOpen,     setDropOpen]     = useState(false);
  const [sortBy,       setSortBy]       = useState("date");   // 'date' | 'deadline'
  const [sortOrder,    setSortOrder]    = useState("desc");   // 'asc'  | 'desc'

  // Dropdown tashqarisiga bosilganda yopish
  useEffect(() => {
    const onOutsideClick = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  // Faqat darslarni yuklash (student uchun ruxsat bor endpoint)
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const lRes = await api.get(`/groups/${id}/lessonId/all`);
        const raw  = Array.isArray(lRes.data) ? lRes.data : [];
        // Bo'sh yoki topic yo'q darslarni olib tashlash
        setLessons(raw.filter((l) => l && l.topic));
      } catch (err) {
        console.error("Darslarni yuklashda xatolik:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // ── Filterlash ──
  const filtered = lessons.filter((lesson) => {
    if (statusFilter === "Barchasi") return true;
    const statusLabel = STATUS_MAP[lesson.status]?.label ?? "Berilmagan";
    return statusLabel === statusFilter;
  });

  // ── Saralash ──
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "date") {
      const da = new Date(a.created_at || 0).getTime();
      const db = new Date(b.created_at || 0).getTime();
      return sortOrder === "asc" ? da - db : db - da;
    }
    // deadline sorter
    const noDeadlineA = a.status === "berilmagan";
    const noDeadlineB = b.status === "berilmagan";
    if (noDeadlineA && !noDeadlineB) return 1;
    if (!noDeadlineA && noDeadlineB) return -1;
    if (noDeadlineA && noDeadlineB) return 0;
    const da = new Date(a.created_at || 0).getTime() + 2 * 86400000;
    const db = new Date(b.created_at || 0).getTime() + 2 * 86400000;
    return sortOrder === "asc" ? da - db : db - da;
  });

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const deadline = (lesson) =>
    lesson.status !== "berilmagan"
      ? formatDateUz(new Date(lesson.created_at).getTime() + 2 * 86400000, true)
      : "-";

  const currentOption =
    FILTER_OPTIONS.find((o) => o.value === statusFilter) || FILTER_OPTIONS[0];

  // Guruh sarlavhasi: state'dan kelgan ma'lumot asosida
  const groupTitle = stateGroup
    ? `${stateGroup.courseName ?? ""} ${stateGroup.groupName?.toUpperCase() ?? ""}`.trim()
    : "Guruh darslar";

  const statusLabel =
    stateGroup?.status === "completed" ? "inactive" : "active";

  // ──────────────────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-4 sm:p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-xl overflow-visible">

        {/* ── Header ── */}
        <div className="flex justify-between items-center px-6 sm:px-8 pt-6 pb-5 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/student/groups")}
              className="p-1.5 rounded-lg text-gray-400 hover:bg-[#f0f4ff] hover:text-[#1f39a1] transition-colors cursor-pointer"
            >
              <ArrowBackIcon style={{ fontSize: 22 }} />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1f39a1] dark:text-white">
                {groupTitle}
              </h1>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {statusLabel}
              </p>
            </div>
          </div>
        </div>

        {/* ── Filter ── */}
        <div className="px-6 sm:px-8 pt-5 pb-4">
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
            Uy vazifa statusi
          </p>

          {/* Custom dropdown */}
          <div className="relative w-52" ref={dropRef}>
            <button
              onClick={() => setDropOpen((v) => !v)}
              className="w-full flex items-center justify-between gap-2 px-4 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium shadow-sm hover:border-[#1f39a1] transition-all cursor-pointer"
              style={{ height: "40px" }}
            >
              <span className="flex items-center gap-2">
                {currentOption.value !== "Barchasi" && (
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full"
                    style={{ background: currentOption.bg }}
                  />
                )}
                <span className="text-gray-700 dark:text-gray-200">
                  {currentOption.label}
                </span>
              </span>
              <KeyboardArrowDownIcon
                className={`text-gray-400 transition-transform duration-200 ${dropOpen ? "rotate-180" : ""}`}
                style={{ fontSize: 20 }}
              />
            </button>

            {/* Dropdown menu */}
            {dropOpen && (
              <div className="absolute z-50 top-full left-0 mt-1 w-full rounded-xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl overflow-hidden">
                {FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setStatusFilter(opt.value);
                      setDropOpen(false);
                    }}
                    className="w-full text-left px-4 text-[15px] font-medium transition-all cursor-pointer flex items-center"
                    style={{
                      background: opt.value === "Barchasi"
                        ? statusFilter === "Barchasi" ? "#e8eeff" : "#f9fafb"
                        : opt.bg,
                      color: opt.value === "Barchasi" ? "#374151" : "#fff",
                      height: "40px",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Table ── */}
        <div className="px-6 sm:px-8 pb-8">
          <div className="border border-gray-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-slate-900">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center py-24">
                  <div className="w-9 h-9 border-4 border-[#1f39a1] dark:border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : sorted.length === 0 ? (
                <div className="text-center py-24 text-gray-400 dark:text-gray-500 text-base">
                  Darslar topilmadi
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[750px]">
                  <thead>
                    <tr className="bg-[#f0f4ff]/70 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                      <th className="px-6 py-4 text-xs font-bold text-[#1f39a1] dark:text-blue-400 uppercase tracking-wide">
                        Mavzu
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-[#1f39a1] dark:text-blue-400 uppercase tracking-wide text-center">
                        Video
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-[#1f39a1] dark:text-blue-400 uppercase tracking-wide text-center">
                        Uyga vazifa Holati
                      </th>

                      {/* Deadline — sortable */}
                      <th
                        onClick={() => toggleSort("deadline")}
                        className="px-6 py-4 text-xs font-bold text-[#1f39a1] dark:text-blue-400 uppercase tracking-wide cursor-pointer select-none hover:bg-[#e8eeff] dark:hover:bg-slate-800/80 transition-colors"
                      >
                        <div className="flex items-center gap-1 justify-center whitespace-nowrap">
                          Uyga vazifa tugash vaqti
                          <span className="text-base leading-none">
                            {sortBy === "deadline"
                              ? sortOrder === "asc"
                                ? " ↑"
                                : " ↓"
                              : " ⇅"}
                          </span>
                        </div>
                      </th>

                      {/* Dars sanasi — sortable */}
                      <th
                        onClick={() => toggleSort("date")}
                        className="px-6 py-4 text-xs font-bold text-[#1f39a1] dark:text-blue-400 uppercase tracking-wide cursor-pointer select-none hover:bg-[#e8eeff] dark:hover:bg-slate-800/80 transition-colors"
                      >
                        <div className="flex items-center gap-1 justify-center whitespace-nowrap">
                          Dars sanasi
                          <span className="text-base leading-none">
                            {sortBy === "date"
                              ? sortOrder === "asc"
                                ? " ↑"
                                : " ↓"
                              : " ⇅"}
                          </span>
                        </div>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                    {sorted.map((lesson, idx) => {
                      const st     = STATUS_MAP[lesson.status] || STATUS_MAP.berilmagan;
                      const dl     = deadline(lesson);
                      return (
                        <tr
                          key={idx}
                          className="hover:bg-[#f8faff] dark:hover:bg-slate-800/20 transition-colors"
                        >
                          {/* Mavzu */}
                          <td className="px-6 py-4 text-sm  text-gray-800 dark:text-gray-200 max-w-[260px]">
                            <span className="truncate block" title={lesson.topic}>
                              {lesson.topic}
                            </span>
                          </td>

                          {/* Video soni */}
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center">
                              <span className="w-7 h-7 rounded-full border-1 border-blue-400 text-blue-500 flex items-center justify-center text-xs">
                                {lesson.videoCount ?? 0}
                              </span>
                            </div>
                          </td>

                          {/* Status badge — dropdown bilan bir xil o'lcham va stil */}
                          <td className="px-6 py-4 text-center">
                            <span
                              className="inline-flex items-center justify-center text-[15px] font-medium text-white rounded-lg"
                              style={{
                                background: st.bg,
                                minWidth: "150px",
                                height: "40px",
                                paddingLeft: "16px",
                                paddingRight: "16px",
                              }}
                            >
                              {st.label}
                            </span>
                          </td>

                          {/* Deadline */}
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 text-center whitespace-nowrap">
                            {dl}
                          </td>

                          {/* Dars sanasi */}
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 text-center whitespace-nowrap">
                            {formatDateUz(lesson.created_at)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
