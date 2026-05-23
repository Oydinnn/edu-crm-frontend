// GroupLessons.jsx — Guruh darsliklari tab kontenti
import { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import api from "../../services/axios";

// ─── Sub-tablar ─────────────────────────────────────────────────
const SUB_TABS = [
  { key: "homework", label: "Uyga vazifa" },
  { key: "videos", label: "Videolar" },
  { key: "exams", label: "Imtihonlar" },
  { key: "journal", label: "Jurnal" },
];

const MAIN_TABS = [
  { key: "info", label: "Ma'lumotlar" },
  { key: "lessons", label: "Guruh darsliklari" },
  { key: "attendance", label: "Akademik davomat" },
];

// ─── Sana formatlash ────────────────────────────────────────────
function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const mon = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ][d.getMonth()];
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  return `${day} ${mon}, ${year}\n${hours}:${mins}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const mon = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ][d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${mon}, ${year}`;
}

// ─── Darsliklar jadvali ─────────────────────────────────────────
function LessonsTable({ lessons, loading }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10b981]" />
      </div>
    );
  }

  return (
    <div className="w-full border border-gray-100 rounded-xl overflow-hidden">
      {/* Table header */}
      <div className="flex items-center px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
        <div className="w-12 text-xs font-bold text-gray-500">#</div>
        <div className="flex-1 text-xs font-bold text-gray-500">Mavzu</div>
        <div className="w-12 text-center">
          <ThumbUpAltIcon style={{ fontSize: 14, color: "#9ca3af" }} />
        </div>
        <div className="w-12 text-center">
          <ThumbDownAltIcon style={{ fontSize: 14, color: "#9ca3af" }} />
        </div>
        <div className="w-12 text-center">
          <CheckCircleIcon style={{ fontSize: 14, color: "#9ca3af" }} />
        </div>
        <div className="w-36 text-xs font-bold text-gray-500 text-center">
          Berilgan vaqt
        </div>
        <div className="w-36 text-xs font-bold text-gray-500 text-center">
          Tugash vaqti
        </div>
        <div className="w-28 text-xs font-bold text-gray-500 text-center">
          Dars sanasi
        </div>
        <div className="w-8" />
      </div>

      {/* Table rows */}
      <div className="bg-white divide-y divide-gray-50">
        {lessons.length > 0 ? (
          lessons.map((lesson, idx) => {
            // Rangni aniqlash: agar completed bo'lsa yashil, agar late bo'lsa qizil
            const isCompleted = lesson.isCompleted || lesson.status === "completed";
            const isLate = lesson.isLate || lesson.status === "late";
            const topicBg = isLate
              ? "bg-red-400 text-white rounded-md px-3 py-1"
              : isCompleted
                ? "bg-emerald-400 text-white rounded-md px-3 py-1"
                : "";

            return (
              <div
                key={lesson.id || idx}
                className="flex items-center px-5 py-3.5 hover:bg-gray-50/50 transition-colors"
              >
                <div className="w-12 text-sm text-gray-500 font-medium">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className={`text-sm font-medium ${
                      topicBg || "text-gray-800"
                    }`}
                  >
                    {lesson.topic || lesson.name || "—"}
                  </span>
                </div>
                <div className="w-12 text-center text-sm font-semibold text-gray-600">
                  {lesson.likes ?? lesson.thumbs_up ?? 0}
                </div>
                <div className="w-12 text-center text-sm font-semibold text-gray-600">
                  {lesson.dislikes ?? lesson.thumbs_down ?? 0}
                </div>
                <div className="w-12 text-center text-sm font-semibold text-gray-600">
                  {lesson.checks ?? lesson.completed_count ?? 0}
                </div>
                <div className="w-36 text-center text-xs text-gray-500 whitespace-pre-line leading-tight">
                  {formatDateTime(lesson.given_at || lesson.created_at)}
                </div>
                <div className="w-36 text-center text-xs text-gray-500 whitespace-pre-line leading-tight">
                  {formatDateTime(lesson.due_at || lesson.deadline)}
                </div>
                <div className="w-28 text-center text-xs text-gray-500">
                  {formatDate(lesson.lesson_date || lesson.date)}
                </div>
                <div className="w-8 flex justify-center">
                  <button className="p-1 rounded-md text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors">
                    <MoreVertIcon style={{ fontSize: 16 }} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="px-5 py-12 text-center text-sm text-gray-400">
            Hozircha darsliklar mavjud emas
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Placeholder kontentlar ─────────────────────────────────────
function PlaceholderContent({ title }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <p className="text-sm">{title} bo'limi tez orada qo'shiladi</p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// ASOSIY KOMPONENT
// ════════════════════════════════════════════════════════════════
export default function GroupLessons({ guruh }) {
  const [activeSubTab, setActiveSubTab] = useState("lessons");
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Darsliklarni yuklash ──
  useEffect(() => {
    if (!guruh?.id) return;
    setLoading(true);
    api
      .get(`/groups/${guruh.id}/lessons`)
      .then((res) => {
        const data = res.data?.data ?? res.data ?? [];
        setLessons(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        // Agar lessons endpointi bo'lmasa, schedules dan olishga harakat qilamiz
        api
          .get(`/groups/${guruh.id}/schedules`)
          .then((res2) => {
            const data = res2.data?.data ?? res2.data;
            // schedules dan darslik ro'yxatini yaratish
            if (data && typeof data === "object") {
              const allLessons = [];
              Object.values(data).forEach((week) => {
                if (week.day && Array.isArray(week.day)) {
                  week.day.forEach((d) => {
                    allLessons.push({
                      id: `${d.month}-${d.day}`,
                      topic: d.topic || "",
                      lesson_date: d.date,
                      isCompleted: d.isCompleted,
                      likes: d.likes || 0,
                      dislikes: d.dislikes || 0,
                      checks: d.checks || 0,
                    });
                  });
                }
              });
              setLessons(allLessons);
            } else {
              setLessons([]);
            }
          })
          .catch(() => setLessons([]))
          .finally(() => setLoading(false));
        return; // finally ni oldiga qo'ymaslik uchun
      })
      .finally(() => setLoading(false));
  }, [guruh?.id]);

  return (
    <div>
      {/* Header: group title + status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => window.history.back()} className="p-1 rounded-md hover:bg-gray-100">
            <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <h2 className="text-2xl font-bold text-[#1f2937]">{guruh?.name || "Guruh"}</h2>
          {guruh?.status && (
            <span className={`ml-2 inline-block text-xs font-medium px-2.5 py-1 rounded-full ${guruh.status === "active" ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-600"}`}>
              {guruh.status === "active" ? "Aktiv" : guruh.status}
            </span>
          )}
        </div>
        <div>
          <button className="text-sm text-gray-600 bg-white border border-gray-100 px-3 py-1 rounded-lg">Statistika</button>
        </div>
      </div>

      {/* Main tabs (Ma'lumotlar / Guruh darsliklari / Akademik davomat) */}
      <div className="flex items-center gap-1 mb-4 border-b border-gray-100">
        {MAIN_TABS.map((t) => (
          <button
            key={t.key}
            className={`px-4 py-2 text-sm font-medium -mb-px ${t.key === "lessons" ? "text-[#1f39a1] border-b-2 border-[#1f39a1] font-semibold" : "text-gray-500 hover:text-gray-700"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Section title + inner small tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-bold text-gray-800">Guruh darsliklari</h3>
          <div className="flex items-center gap-2">
            {SUB_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveSubTab(tab.key)}
                className={`text-sm px-3 py-1.5 rounded-md transition-all ${
                  activeSubTab === tab.key
                    ? "bg-[#f0f6ff] text-[#1f39a1] font-semibold border border-[#e6f0ff]"
                    : "bg-white text-gray-500 border border-gray-100 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Uyga vazifa qo'shish button */}
        {activeSubTab === "homework" || activeSubTab === "lessons" ? (
          <div>
            <button
              className="px-4 py-2 text-sm font-semibold text-white bg-[#10b981]
                rounded-lg shadow-sm shadow-emerald-200 hover:bg-[#059669]
                transition-all duration-200"
            >
              Uyga vazifa qo'shish
            </button>
          </div>
        ) : null}
      </div>

      {/* ── Kontent ── */}
      {activeSubTab === "lessons" && (
        <LessonsTable lessons={lessons} loading={loading} />
      )}
      {activeSubTab === "homework" && (
        <PlaceholderContent title="Uyga vazifa" />
      )}
      {activeSubTab === "videos" && (
        <PlaceholderContent title="Videolar" />
      )}
      {activeSubTab === "exams" && (
        <PlaceholderContent title="Imtihonlar" />
      )}
      {activeSubTab === "journal" && (
        <PlaceholderContent title="Jurnal" />
      )}
    </div>
  );
}
