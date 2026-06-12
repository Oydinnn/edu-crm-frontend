import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import WarningIcon from "@mui/icons-material/Warning";
import EditIcon from "@mui/icons-material/Edit";
import api from "../../services/axios";

// ──────────────────────────────────────────────────────────
// O'zbekcha oylar
// ──────────────────────────────────────────────────────────
const UZ_MONTHS = [
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

const formatDateUz = (isoDate, includeTime = false) => {
  if (!isoDate) return "—";
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "—";
  const day = String(date.getDate()).padStart(2, "0");
  const month = UZ_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  if (includeTime) {
    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");
    return `${day} ${month}, ${year} ${h}:${m}`;
  }
  return `${day} ${month}, ${year}`;
};

const formatTimeFirstUz = (isoDate) => {
  if (!isoDate) return "—";
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "—";
  const day = String(date.getDate()).padStart(2, "0");
  const month = UZ_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m} ${day} ${month}, ${year}`;
};

const getHomeworkFileUrl = (fileName) => {
  if (!fileName) return "";
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
  return `${baseUrl.replace("/api/v1", "")}/files/files/${fileName}`;
};

const getAnswerFileUrl = (fileName) => {
  if (!fileName) return "";
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
  return `${baseUrl.replace("/api/v1", "")}/uploads/answers/${fileName}`;
};

const parseHomeworkFiles = (fileValue) => {
  if (!fileValue) return [];
  if (Array.isArray(fileValue)) return fileValue;
  if (typeof fileValue !== "string") return [];

  try {
    const parsed = JSON.parse(fileValue);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch {
    // Backward compatibility for single-file values.
  }

  return [fileValue];
};

const getVideoUrl = (filename) => {
  if (!filename) return "";
  const base = import.meta.env.VITE_API_URL?.replace("/api/v1", "") || "http://localhost:3000";
  return `${base}/files/files/${filename}`;
};

export default function StudentMyGroupLessonHomework() {
  const { groupId, lessonId } = useParams();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selectedLessonId, setSelectedLessonId] = useState(parseInt(lessonId));
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [expandedLessonId, setExpandedLessonId] = useState(parseInt(lessonId));
  const [lessonVideosMap, setLessonVideosMap] = useState({}); // Har bir dars uchun videoları saqlash

  // Homework states
  const [homeworkData, setHomeworkData] = useState(null);
  const [loadingHomework, setLoadingHomework] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [answerFiles, setAnswerFiles] = useState([]);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  // 1. Darslar ro'yxatini va videolarni guruh bo'yicha yuklash (faqat groupId o'zgarganda)
  useEffect(() => {
    if (!groupId) return;
    const fetchLessons = async () => {
      try {
        setLoadingLessons(true);
        const res = await api.get(`/lessons/my/group/${groupId}`);
        const lessonsList = res.data?.data || [];
        setLessons(lessonsList);

        // Har bir dars uchun videoları parallel ravishda yuklash
        const videoMapPromises = lessonsList.map(async (lesson) => {
          try {
            const videosRes = await api.get(
              `/groups/${groupId}/lessons/${lesson.id}/videos`,
            );
            const videosList = videosRes.data?.data || [];
            return { lessonId: lesson.id, videos: videosList };
          } catch (err) {
            console.error(
              `Lesson ${lesson.id} uchun videoları yuklashda xatolik:`,
              err,
            );
            return { lessonId: lesson.id, videos: [] };
          }
        });

        const videoResults = await Promise.all(videoMapPromises);
        const newVideoMap = {};
        videoResults.forEach(({ lessonId, videos }) => {
          newVideoMap[lessonId] = videos;
        });
        setLessonVideosMap(newVideoMap);
      } catch (err) {
        console.error("Darslarni yuklashda xatolik:", err);
      } finally {
        setLoadingLessons(false);
      }
    };
    fetchLessons();
  }, [groupId]);

  // 2. URLdagi lessonId parametridan local statega sinxronizatsiya
  useEffect(() => {
    if (lessonId) {
      const parsed = parseInt(lessonId);
      if (!isNaN(parsed)) {
        setSelectedLessonId(parsed);
        setExpandedLessonId(parsed);
      }
    }
  }, [lessonId]);

  // 3. Tanlangan dars uchun videoları set qilish (cache'dan)
  useEffect(() => {
    if (!selectedLessonId || !groupId) return;

    if (lessonVideosMap[selectedLessonId]) {
      const cachedVideos = lessonVideosMap[selectedLessonId];
      setVideos(cachedVideos);
      if (cachedVideos.length > 0) {
        setSelectedVideoId(cachedVideos[0].id);
      } else {
        setSelectedVideoId(null);
      }
    }
  }, [selectedLessonId, lessonVideosMap]);

  // 4. Tanlangan dars uchun uy vazifasini yuklash
  useEffect(() => {
    if (!groupId || !selectedLessonId) return;
    const fetchHomework = async () => {
      try {
        setLoadingHomework(true);
        const res = await api.get(`/groups/${groupId}/lessons/${selectedLessonId}/homeworks`);
        setHomeworkData(res.data?.data || null);
      } catch (err) {
        console.error("Homework yuklashda xatolik:", err);
        setHomeworkData(null);
      } finally {
        setLoadingHomework(false);
      }
    };
    fetchHomework();
  }, [groupId, selectedLessonId]);

  const getHomework = () => {
    if (!homeworkData) return null;
    const hw = homeworkData.homeworks || homeworkData.homework;
    if (Array.isArray(hw)) return hw[0];
    return hw;
  };

  const homework = getHomework();

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!answerText.trim() && !answerFiles.length) {
      alert("Iltimos, tavsif yozing yoki fayl biriktiring");
      return;
    }
    if (!homework?.id) return;
    
    try {
      setSubmittingAnswer(true);
      const formData = new FormData();
      formData.append("title", answerText);
      answerFiles.forEach((file) => {
        formData.append("files", file);
      });

      await api.post(`/students/homeworkAnswer/${homework.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      
      // Ma'lumotlarni qayta yuklash
      const res = await api.get(`/groups/${groupId}/lessons/${selectedLessonId}/homeworks`);
      setHomeworkData(res.data?.data || null);
      
      setSubmitModalOpen(false);
      setAnswerText("");
      setAnswerFiles([]);
    } catch (err) {
      console.error("Javob yuborishda xatolik:", err);
      alert(err.response?.data?.message || "Javob yuborishda xatolik yuz berdi");
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const selectedVideo = videos.find((v) => v.id === selectedVideoId);
  const selectedLesson = lessons.find((l) => l.id === selectedLessonId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      {/* ── Header ── */}
      <div className="px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-3 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg text-gray-400 hover:text-[#1f39a1] transition-colors cursor-pointer"
          >
            <ArrowBackIcon style={{ fontSize: 22 }} />
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-6">
            {/* ── Left/Center: Video Player (Flexible) ── */}
            <div className="flex-1">
              {/* Video Player */}
              <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-slate-800 mb-4">
                {loadingVideos ? (
                  <div
                    className="w-full bg-black flex items-center justify-center"
                    style={{ aspectRatio: "16/9" }}
                  >
                    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : videos.length > 0 ? (
                  <div
                    className="w-full bg-black"
                    style={{ aspectRatio: "16/9" }}
                  >
                    <video
                      key={selectedVideoId}
                      controls
                      className="w-full h-full"
                      controlsList="nodownload"
                      
                    >
                      <source
                        src={getVideoUrl(selectedVideo?.video_url)}
                        type="video/mp4"
                      />
                      Sizning brauzseringiz video tegini qo'llab-quvvatlamaydi.
                    </video>
                  </div>
                ) : (
                  <div
                    className="w-full bg-[#f0f4ff] dark:bg-gray-800 flex items-center justify-center"
                    style={{ aspectRatio: "16/9" }}
                  >
                    <div className="text-center">
                      <PlayCircleIcon
                        style={{ fontSize: 80 }}
                        className="text-[#1f39a1] mb-2"
                      />
                      <p className="text-gray-400">Video topilmadi</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Title */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-100 dark:border-slate-800 mb-6 shadow-sm">
                <h2 className="text-base font-semibold text-[#4a5568] dark:text-white">
                  {selectedLesson?.topic} {selectedVideo && `(${selectedVideo.originalname})`}
                </h2>
              </div>

              {/* ── Tabs (Vazifalar & Ball) ── */}
              <div className="border-b border-gray-200 dark:border-slate-800 flex justify-between items-center pb-2 mb-6">
                <div className="flex gap-6">
                  <button className="text-base font-semibold text-[#1f39a1] dark:text-blue-400 border-b-2 border-[#1f39a1] dark:border-blue-500 pb-2 px-1">
                    Vazifalar
                  </button>
                </div>
                <span className="text-sm font-semibold text-amber-600 dark:text-amber-500">
                  Ball: {homeworkData?.homeworkResult?.grade ?? 0}
                </span>
              </div>

              {/* ── Homework Content ── */}
              {loadingHomework ? (
                <div className="flex justify-center py-10">
                  <div className="w-6 h-6 border-2 border-[#1f39a1] dark:border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : !homework ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
                  Ushbu dars uchun uyga vazifa berilmagan
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Uyga vazifa Box */}
                  <div className="bg-[#f0f4ff] dark:bg-slate-900/40 p-6 rounded-xl border border-amber-100/60 dark:border-slate-800 relative">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <h3 className="text-lg font-bold text-[#4a5568] dark:text-white">
                        Uyga vazifa
                      </h3>
                      
                      <div className="bg-amber-50 dark:bg-amber-950/20 px-6 py-3 rounded-lg text-amber-800 dark:text-amber-200 text-xs font-medium flex items-center gap-1.5 self-start sm:self-auto">
                        <WarningIcon className="text-amber-500" style={{ fontSize: 16 }} />
                        <span>
                          Uyga vazifa muddati: {homework.created_at ? formatDateUz(new Date(homework.created_at).getTime() + 2 * 86400000, true) : "—"}
                        </span>
                      </div>

                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Fayllar soni: {parseHomeworkFiles(homework.file).length}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {homework.title}
                    </p>

                    {parseHomeworkFiles(homework.file).length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {parseHomeworkFiles(homework.file).map((fileName) => (
                          <a
                            key={fileName}
                            href={getHomeworkFileUrl(fileName)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-[#1f39a1] dark:text-blue-400 hover:underline font-semibold bg-white dark:bg-slate-800 px-6 py-3 rounded-lg"
                          >
                            📎 {fileName}
                          </a>
                        ))}
                      </div>
                    )}

                    <div className="text-right mt-4 text-xs text-gray-400 dark:text-gray-500">
                      {formatTimeFirstUz(homework.created_at)}
                    </div>
                  </div>

                  {/* Mening jo'natmalarim Box */}
                  <div className="bg-[#f0f4ff] dark:bg-slate-900/40 p-6 rounded-xl border border-amber-100/60 dark:border-slate-800 relative">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-[#4a5568] dark:text-white">
                        Mening jo'natmalarim
                      </h3>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          Fayllar soni: {homeworkData.studentAnswer?.file ? 1 : 0}
                        </span>
                        {!homeworkData.studentAnswer && (
                          <button
                            onClick={() => setSubmitModalOpen(true)}
                            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 hover:text-[#1f39a1] dark:hover:text-blue-400 transition-colors cursor-pointer"
                          >
                            <EditIcon style={{ fontSize: 18 }} />
                          </button>
                        )}
                      </div>
                    </div>

                    {homeworkData.studentAnswer ? (
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                          {homeworkData.studentAnswer.title}
                        </p>

                        {homeworkData.studentAnswer.file && (
                          <div className="mt-4">
                            <a
                              href={getAnswerFileUrl(homeworkData.studentAnswer.file)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-[#1f39a1] dark:text-blue-400 hover:underline font-semibold bg-white dark:bg-slate-800 px-6 py-3 rounded-lg"
                            >
                              📎 {homeworkData.studentAnswer.file}
                            </a>
                          </div>
                        )}

                        <div className="text-right mt-4 text-xs text-gray-400 dark:text-gray-500">
                          {formatTimeFirstUz(homeworkData.studentAnswer.created_at)}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                        Siz hali uyga vazifa yubormadingiz. Javob yozish va fayl yuklash uchun tahrirlash belgisini bosing.
                      </p>
                    )}
                  </div>

                  {/* O'qituvchi bahosi / fikri */}
                  {homeworkData.homeworkResult && (() => {
                    const isAccepted = homeworkData.homeworkResult.grade >= 60;
                    const examinerName = homeworkData.homeworkResult.teachers?.full_name || 
                      `${homeworkData.homeworkResult.users?.first_name || ""} ${homeworkData.homeworkResult.users?.last_name || ""}`.trim() || 
                      "—";
                    
                    return (
                      <div className="space-y-4">
                        <div className="bg-[#fdfaf7] dark:bg-slate-900 p-6 rounded-xl border border-[#f3e8df] dark:border-slate-800">
                          <div className="flex justify-between items-center mb-5">
                            <span className="text-base font-bold text-gray-800 dark:text-gray-250">
                              O'qituvchi izohi
                            </span>
                            <span className={`text-sm font-bold ${isAccepted ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
                              {isAccepted ? "Vazifa qabul qilindi" : "Vazifa qaytarildi"}
                            </span>
                          </div>
                          
                          {homeworkData.homeworkResult.title && (
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                              {homeworkData.homeworkResult.title}
                            </p>
                          )}
                          
                          <div className="flex justify-between items-end mt-4">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Tekshiruvchi: {examinerName}
                            </span>
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              {formatTimeFirstUz(homeworkData.homeworkResult.created_at)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
                          Qayta topshirish imkoniyati berilmagan
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* ── Vazifa Yuborish Modal ── */}
              {submitModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                  <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden transform transition-all duration-300 animate-in fade-in zoom-in-95">
                    {/* Modal Header */}
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Vazifani yuborish
                      </h3>
                        <button
                          onClick={() => {
                            setSubmitModalOpen(false);
                            setAnswerText("");
                            setAnswerFiles([]);
                          }}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer p-1 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Modal Body */}
                    <form onSubmit={handleSubmitAnswer} className="p-6 space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Tavsif / Havolalar (Description / Links)
                        </label>
                        <textarea
                          rows={4}
                          value={answerText}
                          onChange={(e) => setAnswerText(e.target.value)}
                          placeholder="GitHub linklari yoki javobingizni bu yerda batafsil yozing..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-250 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1f39a1] dark:focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                          required={!answerFiles.length}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Fayl biriktirish (ixtiyoriy)
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            id="answer-file-input"
                            multiple
                            onChange={(e) => setAnswerFiles(Array.from(e.target.files || []))}
                            className="hidden"
                          />
                          <label
                            htmlFor="answer-file-input"
                            className="cursor-pointer px-4 py-2 bg-gray-50 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-[#1f39a1] dark:hover:text-blue-400 transition-colors shadow-sm"
                          >
                            Fayl tanlash
                          </label>
                          <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[250px]">
                            {answerFiles.length ? `${answerFiles.length} ta fayl tanlandi` : "Fayl tanlanmagan"}
                          </span>
                        </div>
                      </div>

                      {/* Modal Footer */}
                      <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setSubmitModalOpen(false);
                            setAnswerText("");
                            setAnswerFiles([]);
                          }}
                          className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          Bekor qilish
                        </button>
                        <button
                          type="submit"
                          disabled={submittingAnswer}
                          className="px-4 py-2 bg-[#1f39a1] dark:bg-blue-600 hover:bg-[#162870] dark:hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          {submittingAnswer ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Yuborilmoqda...
                            </>
                          ) : (
                            "Yuborish"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right Sidebar: Accordion with Topics and Videos (Fixed Width) ── */}
            <div className="w-64 space-y-2">
              {loadingLessons ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-6 h-6 border-3 border-[#1f39a1] dark:border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : lessons.length === 0 ? (
                <div className="p-6 text-center text-gray-400 dark:text-gray-500 text-sm bg-white dark:bg-slate-900 rounded-lg border border-gray-100 dark:border-slate-800">
                  Darslar topilmadi
                </div>
              ) : (
                <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {lessons.map((lesson) => {
                    const isExpanded = expandedLessonId === lesson.id;
                    const lessonVideos = lessonVideosMap[lesson.id] || [];
                    const hasVideos = lessonVideos.length > 0;

                    // Agar ichida videosi yo'q bo'lsa, accordion ko'rsatmaslik
                    if (!hasVideos && !loadingVideos) {
                      return (
                        <div
                          key={lesson.id}
                          className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden"
                        >
                          <button
                            onClick={() => {
                              setSelectedLessonId(lesson.id);
                              setExpandedLessonId(lesson.id);
                            }}
                            className={`w-full text-left px-4 py-3 transition-all duration-300 flex items-center justify-between ${
                              selectedLessonId === lesson.id
                                ? "bg-[#1f39a1] dark:bg-blue-600 text-white shadow-md"
                                : "text-[#4a5568] dark:text-gray-300 hover:bg-[#f0f4ff] dark:hover:bg-slate-800 hover:text-[#1f39a1] dark:hover:text-blue-400"
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm line-clamp-2">
                                {lesson.topic}
                              </p>
                              <p className={`text-xs mt-1 transition-colors duration-300 ${
                                selectedLessonId === lesson.id
                                  ? "text-blue-100 dark:text-blue-200"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}>
                                {formatDateUz(lesson.created_at)}
                              </p>
                            </div>
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={lesson.id}
                        className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden"
                      >
                        {/* ── Lesson Header (Accordion Button) ── */}
                        <button
                          onClick={() => {
                            setSelectedLessonId(lesson.id);
                            setExpandedLessonId(isExpanded ? null : lesson.id);
                          }}
                          className={`w-full text-left px-4 py-3 transition-all duration-300 flex items-center justify-between ${
                            selectedLessonId === lesson.id
                              ? "bg-[#1f39a1] dark:bg-blue-600 text-white shadow-md"
                              : "text-[#4a5568] dark:text-gray-300 hover:bg-[#f0f4ff] dark:hover:bg-slate-800 hover:text-[#1f39a1] dark:hover:text-blue-400"
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm line-clamp-2">
                              {lesson.topic}
                            </p>
                            <p className={`text-xs mt-1 transition-colors duration-300 ${
                              selectedLessonId === lesson.id
                                ? "text-blue-100 dark:text-blue-200"
                                : "text-gray-500 dark:text-gray-400"
                            }`}>
                              {formatDateUz(lesson.created_at)}
                            </p>
                          </div>
                          <KeyboardArrowDownIcon
                            className={`ml-2 flex-shrink-0 transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                            style={{ fontSize: 20 }}
                          />
                        </button>

                        {/* ── Videos List (Accordion Content) ── */}
                        {isExpanded && (
                          <div className="border-t border-gray-100 dark:border-slate-800 divide-y divide-gray-100 dark:divide-slate-800">
                            {lessonVideos.length === 0 ? (
                              <div className="p-4 text-center text-gray-400 dark:text-gray-500 text-xs">
                                Videoolar topilmadi
                              </div>
                            ) : (
                              lessonVideos.map((video, idx) => (
                                <button
                                  key={video.id}
                                  onClick={() => setSelectedVideoId(video.id)}
                                  className={`w-full text-left px-4 py-3 transition-all text-xs flex items-start gap-2 ${
                                    selectedVideoId === video.id
                                      ? "bg-[#f0f4ff] dark:bg-slate-800/60"
                                      : "hover:bg-gray-50 dark:hover:bg-slate-800/30"
                                  }`}
                                >
                                  <PlayCircleIcon
                                    className={`flex-shrink-0 mt-0.5 transition-colors ${
                                      selectedVideoId === video.id
                                        ? "text-[#1f39a1] dark:text-blue-500"
                                        : "text-[#1f39a1]/70 dark:text-blue-400/70"
                                    }`}
                                    style={{ fontSize: 16 }}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                      {idx + 1}-video: {video.originalname}
                                    </p>
                                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-xs">
                                      {formatDateUz(video.created_at)}
                                    </p>
                                  </div>
                                </button>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
