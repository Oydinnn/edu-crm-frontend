import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import api from "../../services/axios";

// Date time formatter matching the mockup format (e.g. 10 Iyun, 2026 23:36)
function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "—";
  const months = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
    "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day} ${month}, ${year} ${hours}:${minutes}`;
}

const getFileUrl = (filename) => {
  if (!filename) return "";
  const base = import.meta.env.VITE_API_URL?.replace("/api/v1", "") || "http://localhost:3000";
  return `${base}/uploads/answers/${filename}`;
};

const parseFiles = (fileValue) => {
  if (!fileValue) return [];
  if (Array.isArray(fileValue)) return fileValue;
  if (typeof fileValue !== "string") return [];
  try {
    const parsed = JSON.parse(fileValue);
    if (Array.isArray(parsed)) return parsed;
  } catch (err) {
    console.debug("Failed to parse file JSON, fallback to single file string:", err);
  }
  return [fileValue];
};

const isImageFile = (file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file);
const isVideoFile = (file) => /\.(mp4|webm|mov|mkv)$/i.test(file);

// Formats urls inside text to be clickable
const renderDescriptionText = (text) => {
  if (!text) return "—";
  const lines = text.split("\n");
  return lines.map((line, lineIdx) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = line.split(urlRegex);
    return (
      <div key={lineIdx} className={lineIdx > 0 ? "mt-1" : ""}>
        {parts.map((part, index) => {
          if (part.match(urlRegex)) {
            return (
              <a
                key={index}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1f39a1] hover:underline break-all font-semibold inline-block mr-1"
              >
                {part}
              </a>
            );
          }
          return part;
        })}
      </div>
    );
  });
};

export default function RejectedHomework() {
  const { id: groupId, homeworkId, studentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const homeworkState = location.state?.homework || null;

  const isTeacherPanel = location.pathname.startsWith("/teacher");
  const groupsBase = isTeacherPanel ? "/teacher/groups" : "/groups";

  const [homework, setHomework] = useState(homeworkState);
  const [students, setStudents] = useState([]);
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedStudentId, setExpandedStudentId] = useState(null);

  // Load homework topic if not passed via location state
  useEffect(() => {
    if (homework || !groupId || !homeworkId) return;

    api
      .get(`/homework/group/${groupId}`)
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
  }, [homework, homeworkId, groupId]);

  // Load all rejected students list and detail result
  useEffect(() => {
    if (!groupId || !homeworkId) return;

    async function loadAllData() {
      setLoading(true);
      try {
        const statuses = ["REJECTED"];
        const responses = await Promise.all(
          statuses.map((status) =>
            api.get(`/group/${groupId}/homework/${homeworkId}/results`, {
              params: { status },
            })
          )
        );

        const allData = responses.flatMap((res) => res.data?.data || res.data || []);
        // Get unique list of students
        const seen = new Set();
        const rejectedStudents = allData.filter((student) => {
          if (!student || !student.id) return false;
          if (seen.has(student.id)) return false;
          seen.add(student.id);
          return true;
        });

        setStudents(rejectedStudents);

        // Fetch detail data for each student in parallel
        const detailsMap = {};
        await Promise.all(
          rejectedStudents.map(async (student) => {
            try {
              const res = await api.get(
                `/group/${groupId}/homework/${homeworkId}/results/${student.id}?status=REJECTED`
              );
              detailsMap[student.id] = res.data?.data || null;
            } catch (err) {
              console.error(`Error loading details for student ${student.id}`, err);
            }
          })
        );

        setDetails(detailsMap);

        if (studentId) {
          setExpandedStudentId(Number(studentId));
        } else if (rejectedStudents.length > 0) {
          setExpandedStudentId(rejectedStudents[0].id);
        }
      } catch (err) {
        console.error("Error loading rejected students details data", err);
      } finally {
        setLoading(false);
      }
    }

    loadAllData();
  }, [groupId, homeworkId, studentId]);

  const handleBack = () => {
    navigate(`${groupsBase}/${groupId}/homework/${homeworkId}/checking`, {
      state: { homework },
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#1f39a1] border-t-transparent" />
          <p className="text-sm font-semibold text-gray-500">Ma'lumotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-8">
      <div className="w-full lg:w-3/5 mr-auto ml-0">
        {/* Navigation Breadcrumb */}
        <button
          type="button"
          onClick={handleBack}
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-gray-500 transition-colors hover:text-[#1f39a1]"
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 14 }} />
          <span>Qaytarilganlar</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">Uyga vazifa</span>
        </button>

        {/* Section: Uy vazifasi info */}
        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <h3 className="mb-4 text-lg font-bold text-gray-900">Uy vazifasi</h3>
          <div className="rounded-xl bg-gray-50/70 p-4 border border-gray-100/50">
            <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Izoh:
            </span>
            <p className="text-sm font-semibold text-gray-700 leading-relaxed font-sans">
              {homework?.topic || homework?.title || "Uy vazifasi izohi"}
            </p>
          </div>
        </div>

        {/* Section: Student Cards */}
        {students.length > 0 ? (
          <div className="space-y-6">
            {students.map((student) => {
              const studentDetail = details[student.id];
              const isExpanded = expandedStudentId === student.id;
              
              const files = parseFiles(studentDetail?.file);
              const hasFile = files.length > 0;
              const sentAt = studentDetail?.created_at || student.sent_at;
              const homeworkCreatedAt = studentDetail?.homework?.created_at || homework?.created_at;
              const grade = studentDetail?.homeworkResult?.grade;

              // Calculate late penalty warning + effective grade after penalty
              let lateWarning = null;
              let effectiveGrade = grade ?? null;
              if (homeworkCreatedAt && sentAt && grade) {
                const deadlineTime = new Date(homeworkCreatedAt).getTime() + 20 * 60 * 60 * 1000;
                const submittedTime = new Date(sentAt).getTime();
                if (submittedTime > deadlineTime) {
                  const diffMs = submittedTime - deadlineTime;
                  const hoursLate = Math.ceil(diffMs / (1000 * 60 * 60));
                  effectiveGrade = Math.round(grade * 0.9);
                  lateWarning = `${hoursLate} soatdan kechikib topshirilgani uchun qo'yilgan ${grade} ball 10 % ga kamaytirildi.`;
                }
              }

              // Calculate gamification stats based on effective (penalized) grade
              const displayGrade = effectiveGrade ?? "—";
              const xp = effectiveGrade ? (Math.floor(effectiveGrade / 50) || 1) : "—";
              const kumush = effectiveGrade ? Math.ceil(effectiveGrade / 10) : "—";

              return (
                <div
                  key={student.id}
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                >
                  {/* Card Header (Click to toggle expand/collapse) */}
                  <div
                    className="flex justify-between items-start cursor-pointer select-none"
                    onClick={() => setExpandedStudentId(isExpanded ? null : student.id)}
                  >
                    <div className="space-y-1">
                      <h4 className="text-xl font-bold text-gray-900 font-sans">
                        {student.full_name || "Talaba ismi"}
                      </h4>
                      {!isExpanded && (
                        <p className="text-sm font-semibold text-gray-500 font-sans">
                          Vaqti: <span className="text-gray-800 font-bold">{formatDateTime(sentAt)}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <KeyboardArrowUpIcon className="text-gray-400" />
                      ) : (
                        <KeyboardArrowDownIcon className="text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded View */}
                  {isExpanded ? (
                    <div className="mt-6 space-y-6 pt-6 border-t border-gray-100 transition-all duration-300">
                      {/* Metadata row */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-xl bg-gray-50/50 p-4 border border-gray-100/50">
                        <div>
                          <span className="block text-xs font-bold text-gray-400 mb-1 font-sans">Vaqti:</span>
                          <span className="text-sm font-bold text-gray-800 font-sans">
                            {formatDateTime(sentAt)}
                          </span>
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-gray-400 mb-1 font-sans">Fayllar soni:</span>
                          <span className="text-sm font-bold text-gray-800 font-sans">
                            {files.length}
                          </span>
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-gray-400 mb-1 font-sans">Status:</span>
                          <span className="inline-flex items-center rounded-md border border-red-200/50 bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-600 font-sans">
                            qaytarilgan
                          </span>
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-gray-400 mb-1 font-sans">Ball:</span>
                          <span className="text-sm font-bold text-gray-900 flex items-center gap-1 font-sans">
                            <span className="text-orange-500 text-base leading-none">⚡</span>
                            {displayGrade}
                          </span>
                        </div>
                      </div>

                      {/* Files block */}
                      {hasFile && (
                        <div className="space-y-3">
                          <h5 className="text-sm font-bold text-gray-500 font-sans">
                            Fayl: {files.length}
                          </h5>
                          <div className="flex flex-col gap-4">
                            {files.map((file) => {
                              const fileUrl = getFileUrl(file);

                              if (isImageFile(file)) {
                                return (
                                  <div
                                    key={file}
                                    className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white max-w-xs shadow-sm transition-all hover:border-gray-300"
                                  >
                                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="block">
                                      <img
                                        src={fileUrl}
                                        alt={file}
                                        className="h-auto w-full object-cover max-h-48 transition-transform duration-300 group-hover:scale-105"
                                      />
                                      <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                                        <span className="text-xs font-bold text-white uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/35 font-sans">
                                          Rasm ko'rish
                                        </span>
                                      </div>
                                    </a>
                                  </div>
                                );
                              }

                              if (isVideoFile(file)) {
                                return (
                                  <div
                                    key={file}
                                    className="group overflow-hidden rounded-xl border border-gray-200 bg-white max-w-xs shadow-sm transition-all hover:border-gray-300"
                                  >
                                    <video
                                      controls
                                      className="h-auto w-full max-h-48 bg-black"
                                      preload="metadata"
                                    >
                                      <source src={fileUrl} />
                                      Brauzeringiz video formatini qo'llab-quvvatlamaydi.
                                    </video>
                                    <div className="px-4 py-3 text-sm font-semibold text-gray-700 font-sans">
                                      {file}
                                    </div>
                                  </div>
                                );
                              }

                              return (
                                <a
                                  key={file}
                                  href={fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-300 font-sans"
                                >
                                  <CloudUploadIcon className="text-gray-400" />
                                  <span>{file}</span>
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Student Response with left border decoration */}
                      <div className="rounded-xl border-l-[3px] border-blue-600 bg-blue-50/30 p-4">
                        <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 font-sans">
                          Uyga vazifa izohi:
                        </span>
                        <div className="text-sm font-semibold text-gray-700 leading-relaxed font-sans">
                          {renderDescriptionText(studentDetail?.title)}
                        </div>
                      </div>

                      {/* Teacher Comment */}
                      {studentDetail?.homeworkResult?.title && (
                        <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
                          <p className="text-sm font-semibold text-gray-700 leading-relaxed font-sans">
                            <span className="text-gray-400 font-bold uppercase tracking-wider text-xs block mb-1.5 font-sans">O'qituvchi izohi:</span>
                            <span className="font-bold text-gray-900">{studentDetail.homeworkResult.title}</span>
                          </p>
                        </div>
                      )}

                      {/* Late Warning Alert */}
                      {lateWarning && (
                        <div className="rounded-xl border border-red-100 bg-red-50/70 p-4 text-red-700 flex items-start gap-3">
                          <WarningAmberIcon className="text-orange-500 shrink-0 mt-0.5" sx={{ fontSize: 20 }} />
                          <span className="text-sm font-semibold leading-normal font-sans">
                            {lateWarning}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Collapsed View (Grid showing Ball, XP, Kumush) */
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <span className="block text-xs font-bold text-gray-400 font-sans">Ball:</span>
                          <span className="text-base font-bold text-gray-900 flex items-center gap-1.5 font-sans">
                            <span className="text-orange-500 text-lg leading-none">⚡</span> {displayGrade}
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          <span className="block text-xs font-bold text-gray-400 font-sans">XP:</span>
                          <span className="text-base font-bold text-gray-900 flex items-center gap-1.5 font-sans">
                            <span className="inline-flex h-5.5 w-5.5 items-center justify-center rounded-full bg-[#8b5cf6] text-[11px] font-bold text-white leading-none">XP</span> {xp}
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          <span className="block text-xs font-bold text-gray-400 font-sans">Kumush:</span>
                          <span className="text-base font-bold text-gray-900 flex items-center gap-1.5 font-sans">
                            <span className="inline-flex h-5.5 w-5.5 items-center justify-center rounded-full bg-gradient-to-tr from-gray-400 to-gray-200 border border-gray-300 text-[10px] font-extrabold text-slate-700 leading-none">K</span> {kumush}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center text-sm text-gray-400 bg-white rounded-2xl border border-gray-100 shadow-sm font-sans">
            Qaytarilgan uyga vazifalar mavjud emas.
          </div>
        )}
      </div>
    </div>
  );
}
