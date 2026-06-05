import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/axios";

// MUI Icons
import GroupIcon from "@mui/icons-material/Group";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import ArchiveIcon from "@mui/icons-material/Archive";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import CloseIcon from "@mui/icons-material/Close";

const COLS = [
  { label: "Status", cls: "flex-1" },
  { label: "Guruh", cls: "flex-1" },
  { label: "Kurs", cls: "flex-1" },
  { label: "Davomiyligi", cls: "flex-1" },
  { label: "Dars vaqti", cls: "flex-1" },
  { label: "Xona", cls: "flex-1" },
  { label: "Talabalar", cls: "flex-1" },
  { label: "Amallar", cls: "flex-1 text-center" },
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

function GuruhKorishModal({ guruh, onClose }) {
  if (!guruh) return null;

  const AVATAR_COLORS = [
    { bg: "#ede9fe", color: "#5b21b6" },
    { bg: "#ecfdf5", color: "#065f46" },
    { bg: "#fef3c7", color: "#92400e" },
    { bg: "#fee2e2", color: "#991b1b" },
    { bg: "#e0f2fe", color: "#0c4a6e" },
  ];

  const av = AVATAR_COLORS[guruh.id % AVATAR_COLORS.length];
  const initials = guruh.name ? guruh.name.slice(0, 2).toUpperCase() : "G";

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-100 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl"
              style={{
                backgroundColor: av.bg,
                color: av.color,
              }}
            >
              {initials}
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-bold text-[#1f39a1] dark:text-blue-400">
                {guruh.name}
              </h2>
              <p className="text-sm text-gray-400 mt-1">{guruh.course || "Guruh haqida"}</p>
            </div>
          </div>
          <button onClick={onClose} className="cursor-pointer">
            <CloseIcon className="text-gray-400 hover:text-red-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-left">
          {/* Info cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Xona</p>
              <p className="font-semibold text-[#4a5568] dark:text-gray-200">
                {guruh.room || "—"}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Status</p>
              <p
                className={`font-bold text-[15px] uppercase ${
                  guruh.status !== "completed"
                    ? "text-[#22c55e] drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                    : "text-gray-500"
                }`}
              >
                {guruh.status || "ACTIVE"}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Boshlanish sanasi</p>
              <p className="font-semibold text-[#4a5568] dark:text-gray-200">
                {formatDate(guruh.start_date)}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Dars vaqti</p>
              <p className="font-semibold text-[#4a5568] dark:text-gray-200">
                {guruh.start_time || "—"}
              </p>
            </div>
          </div>

          {/* Dars kunlari */}
          {guruh.weekDay?.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                Dars kunlari
              </p>
              <div className="flex flex-wrap gap-2">
                {guruh.weekDay.map((day, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-[#1f39a1] dark:bg-blue-600 text-white text-xs"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Talabalar */}
          <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
              Talabalar ({guruh.students?.length || 0})
            </p>
            <div className="flex flex-wrap gap-2">
              {guruh.students?.length > 0 ? (
                guruh.students.map((student) => (
                  <span
                    key={student.id}
                    className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 text-xs border border-gray-200/50 dark:border-slate-700/50"
                  >
                    {student.full_name}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-400 dark:text-gray-500 italic">Talabalar mavjud emas</p>
              )}
            </div>
          </div>

          {/* Tavsif */}
          {guruh.description && (
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Tavsif</p>
              <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 text-sm text-[#4a5568] dark:text-gray-300">
                {guruh.description}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-slate-800 flex gap-3 bg-gray-50 dark:bg-slate-900">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TeacherGroups() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [aktifTab, setAktifTab] = useState("guruhlar");
  const [korishModal, setKorishModal] = useState(false);
  const [tanlanganGuruh, setTanlanganGuruh] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await api.get("/teachers/my/groups");
      if (response.data.success) {
        setGroups(response.data.data || []);
      }
    } catch (error) {
      console.error("Guruhlarni yuklashda xatolik:", error);
      // Fallback: agar maxsus endpoint ishlamasa
      try {
        const res = await api.get("/groups/my-groups");
        if (res.data.success) {
          setGroups(res.data.data || []);
        }
      } catch (err) {
        console.error("Fallback xatolik:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredGroups = groups.filter((group) => {
    const matchesSearch =
      group.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.room?.toLowerCase().includes(searchTerm.toLowerCase());

    if (aktifTab === "guruhlar") {
      return matchesSearch && group.status !== "completed";
    } else {
      return matchesSearch && group.status === "completed";
    }
  });

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 transition-colors duration-300">
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-[#4a5568] dark:text-blue-400">
            {t("teacher_groups_title") || "Mening guruhlarim"}
          </h1>
        </div>

        {/* ── Tablar ── */}
        <div className="flex gap-1 border-b border-gray-200 dark:border-slate-800 mb-6">
          {[
            { key: "guruhlar", label: t("teacher_groups_all") || "Guruhlar", icon: null },
            {
              key: "arxiv",
              label: t("archive") || "Arxiv",
              icon: <ArchiveIcon style={{ fontSize: 16 }} />,
            },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setAktifTab(key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium
                border-b-2 transition-all duration-300 -mb-px cursor-pointer
                ${
                  aktifTab === key
                    ? "border-[#1f39a1] text-[#1f39a1] dark:border-blue-500 dark:text-blue-400"
                    : "border-transparent text-[#4a5568] dark:text-gray-400 hover:text-[#1f39a1] dark:hover:text-blue-400 hover:bg-[#f0f4ff] dark:hover:bg-slate-800 rounded-t-lg"
                }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* ── Statistika kartochkalari ── */}
        <div className="flex flex-wrap gap-3 sm:gap-4 mb-6">
          <StatCard
            icon={GroupIcon}
            bg="bg-[#f0f4ff] dark:bg-slate-700/50"
            color="text-[#1f39a1] dark:text-blue-400"
            label="Jami guruhlar"
            value={groups.length}
          />
          <StatCard
            icon={SchoolIcon}
            bg="bg-[#f0f4ff] dark:bg-slate-700/50"
            color="text-[#1f39a1] dark:text-blue-400"
            label="Faol guruhlar"
            value={groups.filter((g) => g.status !== "completed").length}
          />
          <StatCard
            icon={PersonIcon}
            bg="bg-[#f0f4ff] dark:bg-slate-700/50"
            color="text-[#1f39a1] dark:text-blue-400"
            label="Talabalar soni"
            value={groups.reduce((s, g) => s + (g.student_count ?? g.students?.length ?? 0), 0)}
          />
        </div>

        {/* Qidirish */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t("search") || "Qidirish..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-850 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1f39a1]/30 dark:focus:ring-blue-500/30 focus:border-[#1f39a1] dark:focus:border-blue-500 transition-all duration-300"
            />
          </div>
        </div>

        {/* ── Jadval ── */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-[#1f39a1] dark:border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredGroups.length === 0 ? (
              <div className="text-center py-20">
                <GroupIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {t("groups_not_found") || "Guruhlar topilmadi"}
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center px-4 py-3.5 bg-[#f0f4ff]/60 dark:bg-slate-800/40 border-b border-gray-100 dark:border-slate-800 min-w-max">
                  {COLS.map((col, i) => (
                    <div key={i} className={`${col.cls} px-1`}>
                      <span className="text-xs font-semibold text-[#1f39a1]/60 dark:text-blue-400/60 uppercase tracking-wide">
                        {col.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Rows */}
                {filteredGroups.map((guruh) => (
                  <div
                    key={guruh.id}
                    className="flex items-center px-4 py-3.5 border-b border-gray-50 dark:border-slate-800/50 hover:bg-[#f0f4ff]/30 dark:hover:bg-slate-800/20 transition-all duration-300 min-w-max"
                  >
                    {/* Status indicator (Read-only toggle layout) */}
                    <div className="flex-1 px-1 flex items-center gap-1">
                      {guruh.status !== "completed" ? (
                        <ToggleOnIcon style={{ fontSize: 34, color: "#1f39a1" }} />
                      ) : (
                        <ToggleOffIcon style={{ fontSize: 34, color: "#d1d5db" }} />
                      )}
                      <span
                        className={`text-[10px] font-bold ${
                          guruh.status !== "completed" ? "text-emerald-500" : "text-gray-400"
                        }`}
                      >
                        {guruh.status ? guruh.status.toUpperCase() : "ACTIVE"}
                      </span>
                    </div>

                    {/* Guruh nomi */}
                    <div className="flex-1 px-1">
                      <Link
                        to={`/teacher/groups/${guruh.id}`}
                        className="text-sm font-semibold text-[#1f39a1] dark:text-blue-400 hover:underline"
                      >
                        {guruh.name}
                      </Link>
                    </div>

                    {/* Kurs badge */}
                    <div className="flex-1 px-1">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#6366f118] text-[#6366f1] dark:bg-indigo-500/10 dark:text-indigo-400">
                        {guruh.course}
                      </span>
                    </div>

                    {/* Davomiyligi */}
                    <div className="flex-1 px-1">
                      <p className="text-sm text-[#4a5568] dark:text-gray-300 font-medium">
                        {guruh.course_duration_hours} soat
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {guruh.start_date
                          ? new Date(guruh.start_date).toLocaleDateString("ru-RU")
                          : ""}{" "}
                        dan / {guruh.course_duration_month} oy
                      </p>
                    </div>

                    {/* Dars vaqti */}
                    <div className="flex-1 px-1">
                      <p className="text-sm font-medium text-[#4a5568] dark:text-gray-300">
                        {guruh.start_time || ""}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate max-w-[150px]">
                        {guruh.weekDay?.join(", ")}
                      </p>
                    </div>

                    {/* Xona */}
                    <div className="flex-1 px-1">
                      <span className="text-sm text-[#4a5568] dark:text-gray-300">{guruh.room}</span>
                    </div>

                    {/* Talabalar soni */}
                    <div className="flex-1 px-1">
                      <span className="text-sm font-bold text-[#4a5568] dark:text-gray-300">
                        {guruh.student_count ?? guruh.students?.length ?? 0} / {guruh.max_student || 20}
                      </span>
                    </div>

                    {/* Amallar */}
                    <div className="flex-1 px-1 flex items-center justify-center">
                      <button
                        onClick={() => {
                          setTanlanganGuruh(guruh);
                          setKorishModal(true);
                        }}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-[#f0f4ff] dark:hover:bg-slate-800 hover:text-[#1f39a1] dark:hover:text-blue-400 transition-colors cursor-pointer"
                        title="Batafsil ko'rish"
                      >
                        <VisibilityIcon style={{ fontSize: 18 }} />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Guruh Korish Modal */}
      {korishModal && tanlanganGuruh && (
        <GuruhKorishModal
          guruh={tanlanganGuruh}
          onClose={() => {
            setKorishModal(false);
            setTanlanganGuruh(null);
          }}
        />
      )}
    </div>
  );
}
