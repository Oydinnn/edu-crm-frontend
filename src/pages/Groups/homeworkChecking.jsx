//guruh darsliklari groupHomework.jsxdagi mavzuni ustiga bosgandagi ochiladigan sahifa
//kutayotganlar, qaytarilganlar, qabul qilinganlar, bajarilmaganlar
//har bir darslikni usti bosilganda shu darslikni bajarish uchun berilgan vaqt ko'rinishi kerak
//bajarish vaqti bugundan + 20 soat
//

import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import api from "../../services/axios";

const TABS = [
  { key: "pending", label: "Kutayotganlar", statuses: ["PENDING"] },
  { key: "rejected", label: "Qaytarilganlar", statuses: ["REJECTED"] },
  { key: "accepted", label: "Qabul qilinganlar", statuses: ["CHECKED"] },
  { key: "not_done", label: "Bajarilmagan", statuses: [] },
];

function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "—";
  const months = [
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
  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day} ${month}, ${year} ${hours}:${minutes}`;
}

function addHours(dateStr, hours) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(date.getHours() + hours);
  return date.toISOString();
}

function normalizeList(payload) {
  const data = payload?.data ?? payload ?? [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  return [];
}

function uniqueStudents(rows) {
  const seen = new Set();
  return rows.filter((row) => {
    const key = row.id ?? row.full_name;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default function HomeworkChecking() {
  const { id, homeworkId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const homeworkState = location.state?.homework || null;

  const isTeacherPanel = location.pathname.startsWith("/teacher");
  const groupsBase = isTeacherPanel ? "/teacher/groups" : "/groups";

  const [homework, setHomework] = useState(homeworkState);
  const [activeTab, setActiveTab] = useState("pending");
  const [rowsByTab, setRowsByTab] = useState({});
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (homework || !id || !homeworkId) return;

    api
      .get(`/homework/group/${id}`)
      .then((res) => {
        const data = res.data?.data ?? {};
        const groupLessons = Array.isArray(data.groupFormated)
          ? data.groupFormated
          : [];
        const found = groupLessons
          .flatMap((lesson) =>
            (lesson.homework || []).map((item) => ({
              ...item,
              lesson_id: lesson.id,
              topic: lesson.topic,
              lesson_created_at: lesson.created_at,
            })),
          )
          .find((item) => String(item.id) === String(homeworkId));
        if (found) setHomework(found);
      })
      .catch(() => {});
  }, [homework, homeworkId, id]);

  useEffect(() => {
    if (!id || !homeworkId) return;

    async function fetchTabRows(tab) {
      if (!tab.statuses.length) {
        const res = await api.get(`/group/${id}/homework/${homeworkId}/results`);
        return normalizeList(res.data);
      }

      const responses = await Promise.all(
        tab.statuses.map((status) =>
          api.get(`/group/${id}/homework/${homeworkId}/results`, {
            params: { status },
          }),
        ),
      );
      return uniqueStudents(responses.flatMap((res) => normalizeList(res.data)));
    }

    setLoading(true);
    Promise.all(TABS.map((tab) => fetchTabRows(tab).catch(() => [])))
      .then((results) => {
        setRowsByTab(
          TABS.reduce(
            (acc, tab, index) => ({ ...acc, [tab.key]: results[index] }),
            {},
          ),
        );
      })
      .finally(() => setLoading(false));
  }, [homeworkId, id]);

  const rows = rowsByTab[activeTab] || [];
  const counts = TABS.reduce(
    (acc, tab) => ({ ...acc, [tab.key]: rowsByTab[tab.key]?.length ?? 0 }),
    {},
  );

  return (
    <div className="min-h-screen bg-white p-6">
      <button
        type="button"
        onClick={() => navigate(`${groupsBase}/${id}?tab=lessons`)}
        className="mb-7 inline-flex items-center gap-3 text-2xl font-bold text-gray-900 transition-colors hover:text-[#1f39a1]"
      >
        <ArrowBackIosNewIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
        {homework?.topic || homework?.title || "Uyga vazifa"}
      </button>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="grid grid-cols-1 gap-8 border-b border-gray-100 bg-gray-50/30 p-6 sm:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold text-gray-500">Mavzu</p>
            <h1 className="text-xl font-bold text-gray-900">
              {homework?.topic || homework?.title || "—"}
            </h1>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-gray-500">
              Tugash vaqti
            </p>
            <h2 className="text-xl font-bold text-gray-900">
              {formatDateTime(addHours(homework?.created_at, 20))}
            </h2>
          </div>
        </div>

        <div className="px-6 pt-6">
          <div className="flex flex-wrap gap-8 border-b border-gray-200">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`relative pb-4 text-base font-semibold transition-colors ${
                  activeTab === tab.key
                    ? "text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
                <span className="ml-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-amber-400 px-1.5 text-sm font-bold text-gray-900">
                  {counts[tab.key]}
                </span>
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 h-[3px] w-full rounded-t-full bg-[#14b8a6]" />
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[280px]">
            <div className="grid grid-cols-[1fr_1fr] border-b border-gray-200 px-4 py-5 text-sm font-bold text-gray-500">
              <div>O'quvchi ismi</div>
              <div>Uyga vazifa jo'natilgan vaqt</div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#1f39a1]" />
              </div>
            ) : rows.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {rows.map((student, index) => (
                  <div
                      key={student.id || index}
                      onClick={() => {
                        if (activeTab === "accepted") {
                          navigate(`${groupsBase}/${id}/homework/${homeworkId}/accepted/${student.id}`, {
                            state: { homework },
                          });
                        } else if (activeTab === "rejected") {
                          navigate(`${groupsBase}/${id}/homework/${homeworkId}/rejected/${student.id}`, {
                            state: { homework },
                          });
                        } else if (activeTab === "pending") {
                          navigate(`${groupsBase}/${id}/homework/${homeworkId}/pending/${student.id}`, {
                            state: {
                              homework,
                              status: activeTab,
                            },
                          });
                        }
                        // not_done tab - no navigation needed
                      }}
                      className={`grid grid-cols-[1fr_1fr] px-4 py-5 text-base text-gray-900 even:bg-gray-50 transition-colors ${
                        activeTab === "not_done"
                          ? "cursor-default"
                          : "cursor-pointer hover:bg-[#f0f4ff]/40"
                      }`}
                  >
                    <div>{student.full_name || "—"}</div>
                    <div>{formatDateTime(student.sent_at || student.created_at)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-sm text-gray-400">
                Ma'lumot mavjud emas
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
