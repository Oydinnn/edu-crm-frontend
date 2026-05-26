// GroupLessons.jsx — Guruh darsliklari tab kontenti
import { useEffect, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../services/axios";
import { useNavigate } from "react-router-dom";

// ─── Sub-tablar ─────────────────────────────────────────────────
const SUB_TABS = [
  { key: "homework", label: "Uyga vazifa" },
  { key: "videos", label: "Videolar" },
  { key: "exams", label: "Imtihonlar" },
  { key: "journal", label: "Jurnal" },
];

// ─── Sana formatlash ────────────────────────────────────────────
function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const mon = [
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
  ][d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${mon}, ${year}`;
}

function addHours(dateStr, hours) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(date.getHours() + hours);
  return date.toISOString();
}

function getStudentCount(summary) {
  return summary.studentsInGroup ?? summary.existStudentInGroup ?? 0;
}

function getHomeworkCount(lesson) {
  return Array.isArray(lesson.homework) ? lesson.homework.length : 0;
}

// ─── Darsliklar jadvali ─────────────────────────────────────────
function LessonsTable({ lessons, loading, summary }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1f39a1]" />
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto border-t border-gray-100">
      <div className="min-w-[980px]">
      {/* Table header */}
      <div className="flex items-center px-3 py-3.5 border-b border-gray-100 bg-white">
        <div className="w-12 text-xs font-bold text-gray-500">#</div>
        <div className="flex-1 text-xs font-bold text-gray-500">Mavzu</div>
        <div className="w-12 text-center">
          <PersonIcon style={{ fontSize: 17, color: "#6b7280" }} />
        </div>
        <div className="w-12 text-center">
          <AccessTimeIcon style={{ fontSize: 16, color: "#f59e0b" }} />
        </div>
        <div className="w-12 text-center">
          <CheckCircleIcon style={{ fontSize: 16, color: "#14b8a6" }} />
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
        <div className="w-36 text-xs font-bold text-gray-500 text-center">
          Amallar
        </div>
      </div>

      {/* Table rows */}
      <div className="bg-white divide-y divide-gray-50">
        {lessons.length > 0 ? (
          lessons.map((lesson, idx) => {
            return (
              <div
                key={lesson.id || idx}
                className="flex items-center px-3 py-3.5 even:bg-gray-50/70 hover:bg-[#f0f4ff]/40 transition-colors"
              >
                <div className="w-12 text-sm text-gray-500 font-medium">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-gray-800 leading-5">
                    {lesson.topic || lesson.name || "—"}
                  </span>
                </div>
                <div className="w-12 text-center text-sm font-semibold text-gray-600">
                  {lesson.student_count ?? getStudentCount(summary)}
                </div>
                <div className="w-12 text-center text-sm font-semibold text-gray-600">
                  {lesson.homeworkPending ?? summary.homeworkPending ?? 0}
                </div>
                <div className="w-12 text-center text-sm font-semibold text-gray-600">
                  {lesson.homeworkAccepted ??
                    summary.homeworkAccepted ??
                    getHomeworkCount(lesson)}
                </div>
                <div className="w-36 text-center text-xs text-gray-500 whitespace-pre-line leading-tight">
                  {formatDateTime(
                    lesson.given_at ||
                      lesson.homework?.[0]?.created_at ||
                      lesson.created_at,
                  )}
                </div>
                <div className="w-36 text-center text-xs text-gray-500 whitespace-pre-line leading-tight">
                  {formatDateTime(
                    lesson.due_at ||
                      lesson.deadline ||
                      addHours(
                        lesson.given_at ||
                          lesson.homework?.[0]?.created_at ||
                          lesson.created_at,
                        20,
                      ),
                  )}
                </div>
                <div className="w-28 text-center text-xs text-gray-500">
                  {formatDate(lesson.lesson_date || lesson.date)}
                </div>
                <div className="w-36 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    aria-label="Ko'rish"
                    title="Ko'rish"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-[#f0f4ff] hover:text-[#1f39a1]"
                  >
                    <VisibilityIcon style={{ fontSize: 20 }} />
                  </button>
                  <button
                    type="button"
                    aria-label="Tahrirlash"
                    title="Tahrirlash"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-[#f0f4ff] hover:text-[#1f39a1]"
                  >
                    <EditIcon style={{ fontSize: 20 }} />
                  </button>
                  <button
                    type="button"
                    aria-label="O'chirish"
                    title="O'chirish"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <DeleteIcon style={{ fontSize: 20 }} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="px-5 py-12 text-center text-sm text-gray-400">
            Hozircha uy vazifalari mavjud emas
          </div>
        )}
      </div>
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
  const navigate = useNavigate();
  const [activeSubTab, setActiveSubTab] = useState("homework");
  const [lessons, setLessons] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  // ── Uy vazifalarni yuklash ──
  useEffect(() => {
    if (!guruh?.id) return;
    setLoading(true);
    api
      .get(`/homework/${guruh.id}`)
      .then((res) => {
        const data = res.data?.data ?? res.data ?? {};
        setLessons(Array.isArray(data.groupFormated) ? data.groupFormated : []);
        setSummary({
          homeworkPending: data.homeworkPending ?? 0,
          homeworkAccepted: data.homeworkAccepted ?? 0,
          existStudentInGroup: data.existStudentInGroup ?? 0,
          studentsInGroup: data.studentsInGroup,
        });
      })
      .catch(() => {
        setLessons([]);
        setSummary({});
      })
      .finally(() => setLoading(false));
  }, [guruh?.id]);

  return (
    <div>
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
              onClick={() => navigate(`/groups/${guruh.id}/homework/create`)}
              className="px-4 py-2 text-sm font-semibold text-white bg-[#1f39a1] rounded-lg shadow-md shadow-blue-200 hover:bg-[#162870] transition-all duration-200"
            >
              Uyga vazifa qo'shish
            </button>
          </div>
        ) : null}
      </div>

      {/* ── Kontent ── */}
      {activeSubTab === "lessons" && (
        <LessonsTable lessons={lessons} loading={loading} summary={summary} />
      )}
      {activeSubTab === "homework" && (
        <LessonsTable lessons={lessons} loading={loading} summary={summary} />
      )}
      {activeSubTab === "videos" && <PlaceholderContent title="Videolar" />}
      {activeSubTab === "exams" && <PlaceholderContent title="Imtihonlar" />}
      {activeSubTab === "journal" && <PlaceholderContent title="Jurnal" />}
    </div>
  );
}
